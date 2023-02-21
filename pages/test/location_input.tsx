import Head from 'next/head';
import React, {useRef, useState, useEffect} from 'react';
import mapboxgl from 'mapbox-gl';

export default function Home() {
  mapboxgl.accessToken = "pk.eyJ1IjoiYWxlc3RlcjMiLCJhIjoiY2xlM3JwdDkwMDR6cjNvdGRpanZqZHd0ciJ9.ibQNGDwEE_Wc59LB2dhs9Q";
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map>();
  const [isMapReady, setIsMapReady] = useState(false);
  const [lng, setLng] = useState(-2.3175601);
  const [lat, setLat] = useState(54.70534432);
  const [zoom, setZoom] = useState(5);


  useEffect(() => {
    if (map.current) return; // initialize map only once
    if (mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/dark-v10",
        center: [lng, lat],
        zoom,
        keyboard: false
      });

      const nav = new mapboxgl.NavigationControl({ showCompass: false });
      map.current.addControl(nav, "bottom-right");
      map.current.on("load", () => setIsMapReady(true));
    }
  }, []);

  return (
    <div className="h-full bg-ocf-gray-900">
      <div ref={mapContainer} className="h-full" />
    </div>
  );
}
