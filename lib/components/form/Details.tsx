import { FC, useState } from 'react';

import Input from '~/lib/components/form/Input';
import Modal from '~/lib/components/Modal';
import Spinner from '~/lib/components/Spinner';

import Button from '~/lib/components/Button';
import { useFormContext } from '~/lib/form/context';
import { Site } from '~/lib/types';
import { zoomLevelThreshold } from '../../utils';
import LocationInput from './LocationInput';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';

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
  nextPageCallback: () => void;
  site?: Site;
}

const Details: FC<Props> = ({ lastPageCallback, nextPageCallback, site }) => {
  const { siteCoordinates, setFormData, panelDetails, postPanelData } =
    useFormContext();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [didSubmit, setDidSubmit] = useState<boolean>(false);

  // If it is an existing site, prefill the form with the existing data
  panelDetails.siteName = site?.client_site_name ?? panelDetails.siteName;
  panelDetails.direction =
    site?.orientation?.toString() ?? panelDetails.direction;
  panelDetails.tilt = site?.tilt?.toString() ?? panelDetails.tilt;
  panelDetails.capacity =
    site?.installed_capacity_kw?.toString() ?? panelDetails.capacity;

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!didSubmit) {
      setDidSubmit(true);
      await postPanelData();
      nextPageCallback();
    }
  };

  return (
    <div className="mb-[max(var(--bottom-nav-margin),20px)] flex flex-col gap-10">
      <div className="flex w-4/5 flex-row self-center md:w-9/12">
        <div className="hidden flex-1 flex-col px-8 md:flex">
          <h1 className="mt-2 text-2xl font-semibold text-ocf-gray md:text-3xl">
            Your site&apos;s details
          </h1>
          <div className="w-full flex-1" onClick={lastPageCallback}>
            <LocationInput
              shouldZoomIntoOriginal={true}
              initialZoom={16}
              originalLat={siteCoordinates.latitude}
              originalLng={siteCoordinates.longitude}
              setIsSubmissionEnabled={() => {}}
              setMapCoordinates={() => {}}
              zoomLevelThreshold={zoomLevelThreshold}
              canEdit={false}
            />
          </div>
          <button
            onClick={lastPageCallback}
            className="mb-2 mr-2 mt-8 inline-flex h-14 items-center justify-center rounded-md border-gray-200 bg-ocf-yellow px-5 py-2.5 text-center text-xl font-bold shadow transition duration-150 focus:outline-none focus:ring-4 focus:ring-gray-100 disabled:bg-ocf-gray-300 peer-invalid:bg-ocf-gray-300 md:hidden"
          >
            Back
          </button>
        </div>
        <form id="panel-form" className="flex-1" onSubmit={onSubmit}>
          <div className="flex flex-col md:hidden">
            {/* TODO: ADD LOCATION BUTTON HERE */}
            <label className="mt-8 block pb-1 text-lg font-[600] text-ocf-gray short:mt-4">
              {' '}
              Location
            </label>
            <button
              type="button"
              className="block h-14 w-full rounded-lg border border-ocf-black-500 bg-ocf-black-500 p-2.5  text-center text-lg text-ocf-gray-600 focus:ring-ocf-yellow md:text-left"
            >
              Button Text
            </button>
          </div>
          <div className="hidden md:block md:h-7" />
          <Input
            id="site-name"
            label="Site name"
            value={panelDetails.siteName}
            onHelpClick={() => setShowModal(true)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({
                ...panelDetails,
                siteName: e.currentTarget.value,
              })
            }
            inputProps={{
              type: 'text',
              placeholder: 'My House',
              required: true,
              autoFocus: true,
            }}
          />
          <Input
            id="solar-panel-direction"
            label="Solar panel direction"
            description="(0º = North, 90º = East, 180º = South, 270º = West)"
            value={panelDetails.direction}
            help="I don't know"
            onHelpClick={() => setShowModal(true)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({
                ...panelDetails,
                direction: e.currentTarget.value,
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
            }}
          />

          <Input
            id="solar-panel-tilt"
            label="Solar panel tilt"
            description="(Degrees above the horizontal)"
            value={String(panelDetails.tilt)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...panelDetails, tilt: e.currentTarget.value })
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
            }}
          />

          <Input
            label={
              <>
                Solar panel capacity
                <span className="text-xs font-normal"> (optional)</span>
              </>
            }
            id="solar-panel-capacity"
            value={String(panelDetails.capacity)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({
                ...panelDetails,
                capacity: e.currentTarget.value,
              })
            }
            inputProps={{
              type: 'number',
              placeholder: '2800 kW',
              min: '0',
              step: 'any',
              onKeyDown: preventMinus,
              pattern: '[0-9]*',
              inputMode: 'numeric',
            }}
          />
          <button
            disabled={didSubmit}
            className="mb-2 mr-2 mt-8 inline-flex h-14 w-full items-center justify-center rounded-md border-gray-200 bg-ocf-yellow px-5 py-2.5 text-center text-xl font-bold shadow transition duration-150 focus:outline-none focus:ring-4 focus:ring-gray-100 disabled:bg-ocf-gray-300 peer-invalid:bg-ocf-gray-300 md:hidden"
          >
            {didSubmit && <Spinner width={5} height={5} margin={4} />}
            Finish
            {didSubmit && <div className="mx-4 w-5" />}
          </button>
        </form>
      </div>
      <Modal show={showModal} setShow={setShowModal} />
      <div className="mx-auto mt-auto hidden w-10/12 md:flex md:flex-row md:justify-between">
        <button
          onClick={lastPageCallback}
          className="flex items-center text-ocf-yellow"
        >
          <ChevronLeftIcon width="24" height="24" />
          Back
        </button>
        <Button form="panel-form" disabled={didSubmit} variant="solid">
          {didSubmit && <Spinner width={5} height={5} margin={2} />}
          Finish
          {didSubmit && <div className="mx-2 w-5" />}
        </Button>
      </div>
    </div>
  );
};

export default Details;
