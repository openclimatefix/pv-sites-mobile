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

      const marker = new mapboxgl.Marker({
        draggable: false,
        color: '#FFD053',
      }).setLngLat([originalLat, originalLng]);

      map.current.on('load', () => {
        geocoderContainer.current?.appendChild(geocoder.onAdd(map.current!));
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
        // @ts-ignore
        // document.getElementsByClassName('mapboxgl-ctrl-geocoder--input')[0].blur();
        // if (!geocoderContainer.current?.firstChild) {
        //   geocoderContainer.current?.appendChild(geocoder.onAdd(map.current!));
        // }
        // geocoderContainer.current?.blur();
      });

      let savedLat = originalLat;
      let savedLng = originalLng;

      map.current.on('movestart', () => {
        if (popup) {
          popup.remove();
        }
        setIsSubmissionEnabled(false);
      });

      // Saves the map center latitude/longitude to the form context
      const saveSiteLocation = () => {
        const newLng = map.current!.getCenter().lng;
        const newLat = map.current!.getCenter().lat;

        setMapCoordinates({ longitude: newLng, latitude: newLat });

        savedLat = newLat;
        savedLng = newLng;
      };

      map.current.on('move', () => {
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

        const isPastZoomThreshold =
          map.current!.getZoom() >= zoomLevelThreshold;

        if (isPastZoomThreshold) {
          // save the map coordinates
          saveSiteLocation();
        }
      });

      map.current.on('moveend', () => {
        const isPastZoomThreshold =
          map.current!.getZoom() >= zoomLevelThreshold;
        if (isPastZoomThreshold) {
          // update the search box location based on the final latitude/longitude
          geocoder.setFlyTo(false);
          // map.current!.removeControl(geocoder);
          // geocoderContainer.current?.firstElementChild?.children[1].setAttribute('onfocus', 'this.blur()')

          //don't display anything 
          geocoder.setRenderFunction((result) => '')
          geocoder.query(`${savedLat}, ${savedLng}`);
          //@ts-ignore
          // document.getElementsByClassName('suggestions-wrapper')[0].style.display = 'none';
          // geocoderContainer.current?.blur();

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

        // document
        //   .getElementsByClassName('mapboxgl-ctrl-geocoder--input')[0] // @ts-ignore
        //   .blur(); 

        return setIsSubmissionEnabled(isPastZoomThreshold);
      });
      // // geocoder.on('loading', () => {map.current?.getCanvas().click()})
      // geocoder.on('results', () => {map.current?.getCanvas().focus()});
      // geocoder.on('clear', () => {map.current?.getCanvas().click()});
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
      <div
        ref={geocoderContainer}
        className="z-20 bg-ocf-black"
        id="geocoderContainer"
      />
      <div className="w-11/12 self-center bg-white" />
      <div className="relative top-0 flex flex-col flex-1">
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

export default LocationInput;
