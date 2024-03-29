import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import { FC, useState } from 'react';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { getEnodeLinkURL, sendMutation } from '~/lib/api';
import { Inverters } from '~/lib/types';
import Button from '../Button';
import { InverterCard } from '../InverterCard';
import { Spinner } from '../icons';
import { NavbarLink } from '../navigation/NavBar';
import { CheckIcon } from '@heroicons/react/24/solid';
import { sleep } from '~/lib/utils';
import Toast from './Toast';

interface ViewInvertersProps {
  siteUUID: string;
  isSelectMode?: boolean;
  isEditMode?: boolean;
  backButton?: boolean;
  nextPageCallback: () => void;
  lastPageCallback?: () => void;
  linkSuccess?: string;
}

// controls both viewing inverters (and linking more) and selecting the inverters that correspond to a site

const ViewInverters: FC<ViewInvertersProps> = ({
  siteUUID,
  nextPageCallback,
  lastPageCallback,
  isSelectMode = false,
  backButton = false,
  isEditMode = false,
  linkSuccess,
}) => {
  const { data: allInverters, isLoading: isAllInvertersLoading } =
    useSWR<Inverters>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL_GET}/enode/inverters`
    );
  const { data: siteInverters, isLoading: isSiteInvertersLoading } =
    useSWR<Inverters>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL_GET}/sites/${siteUUID}/inverters`
    );

  const { trigger } = useSWRMutation(
    `${process.env.NEXT_PUBLIC_API_BASE_URL_POST}/sites/${siteUUID}/inverters`,
    sendMutation('PUT')
  );

  const [selectedInverters, setSelectedInverters] = useState<string[]>(
    siteInverters?.inverters?.map((inverter) => inverter.id) || []
  );
  const [didSubmit, setDidSubmit] = useState(false);
  const [showSuccessIcon, setShowSuccessIcon] = useState(false);
  const router = useRouter();
  const isLoading = isAllInvertersLoading || isSiteInvertersLoading;

  const nextPageOrSubmit = async () => {
    if (isSelectMode) {
      await submit();
    }
    nextPageCallback();
  };

  const submit = async () => {
    if (!didSubmit) setDidSubmit(true);
    await trigger(selectedInverters);
    setShowSuccessIcon(true);
    setDidSubmit(false);
    await sleep(2000);
    setShowSuccessIcon(false);
  };

  const toggleSelected = (inverter: string) => {
    if (selectedInverters.includes(inverter)) {
      setSelectedInverters(selectedInverters.filter((e) => e !== inverter));
    } else {
      setSelectedInverters([...selectedInverters, inverter]);
    }
  };

  const redirectToEnode = async () => {
    const url = await getEnodeLinkURL(
      `${process.env.NEXT_PUBLIC_BASE_URL}/inverters/${siteUUID}?success=true`
    );
    router.push(url);
  };

  const defaultTitleText = isSelectMode
    ? 'Select Inverters'
    : 'Connected Inverters';
  const defaultButtonText = isSelectMode ? 'Submit' : 'Next';
  const editModeButtonText = 'Save';

  // @TODO skeletons!!
  return isLoading ? (
    <div className="flex h-[var(--onboarding-height)] w-full items-center justify-center">
      <Spinner width={10} height={10} margin={0} />
    </div>
  ) : (
    <div className="flex h-[var(--onboarding-height)] w-full flex-col items-center">
      <div className="flex h-full w-4/5 flex-1 flex-col justify-between md:w-8/12">
        {isEditMode && (
          <div className="flex w-full">
            <NavbarLink title="Details" href={`/site-details/${siteUUID}`} />
            <NavbarLink
              title="Inverters"
              href={`/inverters/edit/${siteUUID}`}
            />
          </div>
        )}
        <div className="flex w-full flex-grow flex-col pt-0">
          <h1 className="mt-4 text-xl font-semibold text-white">
            {isEditMode ? 'Connected Inverters' : defaultTitleText}
          </h1>
          {isSelectMode && (
            <h1 className="text-md text-white">
              Click to select or deselect an inverter
            </h1>
          )}
          <div className="mb-8 mt-4 grid w-full grid-cols-1 items-center justify-center gap-4 md:mt-2 md:grid-cols-2">
            {allInverters?.inverters.map((inverter) => (
              <InverterCard
                inverter={inverter}
                selectMode={isSelectMode}
                selected={
                  isSelectMode && selectedInverters.includes(inverter.id)
                }
                onClick={() => toggleSelected(inverter.id)}
                key={inverter.id}
              />
            ))}
          </div>
          {!isSelectMode && (
            <button onClick={redirectToEnode}>
              <div className="flex flex-row justify-center gap-2">
                <PlusCircleIcon width={24} height={24} color="#FFD053" />
                <h2 className="text-l text-ocf-yellow-500">
                  Link more inverters
                </h2>
              </div>
            </button>
          )}
          {linkSuccess === 'true' && (
            <div className="mb-5 ml-auto mt-auto text-ocf-yellow">
              <Toast>
                <CheckIcon height="24" width="24" />
                Inverters linked successfully
              </Toast>
            </div>
          )}
          <Button
            variant="solid"
            disabled={
              (isSelectMode && selectedInverters.length < 1) || didSubmit
            }
            hidden="md"
            className="mb-8 mt-auto w-full self-center"
            onClick={isEditMode ? submit : nextPageOrSubmit}
          >
            {(didSubmit || showSuccessIcon) && (
              <div className="mx-2 h-5 w-5 overflow-hidden">
                {didSubmit && <Spinner width={5} height={5} margin={0} />}
                {!didSubmit && showSuccessIcon && (
                  <CheckIcon className="h-5 w-5 fill-ocf-black text-gray-200 dark:text-ocf-gray-300" />
                )}
              </div>
            )}
            {isEditMode ? editModeButtonText : defaultButtonText}
            {(didSubmit || showSuccessIcon) && <div className="mx-2 w-5" />}
          </Button>
        </div>
      </div>
      <div className="mt-auto hidden w-full justify-between pb-24 md:flex md:w-10/12 md:flex-row">
        {backButton ? (
          <Button
            onClick={lastPageCallback}
            variant="outlined"
            className="w-[100px]"
          >
            {isEditMode ? 'Exit' : 'Back'}
          </Button>
        ) : (
          <div />
        )}
        <Button
          variant="solid"
          disabled={didSubmit}
          onClick={isEditMode ? submit : nextPageOrSubmit}
          className="w-[100px]"
        >
          {(didSubmit || showSuccessIcon) && (
            <div className="mx-2 h-5 w-5 overflow-hidden">
              {didSubmit && <Spinner width={5} height={5} margin={0} />}
              {!didSubmit && showSuccessIcon && (
                <CheckIcon className="h-5 w-5 fill-ocf-black text-gray-200 dark:text-ocf-gray-300" />
              )}
            </div>
          )}
          {isEditMode ? editModeButtonText : defaultButtonText}
          {(didSubmit || showSuccessIcon) && <div className="mx-2 w-5" />}
        </Button>
      </div>
    </div>
  );
};

export default ViewInverters;
