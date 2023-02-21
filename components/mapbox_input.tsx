
import Head from 'next/head';
import "mapbox-gl/dist/mapbox-gl.css";
import React, {useRef, useState, useEffect} from 'react';
import mapboxgl from 'mapbox-gl';
export default function MapBoxInput() {
    mapboxgl.accessToken = "pk.eyJ1IjoiYWxlc3RlcjMiLCJhIjoiY2xlM3JwdDkwMDR6cjNvdGRpanZqZHd0ciJ9.ibQNGDwEE_Wc59LB2dhs9Q";
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const map = useRef<mapboxgl.Map>();
    const [isMapReady, setIsMapReady] = useState(false);
    const [lng, setLng] = useState<number>(-2.3175601);
    const [lat, setLat] = useState<number>(54.70534432);
    const [zoom, setZoom] = useState<number>(5);
  
  
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
        map.current.addControl(
          new mapboxgl.GeolocateControl({
            positionOptions: {
            enableHighAccuracy: true
            },
          })
        );

        const marker = new mapboxgl.Marker({
          draggable: true
          })
          .setLngLat([lng, lat])
          .addTo(map.current);

        map.current.on("load", () => setIsMapReady(true));
        map.current.on('move', () => {
            const newLng = map.current!.getCenter().lng;
            const newLat = map.current!.getCenter().lat;
            setLng(newLng);
            setLat(newLat);
            setZoom(map.current!.getZoom());
            marker.setLngLat([newLng, newLat]);
        });
      }
    }, []);
  
    return (
      <div className="flex-col h-full w-full bg-ocf-gray-900">
        <h1> Longitude: {lng} </h1>
        <h1> Latitude: {lat} </h1>
        <h1> Zoom: {zoom} </h1>
        <div ref={mapContainer} className="h-full" />
      </div>
    );
}