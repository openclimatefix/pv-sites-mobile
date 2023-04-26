import { FC, useState } from 'react';
import { InverterCard } from '../InverterCard';
import Button from '../Button';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { InverterPutData, Inverters } from '~/lib/types';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { getAuthenticatedRequestOptions } from '~/lib/swr';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import Spinner from '../Spinner';

async function sendRequest(url: string, { arg }: { arg: InverterPutData }) {
  const options = await getAuthenticatedRequestOptions(url);
  return fetch(url, {
    method: 'PUT',
    body: JSON.stringify(arg),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
}

interface ViewInvertersProps {
  siteUUID?: string;
  isSelectMode?: boolean;
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
}) => {
  const {
    data: inverters,
    error,
    isLoading,
  } = useSWR<Inverters>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL_GET}/enode/inverters`
  );

  const { trigger } = useSWRMutation(
    `${process.env.NEXT_PUBLIC_API_BASE_URL_POST}/sites/${siteUUID}/inverters`,
    sendRequest
  );

  const [selectedInverters, setSelectedInverters] = useState<string[]>([]);
  const [didSubmit, setDidSubmit] = useState(false);

  const nextPageOrSubmit = async () => {
    if (isSelectMode) {
      if (!didSubmit) setDidSubmit(true);
      await trigger({ client_ids: selectedInverters });
    }
    nextPageCallback();
  };

  const addOrRemove = (inverter: string) => {
    if (selectedInverters.includes(inverter)) {
      setSelectedInverters(selectedInverters.filter((e) => e !== inverter));
    } else {
      setSelectedInverters([...selectedInverters, inverter]);
    }
  };

  // @TODO skeletons!!
  return (
    <div className="flex h-[var(--onboarding-height)] w-full flex-col items-center">
      <div className="flex h-full w-11/12 max-w-lg flex-col justify-between md:mt-8 md:max-w-4xl">
        <div className="flex w-full flex-grow flex-col p-3 pt-0">
          {isSelectMode ? (
            <>
              <h1 className="mt-4 text-xl font-semibold text-white">
                Select Inverters
              </h1>
              <h1 className="text-md mb-4 text-white">
                Select the inverters that correspond to this site.
              </h1>
            </>
          ) : (
            <h1 className="mb-4 mt-4 text-xl font-semibold text-white">
              Connected Inverters
            </h1>
          )}
          <div className="mb-8 grid w-full grid-cols-1 items-center justify-center gap-4 md:mt-2 md:grid-cols-2">
            {inverters?.inverters.map((inverter) => (
              <InverterCard
                inverter={inverter}
                selectMode={isSelectMode}
                selected={
                  isSelectMode && selectedInverters.includes(inverter.id)
                }
                onClick={() => addOrRemove(inverter.id)}
                key={inverter.id}
              />
            ))}
          </div>
          {!isSelectMode && (
            <Link href="https://www.omfgdogs.com">
              <a>
                <div className="flex flex-row justify-center gap-2">
                  <PlusCircleIcon width={24} height={24} color="#FFD053" />
                  <h2 className="text-l text-ocf-yellow-500">
                    Link more inverters
                  </h2>
                </div>
              </a>
            </Link>
          )}
          <Button
            variant="solid"
            disabled={isSelectMode && selectedInverters.length < 1}
            hidden="md"
            className="mb-8 mt-auto w-full self-center"
            onClick={nextPageOrSubmit}
          >
            {isSelectMode ? 'Finish' : 'Next'}
          </Button>
        </div>
      </div>
      <div className="mt-auto hidden w-full justify-between px-12 pb-24 md:block md:flex md:flex-row xl:w-5/6">
        {backButton ? (
          <Button onClick={lastPageCallback} variant="outlined">
            Back
          </Button>
        ) : (
          <div />
        )}
        <Button
          variant="solid"
          disabled={(isSelectMode && selectedInverters.length < 1) || didSubmit}
          onClick={nextPageOrSubmit}
        >
          {didSubmit && <Spinner width={5} height={5} margin={4} />}
          Finish
          {didSubmit && <div className="mx-4 w-5" />}
        </Button>
      </div>
    </div>
  );
};

export default ViewInverters;
