import Head from 'next/head';
import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useRef, useState, useEffect } from 'react';
import mapboxgl, { AttributionControl } from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

interface MapBoxInputProps {
  setIsSubmissionEnabled: (isSubmissionEnabled: boolean) => void;
  zoomLevelThreshold: number;
}

export default function MapBoxInput({
  setIsSubmissionEnabled,
  zoomLevelThreshold,
}: MapBoxInputProps) {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiYWxlc3RlcjMiLCJhIjoiY2xlM3JwdDkwMDR6cjNvdGRpanZqZHd0ciJ9.ibQNGDwEE_Wc59LB2dhs9Q';
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map>();
  const geocoderContainer = useRef<HTMLDivElement | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [lng, setLng] = useState<number>(-2.3175601);
  const [lat, setLat] = useState<number>(54.70534432);
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
      });
      if (geocoderContainer.current) {
        geocoderContainer.current.appendChild(geocoder.onAdd(map.current));
      }

      const marker = new mapboxgl.Marker({
        draggable: false,
        color: '#FFD053',
      }).setLngLat([lng, lat]);

      map.current.on('load', () => setIsMapReady(true));

      map.current.on('move', () => {
        const newLng = map.current!.getCenter().lng;
        const newLat = map.current!.getCenter().lat;

        setLng(newLng);
        setLat(newLat);
        setZoom(map.current!.getZoom());
        setIsSubmissionEnabled(map.current!.getZoom() > zoomLevelThreshold);
        UpdateMarker(marker, map.current!, zoomLevelThreshold, newLng, newLat);
      });
    }
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div ref={geocoderContainer} id="geocoderContainer" />
      <div ref={mapContainer} className="h-screen" />
    </div>
  );
}

function UpdateMarker(
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
