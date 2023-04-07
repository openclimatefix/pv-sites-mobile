import { useState, FC } from 'react';

import Spinner from '~/components/Spinner';
import Input from '~/components/Input';
import Modal from 'components/Modal';

import { useFormContext } from '~/lib/context/form';
import BackButton from 'components/BackButton';
import LocationInput from '../LocationInput';
import { zoomLevelThreshold } from '../../lib/utils';
import Button from '~/components/Button';
import { Site } from '~/lib/types';
import { useSiteData } from '~/lib/hooks';

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
  uuid?: string;
}

const Details: FC<Props> = ({ lastPageCallback, nextPageCallback, uuid }) => {
  const { siteCoordinates, setFormData, panelDetails, postPanelData } =
    useFormContext();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [didSubmit, setDidSubmit] = useState<boolean>(false);

  const siteData = uuid ? useSiteData(uuid) : undefined;
  console.log(siteData);
  const {
    installed_capacity_kw,
    client_site_name,
    longitude,
    latitude,
    orientation,
    tilt,
  } = siteData || {};

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!didSubmit) {
      setDidSubmit(true);
      // TODO: Add schema validation with zod
      await postPanelData();
      nextPageCallback();
    }
  };

  return (
    <div className="flex flex-col mb-[max(var(--bottom-nav-margin),20px)] gap-10">
      <BackButton onClick={lastPageCallback} />
      <div className="flex flex-row w-full md:w-9/12 self-center">
        <div className="flex-1 hidden md:block px-8">
          <h1 className="font-semibold md:font-medium md:text-3xl text-4xl mt-2 dark:text-ocf-gray">
            Your site&apos;s details
          </h1>
          <div className="w-full h-full" onClick={lastPageCallback}>
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
            className="md:hidden mt-8 font-bold text-xl peer-invalid:bg-ocf-gray-300 transition duration-150 bg-ocf-yellow dark:disabled:bg-ocf-gray-300 dark:bg-ocf-yellow shadow h-14 border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 rounded-md px-5 py-2.5 text-center inline-flex items-center justify-center mr-2 mb-2"
          >
            Back
          </button>
        </div>
        <form id="panel-form" className="flex-1" onSubmit={onSubmit}>
          <div className="hidden md:block md:h-10" />
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
            className="md:hidden mt-8 font-bold text-xl w-full peer-invalid:bg-ocf-gray-300 transition duration-150 bg-ocf-yellow dark:disabled:bg-ocf-gray-300 dark:bg-ocf-yellow shadow h-14 border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 rounded-md px-5 py-2.5 text-center inline-flex items-center justify-center mr-2 mb-2"
          >
            {didSubmit && <Spinner width={5} height={5} margin={4} />}
            Finish
            {didSubmit && <div className="w-5 mx-4" />}
          </button>
        </form>
      </div>
      <Modal show={showModal} setShow={setShowModal} />
      <div className="hidden md:flex md:flex-row md:justify-between w-10/12 mx-auto mt-auto">
        <Button disabled={false} onClick={lastPageCallback}>
          Back
        </Button>
        <Button form="panel-form" disabled={didSubmit}>
          {didSubmit && <Spinner width={5} height={5} margin={2} />}
          Finish
          {didSubmit && <div className="w-5 mx-2" />}
        </Button>
      </div>
    </div>
  );
};

export default Details;
