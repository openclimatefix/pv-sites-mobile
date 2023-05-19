import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { useSites } from './sites';
import { useRouter } from 'next/router';
import { RefObject, useEffect, useState } from 'react';

/**
 * Turn a HTML element ID string (an-element-id) into camel case (anElementId)
 * @param id the HTML element id
 * @returns the id in camel case
 */
export function camelCaseID(id: string) {
  const [first, ...rest] = id.split('-');
  const capitalize = (part: string) =>
    part[0].toUpperCase() + part.substring(1);
  return [first, ...rest.map(capitalize)].join('');
}

/* Latitude/longitude for London, England */
export const defaultLatitude = 51.5072;
export const defaultLongitude = 0.1276;

/*
  Represents the zoom threshold for the Site map. 
  We will track solar sites when the map is zoomed in less than this value.
*/
export const zoomLevelThreshold = 14;

/**
 * Prevents scrolling on this page to support page transitions
 */
export function useNoScroll() {
  const router = useRouter();
  useEffect(() => {
    window.history.scrollRestoration = 'manual';

    router.beforePopState((state) => {
      state.options.scroll = false;
      return true;
    });
  }, [router]);
}

export function useMediaQuery(query: string) {
  const matchMedia = (query: string) => {
    if (typeof window === 'undefined') {
      return { matches: false };
    }
    return window.matchMedia(query);
  };

  const [matches, setMatches] = useState(matchMedia(query).matches);

  useEffect(() => {
    const mediaQueryList = matchMedia(query);

    if (!('addEventListener' in mediaQueryList)) return;

    const onChange = (mediaQueryList: MediaQueryListEvent) => {
      setMatches(mediaQueryList.matches);
    };

    mediaQueryList.addEventListener('change', onChange);
    return () => mediaQueryList.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

export function useIsMobile() {
  // Tailwind `md` breakpoint: https://tailwindcss.com/docs/screens
  return useMediaQuery('(max-width: 768px)');
}

export function useIsSitePage() {
  const { asPath } = useRouter();
  const { sites } = useSites();

  const isSitePage = sites.length > 1 && asPath.match(/\/dashboard\/.+/);

  return isSitePage;
}

/**
 * Determines if the user clicked outside the ref
 * @param ref reference to an HTML component
 * @param handle function to call after a click outside the ref is detected
 */
export function useClickedOutside(ref: RefObject<any>, handler: () => void) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target)) {
        handler();
      }
    };

    document.addEventListener('click', handleClickOutside, { capture: true });
    return () => document.removeEventListener('click', handleClickOutside);
  }, [ref, handler]);
}

/**
 * Turns URL into capitalized title
 * @param page page url to convert to title
 */
export function hyphensToTitleCase(page: string) {
  return page
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function sleep(millis: number) {
  return new Promise((resolve) => setTimeout(resolve, millis));
}

/**
 * Uses a MapboxGeocoder instance to reverse geocode a latitude and longitude and replace the value
 * with the reverse geocoded output.
 * @param geocoder the MapboxGeocoder instance
 * @param latitude the latitude to reverse geocode
 * @param longitude the longitude to reverse geocode
 */
export async function reverseGeocodeWithoutFocus(
  geocoder: MapboxGeocoder,
  latitude: number,
  longitude: number
) {
  // The below `_geocode` call performs the same action that the MapBox geocoder does, except it
  // does not re-focus the input element after a successful geocode response
  const geocoderPrivate = geocoder as any;
  const response = await geocoderPrivate._geocode(`${latitude}, ${longitude}`);

  const results = response.body;
  if (!results.features.length) return;

  const result = results.features[0];
  geocoderPrivate._typeahead.selected = result;
  geocoderPrivate._inputEl.value = result.place_name;
  const selected = geocoderPrivate._typeahead.selected;

  if (selected && JSON.stringify(selected) !== geocoderPrivate.lastSelected) {
    geocoderPrivate._hideClearButton();
    if (geocoderPrivate.options.flyTo) {
      geocoderPrivate._fly(selected);
    }
    if (geocoderPrivate.options.marker && geocoderPrivate._mapboxgl) {
      geocoderPrivate._handleMarker(selected);
    }

    // After selecting a feature, re-focus the textarea and set
    // cursor at start.
    geocoderPrivate._inputEl.scrollLeft = 0;
    geocoderPrivate.lastSelected = JSON.stringify(selected);

    geocoderPrivate._eventEmitter.emit('result', {
      result: selected,
    });
    geocoderPrivate.eventManager.select(selected, geocoder as any);
  }

  return result;
}
