import { useState, FC } from 'react';
import Button from '~/components/Button';
import LocationInput from '~/components/LocationInput';

import { useFormContext } from '~/lib/context/form_context';
import { originalLat, originalLng, zoomLevelThreshold } from '~/lib/utils';

interface Props {
  nextPageCallback: () => void;
}

const Location: FC<Props> = ({ nextPageCallback }) => {
  const { siteCoordinates, setSiteCoordinates } = useFormContext();
  const [isSubmissionEnabled, setIsSubmissionEnabled] = useState(false);

  const onClick = () => {
    nextPageCallback();
  };

  // The map should zopm into the initial coordinates if they were entered by the user
  const shouldZoomIntoOriginal =
    originalLat !== siteCoordinates.latitude ||
    originalLng !== siteCoordinates.longitude;

  return (
    <>
      <div
        className="flex flex-col gap-2 relative h-[calc(100vh-var(--nav-height))] w-screen bg-mapbox-gray-1000"
        id="rootDiv"
      >
        <div className="flex flex-col justify-end h-10"></div>
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
            initialZoom={shouldZoomIntoOriginal ? 16 : 4}
            canEdit={true}
          />
        </div>
        <div className="md:hidden flex justify-center md:justify-end md:mt-20 mt-10 self-center w-full h-14">
          <Button disabled={!isSubmissionEnabled} onClick={onClick}>
            Next
          </Button>
        </div>
      </div>
      <div className="hidden absolute md:flex md:flex-row md:justify-end bottom-12 left-1/2 -translate-x-1/2 w-3/4 h-14">
        <Button disabled={!isSubmissionEnabled} onClick={nextPageCallback}>
          Next
        </Button>
      </div>
    </>
  );
};

export default Location;
