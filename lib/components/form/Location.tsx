import { useState, FC } from 'react';
import Button from '~/lib/components/Button';
import LocationInput from '~/lib/components/LocationInput';

import { useFormContext } from '~/lib/form/context';
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
        className="bg-mapbox-gray-1000 relative flex h-[calc(100vh-var(--nav-height))] w-screen flex-col justify-between gap-2 py-4 md:h-[calc(75vh)] md:py-0"
        id="rootDiv"
      >
        <div className="hidden h-8 flex-col justify-end md:flex short:h-0"></div>
        <div
          className="h-4/6 w-[95%] self-center md:h-full md:w-1/2 md:min-w-[750px]"
          id="mapboxInputWrapper"
        >
          <h1 className="pl-3 text-xl font-medium text-ocf-gray md:pl-0 md:text-3xl">
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
        <div className="mb-10 flex h-14 w-full justify-center self-center md:hidden">
          <Button disabled={!isSubmissionEnabled} onClick={onClick}>
            Next
          </Button>
        </div>
      </div>
      {/* next button for desktop */}
      <div className="absolute bottom-0 left-1/2 hidden h-14 w-3/4 -translate-x-1/2 md:flex md:flex-row md:justify-end">
        <Button disabled={!isSubmissionEnabled} onClick={nextPageCallback}>
          Next
        </Button>
      </div>
    </>
  );
};

export default Location;
