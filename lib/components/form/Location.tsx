import { FC, useState } from 'react';
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

  // The map should zoom into the initial coordinates if they were entered by the user
  const shouldZoomIntoOriginal =
    originalLat !== formData.latitude || originalLng !== formData.longitude;

  return (
    <>
      <div
        className="bg-mapbox-gray-1000 relative flex h-[calc(100vh-var(--nav-height))] w-screen flex-col justify-between gap-2 py-4 lg:h-[85vh] lg:py-0"
        id="rootDiv"
      >
        <div
          className="mb-3 flex w-[95%] max-w-md flex-1 flex-col self-center lg:h-full lg:w-1/2 lg:min-w-[750px] lg:max-w-full"
          id="mapboxInputWrapper"
        >
          <h1 className="mb-3 text-xl font-semibold text-ocf-gray lg:mb-5 lg:mt-7 lg:text-xl">
            Where is your site located?
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
        <div className="mb-3 mt-3 flex items-center justify-center lg:mx-auto lg:mb-8 lg:mt-auto lg:w-10/12 lg:justify-between">
          <div className="hidden lg:block">
            {!isEditing && (
              <Button
                form="panel-form"
                onClick={lastPageCallback}
                variant="outlined"
                className="w-[100px]"
              >
                Back
              </Button>
            )}
          </div>
          <Button
            disabled={!isSubmissionEnabled}
            onClick={nextPageCallback}
            variant="solid"
            className="w-11/12 max-w-md lg:w-[100px]"
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

export default Location;
