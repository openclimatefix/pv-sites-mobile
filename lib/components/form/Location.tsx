import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import { useState, FC } from 'react';
import Button from '~/lib/components/Button';
import LocationInput from '~/lib/components/form/LocationInput';

import { useFormContext } from '~/lib/form/context';
import { originalLat, originalLng, zoomLevelThreshold } from '~/lib/utils';

interface Props {
  nextPageCallback: () => void;
  lastPageCallback: () => void;
  longitude?: number;
  latitude?: number;
}

const Location: FC<Props> = ({
  nextPageCallback,
  lastPageCallback,
  longitude,
  latitude,
}) => {
  const { siteCoordinates, setSiteCoordinates } = useFormContext();
  const [isSubmissionEnabled, setIsSubmissionEnabled] = useState(false);

  // If the site is being edited, show the original coordinates
  siteCoordinates.longitude = longitude || siteCoordinates.longitude;
  siteCoordinates.latitude = latitude || siteCoordinates.latitude;

  // The map should zopm into the initial coordinates if they were entered by the user
  const shouldZoomIntoOriginal =
    originalLat !== siteCoordinates.latitude ||
    originalLng !== siteCoordinates.longitude;

  return (
    <>
      <div
        className="bg-mapbox-gray-1000 relative flex h-[calc(100vh-var(--nav-height))] w-screen flex-col justify-between gap-2 py-4 md:h-[85vh] md:py-0"
        id="rootDiv"
      >
        <div
          className="mb-3 flex w-[95%] flex-1 flex-col self-center md:h-full md:w-1/2 md:min-w-[750px]"
          id="mapboxInputWrapper"
        >
          <h1 className="text-xl font-semibold text-ocf-gray md:mt-7 md:text-2xl">
            Where is your solar panel located?
          </h1>
          <div className="flex-1">
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
        </div>
        <div className="mb-3 mt-3 flex items-center justify-center md:mx-auto md:mb-8 md:mt-auto md:w-10/12 md:justify-between">
          <div className="hidden md:block">
            <button
              onClick={lastPageCallback}
              className="flex items-center text-ocf-yellow"
            >
              <ChevronLeftIcon width="24" height="24" />
              Back
            </button>
          </div>
          <Button
            disabled={!isSubmissionEnabled}
            onClick={nextPageCallback}
            variant="solid"
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

export default Location;