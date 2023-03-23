import { useRouter } from 'next/router';
import { useState } from 'react';
import Button from '~/components/Button';
import LocationInput from '~/components/LocationInput';

import { useFormContext } from '~/lib/context/form_context';
import { withSites } from '~/lib/utils';

export default function Location() {
  const router = useRouter();
  const { setMapData } = useFormContext();
  const [isSubmissionEnabled, setIsSubmissionEnabled] = useState(false);
  const [lng, setLng] = useState(0);
  const [lat, setLat] = useState(0);
  const zoomLevelThreshold = 10;

  const onClick = () => {
    setMapData(lat, lng);
    router.push('/form/details');
  };

  return (
    <div
      className="flex flex-col gap-2 relative h-[calc(100vh-var(--nav-height))] w-screen bg-mapbox-gray-1000"
      id="rootDiv"
    >
      <div className="flex flex-col justify-end h-16 pl-3">
        <h1 className="font-bold text-4xl text-ocf-gray">Site Location</h1>
      </div>
      <div className="w-full h-4/6" id="mapboxInputWrapper">
        <LocationInput
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

export const getServerSideProps = withSites();
