import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { FC, useEffect, useRef, useState } from 'react';
import { LatitudeLongitude } from '~/lib/types';
import { reverseGeocodeWithoutFocus } from '~/lib/utils';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_PUBLIC!;

interface LocationInputProps {
  latitude: number;
  longitude: number;
  setMapCoordinates: ({ longitude, latitude }: LatitudeLongitude) => void;
  zoomLevelThreshold: number;
  initialZoom?: number;
  canEdit: boolean;
}

const LocationInput: FC<LocationInputProps> = ({
  latitude,
  longitude,
  setMapCoordinates,
  zoomLevelThreshold,
  initialZoom,
  canEdit,
}) => {
  const [seenDragMessage, setSeenDragMessage] = useState(false);

  const mapContainer = useRef<HTMLDivElement>(null);
  const geocoderContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map>();
  const geocoder = useRef<MapboxGeocoder>();
  const popup = useRef<mapboxgl.Popup>();
  const marker = useRef<mapboxgl.Marker>();

  // Set up the map instance
  useEffect(() => {
    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/alester3/clf1lj7jg000b01n4ya2880gi',
      center: [longitude, latitude],
      zoom: initialZoom ?? 4,
      keyboard: false,
      attributionControl: false,
      interactive: canEdit,
    });

    marker.current = new mapboxgl.Marker({
      draggable: false,
      color: '#FFD053',
    }).setLngLat([longitude, latitude]);

    popup.current = new mapboxgl.Popup({
      offset: [0, 10],
      anchor: 'top',
      closeOnClick: false,
      closeButton: false,
      className: 'mapbox-popup',
    });

    const navControl = new mapboxgl.NavigationControl({ showCompass: false });
    const geolocateControl = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
    });

    map.current.addControl(navControl, 'bottom-right');
    if (canEdit) {
      map.current.addControl(geolocateControl);
    }

    return () => {
      map.current?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Set up map listeners
  useEffect(() => {
    if (!map.current) return;

    const onLoad = () => {
      if (initialZoom) {
        geocoder.current?.query(`${latitude}, ${longitude}`).setFlyTo(canEdit);
        updateMarker(
          marker.current!,
          map.current!,
          zoomLevelThreshold,
          longitude,
          latitude,
          canEdit
        );
      }
    };

    const onIdle = () => {
      geocoder.current?.setFlyTo({ curve: 1.2, speed: 5 });
      geocoder.current?.setRenderFunction(canEdit ? renderFunction : () => '');
    };

    const onMove = () => {
      popup.current?.remove();

      const { lng: longitude, lat: latitude } = map.current!.getCenter();

      updateMarker(
        marker.current!,
        map.current!,
        zoomLevelThreshold,
        longitude,
        latitude,
        canEdit
      );

      const isPastZoomThreshold = map.current!.getZoom() >= zoomLevelThreshold;
      if (isPastZoomThreshold) {
        setMapCoordinates({ longitude, latitude });
      }
    };

    const onMoveEnd = async () => {
      const isPastZoomThreshold = map.current!.getZoom() >= zoomLevelThreshold;
      if (!isPastZoomThreshold) return;

      // update the search box location based on the final latitude/longitude
      geocoder.current?.setFlyTo(false);

      // don't display anything in suggestions
      geocoder.current?.setRenderFunction(
        () => '<div class="hidden-suggestion"/>'
      );

      const result = await reverseGeocodeWithoutFocus(
        geocoder.current!,
        latitude,
        longitude
      );
      if (!result) {
        popup.current?.remove();

        popup.current
          ?.setLngLat([longitude, latitude])
          .setHTML(
            '<p>Only locations within the UK are currently supported</p>'
          )
          .addTo(map.current!);
      }

      if (!seenDragMessage && !popup.current?.isOpen() && canEdit) {
        popup.current
          ?.setLngLat([longitude, latitude])
          .setHTML('<p>Drag map to pinpoint exact location.</p>')
          .addTo(map.current!);
        setSeenDragMessage(true);
      }
    };

    map.current.on('load', onLoad);
    map.current.on('idle', onIdle);
    map.current.on('move', onMove);
    map.current.on('moveend', onMoveEnd);

    return () => {
      map.current?.off('load', onLoad);
      map.current?.off('idle', onIdle);
      map.current?.off('move', onMove);
      map.current?.off('moveend', onMoveEnd);
    };
  }, [
    longitude,
    latitude,
    initialZoom,
    canEdit,
    zoomLevelThreshold,
    seenDragMessage,
    setSeenDragMessage,
    setMapCoordinates,
  ]);

  // Set up the geocoder instance
  useEffect(() => {
    if (!map.current) return;

    const container = geocoderContainer.current!;

    geocoder.current = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      countries: 'GB',
      placeholder: 'Search a location',
      marker: false,
      render: canEdit ? renderFunction : () => '',
      reverseGeocode: true,
      limit: 3,
    });

    // geocoder.current.addTo(container);
    geocoderContainer.current?.appendChild(
      geocoder.current.onAdd(map.current!)
    );

    if (!canEdit) {
      // Prevent user from changing the geocoder input when the map isn't editable
      geocoder.current.setBbox([0, 0, 0, 0]);
    }

    return () => {
      container.innerHTML = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

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
          className="h-full rounded-3xl"
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

function renderFunction(item: MapboxGeocoder.Result) {
  const placeName = item.place_name.split(',');
  return `<div class="mapboxgl-ctrl-geocoder--suggestion"><div class="mapboxgl-ctrl-geocoder--suggestion-title">
        ${placeName[0]}
        </div><div class="mapboxgl-ctrl-geocoder--suggestion-address">
        ${placeName.splice(1, placeName.length).join(',')}
        </div></div>`;
}

export default LocationInput;
