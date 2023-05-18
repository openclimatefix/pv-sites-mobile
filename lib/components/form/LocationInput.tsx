import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useRef, useState, useEffect, FC } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { LatitudeLongitude } from '~/lib/types';

interface LocationInputProps {
  originalLng: number;
  originalLat: number;
  shouldZoomIntoOriginal: boolean;
  setIsSubmissionEnabled: (isSubmissionEnabled: boolean) => void;
  setMapCoordinates: ({ longitude, latitude }: LatitudeLongitude) => void;
  zoomLevelThreshold: number;
  initialZoom: number;
  canEdit: boolean;
}

const LocationInput: FC<LocationInputProps> = ({
  originalLat,
  originalLng,
  shouldZoomIntoOriginal,
  setMapCoordinates,
  setIsSubmissionEnabled,
  zoomLevelThreshold,
  initialZoom,
  canEdit,
}) => {
  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_PUBLIC!;
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map>();
  const geocoderContainer = useRef<HTMLDivElement | null>(null);
  const [isPastZoomThreshold, setIsPastZoomThreshold] = useState(false);
  const [isInUK, setIsInUK] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [zoom, setZoom] = useState(initialZoom);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/alester3/clf1lj7jg000b01n4ya2880gi',
      center: [originalLng, originalLat],
      zoom,
      keyboard: false,
      attributionControl: false,
      interactive: canEdit,
    });

    const nav = new mapboxgl.NavigationControl({ showCompass: false });
    map.current.addControl(nav, 'bottom-right');

    // Adds a current location button
    if (canEdit) {
      map.current.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
        }),
        'bottom-right'
      );
    }

    let popup: mapboxgl.Popup | null = null;

    const renderFunction = (item: MapboxGeocoder.Result) => {
      var placeName = item.place_name.split(',');
      return canEdit
        ? '<div class="mapboxgl-ctrl-geocoder--suggestion"><div class="mapboxgl-ctrl-geocoder--suggestion-title">' +
            placeName[0] +
            '</div><div class="mapboxgl-ctrl-geocoder--suggestion-address">' +
            placeName.splice(1, placeName.length).join(',') +
            '</div></div>'
        : '';
    };

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      countries: 'GB',
      placeholder: 'Search a location',
      marker: false,
      render: renderFunction,
      reverseGeocode: true,
      limit: 3,
    });

    // geocoderContainer.current?.appendChild(geocoder.onAdd(map.current!));
    map.current.addControl(geocoder, 'top-left');

    if (!canEdit) {
      // Prevent user from changing the geocoder input when the map isn't editable
      geocoder.setBbox([0, 0, 0, 0]);
    }

    const marker = new mapboxgl.Marker({
      draggable: false,
      color: '#FFD053',
    }).setLngLat([originalLat, originalLng]);

    map.current.on('load', () => {
      if (shouldZoomIntoOriginal) {
        geocoder.query(`${originalLat}, ${originalLng}`).setFlyTo(canEdit);
        updateMarker(
          marker,
          map.current!,
          zoomLevelThreshold,
          originalLng,
          originalLat,
          canEdit
        );
      }
    });

    map.current.on('idle', () => {
      // Enables fly to animation on search
      geocoder.setFlyTo({ curve: 1.2, speed: 5 });
      geocoder.setRenderFunction(renderFunction);
    });

    let savedLat = originalLat;
    let savedLng = originalLng;

    // Saves the map center latitude/longitude to the form context
    const saveSiteLocation = () => {
      const newLng = map.current!.getCenter().lng;
      const newLat = map.current!.getCenter().lat;

      setMapCoordinates({ longitude: newLng, latitude: newLat });

      savedLat = newLat;
      savedLng = newLng;
    };

    map.current.on('move', () => {
      if (popup) {
        popup.remove();
      }

      const newLng = map.current!.getCenter().lng;
      const newLat = map.current!.getCenter().lat;

      updateMarker(
        marker,
        map.current!,
        zoomLevelThreshold,
        newLng,
        newLat,
        canEdit
      );

      setZoom(map.current!.getZoom());

      const isPastZoomThreshold = map.current!.getZoom() >= zoomLevelThreshold;

      if (isPastZoomThreshold) {
        // save the map coordinates
        saveSiteLocation();
      }
      setIsMoving(true);
    });

    map.current.on('moveend', () => {
      const isPastZoomThreshold = map.current!.getZoom() >= zoomLevelThreshold;
      if (isPastZoomThreshold) {
        // update the search box location based on the final latitude/longitude
        geocoder.setFlyTo(false);

        // don't display anything in suggestions
        geocoder.setRenderFunction(() => '<div class="hidden-suggestion"/>');

        // The below `_geocode` call performs the same action that the MapBox geocoder does, except it
        // does not re-focus the input element after a successful geocode response
        const geocoderPrivate = geocoder as any;
        geocoderPrivate
          ._geocode(`${savedLat}, ${savedLng}`)
          .then((response: any) => {
            const results = response.body;
            if (!results.features.length) return;
            const result = results.features[0];
            geocoderPrivate._typeahead.selected = result;
            geocoderPrivate._inputEl.value = result.place_name;
            const selected = geocoderPrivate._typeahead.selected;
            if (
              selected &&
              JSON.stringify(selected) !== geocoderPrivate.lastSelected
            ) {
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
          });

        if (popup === null && map.current && canEdit) {
          popup = new mapboxgl.Popup({
            offset: [0, 10],
            anchor: 'top',
            closeOnClick: false,
            closeButton: false,
            className: 'site-map',
          })
            .setLngLat([savedLng, savedLat])
            .setHTML('<p>Drag map to pinpoint exact location.</p>')
            .addTo(map.current);
        }
      }
      setIsMoving(false);
      setIsPastZoomThreshold(isPastZoomThreshold);
    });

    geocoder.on('result', (result) => {
      const isUK =
        result.result.context.find((e: Record<string, string>) =>
          e.id.includes('country')
        ).short_code === 'gb';

      if (!isUK && map.current) {
        popup = new mapboxgl.Popup({
          offset: [0, 10],
          anchor: 'top',
          closeOnClick: false,
          closeButton: false,
          className: 'site-map',
        })
          .setLngLat([savedLng, savedLat])
          .setHTML(
            '<p>Only locations within the UK are currently supported</p>'
          )
          .addTo(map.current);
      }
      setIsInUK(isUK);
    });
  }, [
    canEdit,
    shouldZoomIntoOriginal,
    originalLat,
    originalLng,
    setIsSubmissionEnabled,
    setMapCoordinates,
    zoom,
    zoomLevelThreshold,
  ]);

  useEffect(() => {
    setIsSubmissionEnabled(isInUK && isPastZoomThreshold && !isMoving);
  }, [isInUK, isPastZoomThreshold, setIsSubmissionEnabled, isMoving]);

  return (
    <div className={`flex h-full flex-col`}>
      <div
        ref={geocoderContainer}
        className="z-20 bg-ocf-black"
        id="geocoderContainer"
      />
      <div className="relative top-0 flex flex-1 flex-col">
        <div
          ref={mapContainer}
          className="h-full rounded-xl"
          id="mapContainer"
        />
      </div>
    </div>
  );
};

/**
 * Display a marker on the map if the map is zoomed in beyond a threshold or the map isn't editable
 */
function updateMarker(
  marker: mapboxgl.Marker,
  map: mapboxgl.Map,
  zoomLevelThreshold: number,
  lng: number,
  lat: number,
  canEdit: boolean
) {
  if (map.getZoom() > zoomLevelThreshold || !canEdit) {
    marker.addTo(map);
    marker.setLngLat([lng, lat]);
  } else {
    marker.remove();
  }
}

export default LocationInput;
