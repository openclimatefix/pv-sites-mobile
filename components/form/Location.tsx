import { useState, FC } from 'react';
import Button from '~/components/Button';
import LocationInput from '~/components/LocationInput';

import { useFormContext } from '~/lib/context/form';
import { originalLat, originalLng, zoomLevelThreshold } from '~/lib/utils';

interface Props {
  nextPageCallback: () => void;
  longitude?: number;
  latitude?: number;
}

const Location: FC<Props> = ({ nextPageCallback, longitude, latitude }) => {
  const { siteCoordinates, setSiteCoordinates } = useFormContext();
  const [isSubmissionEnabled, setIsSubmissionEnabled] = useState(false);

  // If the site is being edited, show the original coordinates
  siteCoordinates.longitude = longitude || siteCoordinates.longitude;
  siteCoordinates.latitude = latitude || siteCoordinates.latitude;

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
        className="flex flex-col justify-between py-4 md:py-0 gap-2 relative h-[calc(100vh-var(--nav-height))] md:h-[calc(75vh)] w-screen bg-mapbox-gray-1000"
        id="rootDiv"
      >
        <div className="flex-col justify-end hidden md:flex h-8 short:h-0"></div>
        <div
          className="self-center md:w-1/2 md:min-w-[750px] w-[95%] h-4/6 md:h-full"
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
        {/* next button for mobile */}
        <div className="md:hidden flex mb-10 justify-center self-center w-full h-14">
          <Button
            disabled={!isSubmissionEnabled}
            onClick={onClick}
            variant="solid"
          >
            Next
          </Button>
        </div>
      </div>
      {/* next button for desktop */}
      <div className="hidden absolute md:flex md:flex-row md:justify-end -translate-x-1/2 bottom-0 left-1/2 w-3/4 h-14">
        <Button
          disabled={!isSubmissionEnabled}
          onClick={nextPageCallback}
          variant="solid"
        >
          Next
        </Button>
      </div>
    </>
  );
};

export default Location;
