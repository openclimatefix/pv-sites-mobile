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
export const originalLat = 51.5072;
export const originalLng = 0.1276;

/*
  Represents the zoom threshold for the Site map. 
  We will track solar sites when the map is zoomed in less than this value.
*/
export const zoomLevelThreshold = 14;

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
export const hyphensToTitleCase = (page: string) => {
  return page
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
