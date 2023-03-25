import 'mapbox-gl/dist/mapbox-gl.css';
import React, {
  useRef,
  useState,
  useEffect,
  PropsWithChildren,
  FC,
} from 'react';
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
  const [zoom, setZoom] = useState<number>(initialZoom);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    if (mapContainer.current) {
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
          })
        );
      }

      let popup: mapboxgl.Popup | null = null;

      const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        placeholder: 'Search a location',
        marker: false,
        reverseGeocode: true,
      });

      if (!canEdit) {
        // Prevent user from changing the geocoder input when the map isn't editable
        geocoder.setBbox([0, 0, 0, 0]);
      }

      geocoderContainer.current?.appendChild(geocoder.onAdd(map.current));

      const marker = new mapboxgl.Marker({
        draggable: false,
        color: '#FFD053',
      }).setLngLat([originalLat, originalLng]);

      map.current.on('load', () => {
        if (shouldZoomIntoOriginal) {
          geocoder.query(`${originalLat}, ${originalLng}`).setFlyTo(canEdit);
        }
      });

      map.current.on('idle', () => {
        // Enables fly to animation on search
        geocoder.setFlyTo(true);
      });

      let savedLat = originalLat;
      let savedLng = originalLng;

      const moveHandler = () => {
        const newLng = map.current!.getCenter().lng;
        const newLat = map.current!.getCenter().lat;

        setMapCoordinates({ longitude: newLng, latitude: newLat });

        savedLat = newLat;
        savedLng = newLng;
        updateMarker(
          marker,
          map.current!,
          zoomLevelThreshold,
          newLng,
          newLat,
          canEdit
        );

        setZoom(map.current!.getZoom());
      };

      map.current.on('movestart', () => {
        if (popup) {
          popup.remove();
        }
      });

      map.current.on('moveend', () => {
        const isPastZoomThreshold =
          map.current!.getZoom() >= zoomLevelThreshold;
        if (isPastZoomThreshold) {
          moveHandler();

          // update the search box location based on the final latitude/longitude
          geocoder.query(`${savedLat}, ${savedLng}`).setFlyTo(false);

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

        return setIsSubmissionEnabled(isPastZoomThreshold);
      });
    }
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

  return (
    <div className={`flex flex-col ${canEdit ? 'h-full' : 'h-5/6'}`}>
      <div ref={geocoderContainer} className="z-20" id="geocoderContainer" />
      <div className="w-11/12 self-center bg-white" />
      <div className="relative top-0 flex flex-col flex-1">
        <div className="absolute top-0 w-full h-1/6 bg-gradient-to-b from-mapbox-black-900 to-transparent z-10 pointer-events-none" />
        <div ref={mapContainer} className="h-full" />
        <div className="absolute bottom-0 w-full h-1/6 bg-gradient-to-t from-mapbox-black-900 to-transparent z-10 pointer-events-none" />
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
