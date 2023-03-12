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

interface LocationInputProps {
  setIsSubmissionEnabled: (isSubmissionEnabled: boolean) => void;
  setLngExternal: (lng: number) => void;
  setLatExternal: (lat: number) => void;
  zoomLevelThreshold: number;
}

const originalLng = -2.3175601;
const originalLat = 54.70534432;

const LocationInput: FC<PropsWithChildren<LocationInputProps>> = ({
  setIsSubmissionEnabled,
  setLatExternal,
  setLngExternal,
  zoomLevelThreshold,
}) => {
  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_PUBLIC!;
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map>();
  const geocoderContainer = useRef<HTMLDivElement | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [lng, setLng] = useState<number>(originalLng);
  const [lat, setLat] = useState<number>(originalLat);
  const [zoom, setZoom] = useState<number>(5);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    if (mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v10',
        center: [lng, lat],
        zoom,
        keyboard: false,
        attributionControl: false,
      });

      const nav = new mapboxgl.NavigationControl({ showCompass: false });
      map.current.addControl(nav, 'bottom-right');
      map.current.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
        })
      );

      const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        placeholder: 'Where is your solar panel located?',
        marker: false,
        reverseGeocode: true,
      });
      if (geocoderContainer.current) {
        geocoderContainer.current.appendChild(geocoder.onAdd(map.current));
      }

      const marker = new mapboxgl.Marker({
        draggable: false,
        color: '#FFD053',
      }).setLngLat([lng, lat]);

      map.current.on('load', () => setIsMapReady(true));

      map.current.on('movestart', () => setIsSubmissionEnabled(false));

      let savedLat = originalLng;
      let savedLng = originalLat;

      const moveHandler = () => {
        const newLng = map.current!.getCenter().lng;
        const newLat = map.current!.getCenter().lat;

        setLng(newLng);
        setLat(newLat);
        setLngExternal(newLng);
        setLatExternal(newLat);

        savedLat = newLat;
        savedLng = newLng;

        setZoom(map.current!.getZoom());
        updateMarker(marker, map.current!, zoomLevelThreshold, newLng, newLat);
      };

      map.current.on('move', moveHandler);

      map.current.on('moveend', () => {
        console.log(`${savedLat}, ${savedLng}`);
        geocoder.query(`${savedLat}, ${savedLng}`);
        return setIsSubmissionEnabled(
          map.current!.getZoom() > zoomLevelThreshold
        );
      });
    }
  });

  useEffect(() => {});

  return (
    <div className="flex flex-col h-full">
      <div ref={geocoderContainer} className="z-20" id="geocoderContainer" />
      <div className="h-px w-11/12 self-center bg-white" />
      <div className="relative top-0 flex flex-col flex-1">
        <div className="absolute top-0 w-full h-1/6 bg-gradient-to-b from-mapbox-black-900 to-transparent z-10 pointer-events-none" />
        <div ref={mapContainer} className="h-full" />
        <div className="absolute bottom-0 w-full h-1/6 bg-gradient-to-t from-mapbox-black-900 to-transparent z-10 pointer-events-none" />
      </div>
    </div>
  );
};

function updateMarker(
  marker: mapboxgl.Marker,
  map: mapboxgl.Map,
  zoomLevelThreshold: number,
  lng: number,
  lat: number
) {
  if (map.getZoom() > zoomLevelThreshold) {
    marker.addTo(map);
    marker.setLngLat([lng, lat]);
  } else {
    marker.remove();
  }
}

export default LocationInput;
