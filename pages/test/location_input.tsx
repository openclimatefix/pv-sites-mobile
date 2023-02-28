import { useState } from 'react';
import Button from '~/components/Button';
import MapBoxInput from '~/components/mapbox_input';

export default function Home() {
  const [isSubmissionEnabled, setIsSubmissionEnabled] = useState(false);
  const [zoomLevelThreshold, setZoomLevelThreshold] = useState(10);

  return (
    <div
      className="flex flex-col gap-2 relative h-screen w-screen bg-mapbox-black-900"
      id="rootDiv"
    >
      <div className="flex flex-col justify-end h-1/6 pl-3">
        <h1 className="font-bold text-4xl text-ocf-gray">Site Location</h1>
      </div>
      <div className="w-full h-4/6" id="mapboxInputWrapper">
        <MapBoxInput
          setIsSubmissionEnabled={setIsSubmissionEnabled}
          zoomLevelThreshold={zoomLevelThreshold}
        />
      </div>
      <div className="self-center w-4/5 h-14">
        <Button enabled={isSubmissionEnabled}>Next</Button>
      </div>
    </div>
  );
}
