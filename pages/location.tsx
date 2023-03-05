import { useRouter } from 'next/router';
import { useState } from 'react';
import Button from '~/components/Button';
import MapBoxInput from '~/components/mapbox_input';

import { useFormContext } from '~/lib/context/form_context';

export default function Home() {
  const router = useRouter();
  const { setMapData } = useFormContext();
  const [isSubmissionEnabled, setIsSubmissionEnabled] = useState(false);
  const [lng, setLng] = useState(0);
  const [lat, setLat] = useState(0);
  const zoomLevelThreshold = 10;

  const onClick = () => {
    setMapData(lat, lng);
    router.push('/form');
  };

  return (
    <div
      className="flex flex-col gap-2 relative h-screen w-screen bg-mapbox-black-900"
      id="rootDiv"
    >
      <div className="flex flex-col justify-end h-16 pl-3">
        <h1 className="font-bold text-4xl text-ocf-gray">Site Location</h1>
      </div>
      <div className="w-full h-4/6" id="mapboxInputWrapper">
        <MapBoxInput
          setIsSubmissionEnabled={setIsSubmissionEnabled}
          setLngExternal={setLng}
          setLatExternal={setLat}
          zoomLevelThreshold={zoomLevelThreshold}
        />
      </div>
      <div className="self-center w-4/5  max-w-sm h-14">
        <Button enabled={isSubmissionEnabled} onClick={onClick}>
          Next
        </Button>
      </div>
    </div>
  );
}
