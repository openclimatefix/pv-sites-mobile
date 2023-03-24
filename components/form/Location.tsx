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
  const { siteCoordinates, setSiteCoordinates } = useFormContext();
  const [isSubmissionEnabled, setIsSubmissionEnabled] = useState(false);
  const zoomLevelThreshold = 10;

  const onClick = () => {
    nextPageCallback();
  };

  // The map should zopm into the initial coordinates if they were entered by the user
  const shouldZoomIntoOriginal =
    originalLat !== siteCoordinates.latitude ||
    originalLng !== siteCoordinates.longitude;

  return (
    <div
      className="flex flex-col gap-2 relative h-[calc(100vh-var(--nav-height))] w-screen bg-mapbox-gray-1000"
      id="rootDiv"
    >
      <div className="flex flex-col justify-end h-16 pl-3"></div>
      <div
        className="self-center md:w-7/12 w-full h-4/6"
        id="mapboxInputWrapper"
      >
        <h1 className="font-medium md:text-3xl text-xl text-ocf-gray pl-3 md:pl-0">
          Where is your solar panel located?
        </h1>
        <LocationInput
          shouldZoomIntoOriginal={shouldZoomIntoOriginal}
          originalLat={siteCoordinates.latitude}
          originalLng={siteCoordinates.longitude}
          setIsSubmissionEnabled={setIsSubmissionEnabled}
          setMapCoordinates={setSiteCoordinates}
          zoomLevelThreshold={zoomLevelThreshold}
        />
      </div>
      <div className="flex justify-center md:justify-end md:mt-20 mt-10 self-center w-full h-14">
        <Button enabled={isSubmissionEnabled} onClick={onClick}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default Location;
