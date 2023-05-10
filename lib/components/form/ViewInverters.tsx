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

interface ViewInvertersProps {
  siteUUID: string;
  isSelectMode?: boolean;
  isEditMode?: boolean;
  backButton?: boolean;
  nextPageCallback: () => void;
  lastPageCallback?: () => void;
}

// controls both viewing inverters (and linking more) and selecting the inverters that correspond to a site

const ViewInverters: FC<ViewInvertersProps> = ({
  siteUUID,
  nextPageCallback,
  lastPageCallback,
  isSelectMode = false,
  backButton = false,
  isEditMode = false,
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

  //TODO look over this to see if suitable in main
  const [selectedInverters, setSelectedInverters] = useState<string[]>(
    siteInverters?.inverters?.map((inverter) => inverter.id) || []
  );

  const [didSubmit, setDidSubmit] = useState(false);
  const router = useRouter();
  const isLoading = isAllInvertersLoading || isSiteInvertersLoading;

  const nextPageOrSubmit = async () => {
    if (isSelectMode) {
      if (!didSubmit) setDidSubmit(true);
      await trigger(selectedInverters);
    }
    nextPageCallback();
  };

  const toggleSelected = (inverter: string) => {
    if (selectedInverters.includes(inverter)) {
      setSelectedInverters(selectedInverters.filter((e) => e !== inverter));
    } else {
      setSelectedInverters([...selectedInverters, inverter]);
    }
  };

  const redirectToEnode = async () => {
    const url = await getEnodeLinkURL(siteUUID);
    router.push(url);
  };

  const defaultTitleText = isSelectMode
    ? 'Select Inverters'
    : 'Connected Inverters';
  const defaultButtonText = isSelectMode ? 'Submit' : 'Next';
  const editModeButtonText = 'Save Changes';

  // @TODO skeletons!!
  return isLoading ? (
    <div className="flex h-[var(--onboarding-height)] w-full items-center justify-center">
      <Spinner width={10} height={10} margin={0} />
    </div>
  ) : (
    <div className="flex h-[var(--onboarding-height)] w-full flex-col items-center">
      <div className="flex h-full w-4/5 flex-col justify-between md:w-8/12">
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
          <Button
            variant="solid"
            disabled={isSelectMode && selectedInverters.length < 1}
            hidden="md"
            className="mb-8 mt-auto w-full self-center"
            onClick={nextPageOrSubmit}
          >
            {isEditMode ? 'Save Changes' : defaultButtonText}
          </Button>
        </div>
      </div>
      <div className="mt-auto hidden w-full justify-between pb-24 md:flex md:w-8/12 md:flex-row">
        {backButton ? (
          <Button onClick={lastPageCallback} variant="outlined">
            {isEditMode ? 'Exit' : 'Back'}
          </Button>
        ) : (
          <div />
        )}
        <Button
          variant="solid"
          disabled={(isSelectMode && selectedInverters.length < 1) || didSubmit}
          onClick={nextPageOrSubmit}
          width="250px"
        >
          {didSubmit && <Spinner width={5} height={5} margin={4} />}
          {isEditMode ? editModeButtonText : defaultButtonText}
          {didSubmit && <div className="mx-4 w-5" />}
        </Button>
      </div>
    </div>
  );
};

export default ViewInverters;
