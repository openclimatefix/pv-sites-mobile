import { FC, useState } from 'react';

import Input from '~/lib/components/form/Input';
import Modal from '~/lib/components/Modal';
import Spinner from '~/lib/components/Spinner';

import Button from '~/lib/components/Button';
import { zoomLevelThreshold } from '../../utils';
import LocationInput from './LocationInput';
import { SiteFormData } from './SiteDetails';
import { Site } from '~/lib/types';

/**
 * Prevent users from entering negative numbers into input fields
 * @param e React.KeyboardEvent<HTMLInputElement> Represents a single interaction between the user and a key
 * @returns True if the character is valid
 */
const preventMinus = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.code === 'Minus') {
    e.preventDefault();
  }
};

interface Props {
  lastPageCallback: () => void;
  nextPageCallback: (site?: Site) => void;
  formData: SiteFormData;
  setFormData: (data: SiteFormData) => void;
  submitForm: () => Promise<Response | undefined>;
  mapButtonCallback: () => void;
  isEditing: boolean;
  edited: boolean;
}

const Details: FC<Props> = ({
  lastPageCallback,
  nextPageCallback,
  formData,
  setFormData,
  submitForm,
  mapButtonCallback,
  isEditing,
  edited,
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [didSubmit, setDidSubmit] = useState<boolean>(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!didSubmit) {
      setDidSubmit(true);
      const res = await submitForm();
      if (res) {
        const site = (await res.json()) as Site;
        nextPageCallback(site);
      }
    }
  };

  console.log(edited);

  return (
    <div className="mb-[max(var(--bottom-nav-margin),20px)] flex flex-col gap-10">
      <div className="flex w-4/5 flex-row self-center md:w-9/12">
        <div className="hidden flex-1 flex-col px-8 md:flex">
          <h1 className="mt-2 text-2xl font-semibold dark:text-ocf-gray md:text-3xl">
            Your site&apos;s details
          </h1>
          <div className="w-full flex-1" onClick={mapButtonCallback}>
            <LocationInput
              shouldZoomIntoOriginal={true}
              initialZoom={16}
              originalLat={formData.latitude}
              originalLng={formData.longitude}
              setIsSubmissionEnabled={() => {}}
              setMapCoordinates={() => {}}
              zoomLevelThreshold={zoomLevelThreshold}
              canEdit={false}
            />
          </div>
          <button
            onClick={lastPageCallback}
            className="mb-2 mr-2 mt-8 inline-flex h-14 items-center justify-center rounded-md border-gray-200 bg-ocf-yellow px-5 py-2.5 text-center text-xl font-bold shadow transition duration-150 focus:outline-none focus:ring-4 focus:ring-gray-100 peer-invalid:bg-ocf-gray-300 dark:bg-ocf-yellow dark:disabled:bg-ocf-gray-300 md:hidden"
          >
            {isEditing ? 'Exit' : 'Back'}
          </button>
        </div>
        <form id="panel-form" className="flex-1" onSubmit={onSubmit}>
          {isEditing && (
            <div
              className="flex flex-col md:hidden"
              onClick={mapButtonCallback}
            >
              <label className="mt-8 block pb-1 text-lg font-[600] text-ocf-gray short:mt-4">
                Location
              </label>
              <LocationInput
                shouldZoomIntoOriginal={true}
                initialZoom={16}
                originalLat={formData.latitude}
                originalLng={formData.longitude}
                setIsSubmissionEnabled={() => {}}
                setMapCoordinates={() => {}}
                zoomLevelThreshold={zoomLevelThreshold}
                canEdit={false}
              />
            </div>
          )}
          <div className="hidden md:block md:h-7" />
          <Input
            id="site-name"
            label="Site name"
            value={formData.siteName}
            onHelpClick={() => setShowModal(true)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({
                ...formData,
                siteName: e.currentTarget.value,
              })
            }
            inputProps={{
              type: 'text',
              placeholder: 'My House',
              required: true,
              autoFocus: true,
              autoComplete: 'off',
            }}
          />
          <Input
            id="solar-array-direction"
            label="Solar array direction"
            description="(0º = North, 90º = East, 180º = South, 270º = West)"
            value={formData.direction?.toString()}
            help="I don't know"
            onHelpClick={() => setShowModal(true)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({
                ...formData,
                direction: parseFloat(e.currentTarget.value),
              })
            }
            inputProps={{
              type: 'number',
              placeholder: '135º',
              min: '0',
              max: '360',
              step: 'any',
              required: true,
              onKeyDown: preventMinus,
              pattern: '[0-9]*',
              inputMode: 'numeric',
              autoComplete: 'off',
            }}
          />

          <Input
            id="solar-array-tilt"
            label="Solar array tilt"
            description="(Degrees above the horizontal)"
            value={String(formData.tilt)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({
                ...formData,
                tilt: parseFloat(e.currentTarget.value),
              })
            }
            inputProps={{
              type: 'number',
              placeholder: '40º',
              min: '0',
              max: '360',
              step: 'any',
              required: true,
              onKeyDown: preventMinus,
              pattern: '[0-9]*',
              inputMode: 'numeric',
              autoComplete: 'off',
            }}
          />

          <Input
            id="inverter-capacity"
            label="Inverter capacity"
            value={String(formData.inverterCapacity)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({
                ...formData,
                inverterCapacity: parseFloat(e.currentTarget.value),
              })
            }
            inputProps={{
              type: 'number',
              placeholder: '4 kW',
              min: '0',
              step: 'any',
              required: true,
              onKeyDown: preventMinus,
              pattern: '[0-9]*',
              inputMode: 'numeric',
              autoComplete: 'off',
            }}
          />

          <Input
            label="Solar panel nameplate capacity"
            id="module-capacity"
            value={String(formData.moduleCapacity)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({
                ...formData,
                moduleCapacity: parseFloat(e.currentTarget.value),
              })
            }
            inputProps={{
              type: 'number',
              placeholder: '5 kW',
              min: '0',
              step: 'any',
              onKeyDown: preventMinus,
              pattern: '[0-9]*',
              inputMode: 'numeric',
              autoComplete: 'off',
            }}
          />
          <button
            disabled={didSubmit || (isEditing && !edited)}
            className="mb-2 mr-2 mt-8 inline-flex h-14 w-full items-center justify-center rounded-md border-gray-200 bg-ocf-yellow px-5 py-2.5 text-center text-xl font-bold shadow transition duration-150 focus:outline-none focus:ring-4 focus:ring-gray-100 peer-invalid:bg-ocf-gray-300 dark:bg-ocf-yellow dark:disabled:bg-ocf-gray-300 md:hidden"
          >
            {didSubmit && <Spinner width={5} height={5} margin={4} />}
            {isEditing ? 'Save changes' : 'Finish'}
            {didSubmit && <div className="mx-4 w-5" />}
          </button>
        </form>
      </div>
      <Modal show={showModal} setShow={setShowModal} />
      <div className="mx-auto mt-auto hidden w-10/12 md:flex md:flex-row md:justify-between">
        <Button form="panel-form" onClick={lastPageCallback} variant="outlined">
          {isEditing ? 'Exit' : 'Back'}
        </Button>

        <Button
          form="panel-form"
          disabled={didSubmit || (isEditing && !edited)}
          variant="solid"
          width="250px"
        >
          {didSubmit && <Spinner width={5} height={5} margin={2} />}
          {isEditing ? 'Save changes' : 'Finish'}
          {didSubmit && <div className="mx-2 w-5" />}
        </Button>
      </div>
    </div>
  );
};

export default Details;
