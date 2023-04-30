import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import { useState, FC } from 'react';
import Button from '~/lib/components/Button';
import LocationInput from '~/lib/components/form/LocationInput';

import { originalLat, originalLng, zoomLevelThreshold } from '~/lib/utils';
import { SiteFormData } from './SiteDetails';

interface Props {
  nextPageCallback: () => void;
  lastPageCallback: () => void;
  formData: SiteFormData;
  setFormData: (data: SiteFormData) => void;
  isEditing: boolean;
}

const Location: FC<Props> = ({
  nextPageCallback,
  lastPageCallback,
  formData,
  setFormData,
  isEditing = false,
}) => {
  const [isSubmissionEnabled, setIsSubmissionEnabled] = useState(false);

  // The map should zopm into the initial coordinates if they were entered by the user
  const shouldZoomIntoOriginal =
    originalLat !== formData.latitude || originalLng !== formData.longitude;

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
              originalLat={formData.latitude}
              originalLng={formData.longitude}
              setIsSubmissionEnabled={setIsSubmissionEnabled}
              setMapCoordinates={({ longitude, latitude }) =>
                setFormData({
                  ...formData,
                  longitude,
                  latitude,
                })
              }
              zoomLevelThreshold={zoomLevelThreshold}
              initialZoom={shouldZoomIntoOriginal ? 16 : 4}
              canEdit={true}
            />
          </div>
        </div>
        <div className="mb-3 mt-3 flex items-center justify-center md:mx-auto md:mb-8 md:mt-auto md:w-10/12 md:justify-between">
          <div className="hidden md:block">
            {!isEditing && (
              <Button
                form="panel-form"
                onClick={lastPageCallback}
                variant="outlined"
                className="w-[250px]"
              >
                Back
              </Button>
            )}
          </div>
          <Button
            disabled={!isSubmissionEnabled}
            onClick={nextPageCallback}
            variant="solid"
            className="w-[250px]"
          >
            {isEditing ? 'Continue' : 'Next'}
          </Button>
        </div>
      </div>
    </>
  );
};

export default Location;
