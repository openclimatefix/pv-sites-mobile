import { useRouter } from 'next/router';
import { useState, FC } from 'react';
import Button from '~/components/Button';
import LocationInput from '~/components/LocationInput';

import { useFormContext } from '~/lib/context/form_context';
import { originalLat, originalLng } from '~/lib/utils';

interface Props {
  nextPageCallback: () => void;
}

const Location: FC<Props> = ({ nextPageCallback }) => {
  const { latLong: [contextLat, contextLng], setMapData } = useFormContext();
  const [isSubmissionEnabled, setIsSubmissionEnabled] = useState(false);

  const [lat, setLat] = useState(contextLat);
  const [lng, setLng] = useState(contextLng);
  const zoomLevelThreshold = 10;

  const onClick = () => {
    setMapData(lat, lng);
    nextPageCallback();
  };

  // The map should zopm into the initial coordinates if they were entered by the user
  const shouldZoomIntoOriginal = originalLat !== contextLat || originalLng !== contextLng;

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
          shouldZoomIntoOriginal={shouldZoomIntoOriginal}
          originalLat={lat}
          originalLng={lng}
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
};

export default Location;
