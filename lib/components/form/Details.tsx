import { FC, useState } from 'react';

import Input from '~/lib/components/form/Input';
import Modal from '~/lib/components/form/Modal';
import { Spinner } from '~/lib/components/icons';

import Button from '~/lib/components/Button';
import { sleep, zoomLevelThreshold } from '../../utils';
import LocationInput from './LocationInput';
import { SiteFormData } from './SiteDetails';
import { Site } from '~/lib/types';
import { CheckIcon } from '@heroicons/react/24/solid';

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
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [didSubmit, setDidSubmit] = useState<boolean>(false);
  const [showSuccessIcon, setShowSuccessIcon] = useState<boolean>(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!didSubmit) {
      setDidSubmit(true);
      const res = await submitForm();
      if (res) {
        const site = (await res.json()) as Site;
        setDidSubmit(false);
        if (isEditing) {
          setShowSuccessIcon(true);
          await sleep(2000);
          setShowSuccessIcon(false);
        } else {
          nextPageCallback(site);
        }
      }
    }
  };

  return (
    <div className="mb-[max(var(--bottom-nav-margin),20px)] flex flex-col gap-10">
      <div className="flex w-4/5 flex-row self-center md:w-8/12">
        <div className="hidden flex-1 flex-col pr-8 md:flex">
          <h1 className="mt-2 text-2xl font-semibold dark:text-ocf-gray md:text-2xl">
            Your site&apos;s details
          </h1>
          <div className="w-full flex-1" onClick={mapButtonCallback}>
            <LocationInput
              initialZoom={16}
              latitude={formData.latitude}
              longitude={formData.longitude}
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
                initialZoom={16}
                latitude={formData.latitude}
                longitude={formData.longitude}
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
            onHelpClick={() => setModalOpen(true)}
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
            onHelpClick={() => setModalOpen(true)}
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
            {(didSubmit || showSuccessIcon) && (
              <div className="mx-2 h-5 w-5 overflow-hidden">
                {didSubmit && <Spinner width={5} height={5} margin={0} />}
                {!didSubmit && showSuccessIcon && (
                  <CheckIcon className="h-5 w-5 fill-ocf-black text-gray-200 dark:text-ocf-gray-300" />
                )}
              </div>
            )}
            {isEditing ? 'Save Changes' : 'Finish'}
            {(didSubmit || showSuccessIcon) && <div className="mx-2 w-5" />}
          </button>
        </form>
      </div>
      <Modal open={modalOpen} onOpen={setModalOpen} />
      <div className="mx-auto mt-auto hidden w-10/12 md:flex md:flex-row md:justify-between">
        <Button form="panel-form" onClick={lastPageCallback} variant="outlined">
          {isEditing ? 'Exit' : 'Back'}
        </Button>

        <Button
          form="panel-form"
          disabled={didSubmit || (isEditing && !edited)}
          variant="solid"
          className={isEditing ? 'w-[250px]' : 'w-[200px]'}
        >
          {(didSubmit || showSuccessIcon) && (
            <div className="mx-2 h-5 w-5 overflow-hidden">
              {didSubmit && <Spinner width={5} height={5} margin={0} />}
              {!didSubmit && showSuccessIcon && (
                <CheckIcon className="h-5 w-5 fill-ocf-black text-gray-200 dark:text-ocf-gray-300" />
              )}
            </div>
          )}
          {isEditing ? 'Save Changes' : 'Finish'}
          {(didSubmit || showSuccessIcon) && <div className="mx-2 w-5" />}
        </Button>
      </div>
    </div>
  );
};

export default Details;
