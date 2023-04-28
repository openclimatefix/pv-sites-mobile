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
import { NavbarLink } from '../navigation/NavBar';
import BackNav from '../navigation/BackNav';

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
  const { data: inverters, isLoading } = useSWR<Inverters>(
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

  const toggleSelected = (inverter: string) => {
    if (selectedInverters.includes(inverter)) {
      setSelectedInverters(selectedInverters.filter((e) => e !== inverter));
    } else {
      setSelectedInverters([...selectedInverters, inverter]);
    }
  };

  // @TODO skeletons!!
  return isLoading ? (
    <div className="flex h-[var(--onboarding-height)] w-full items-center justify-center">
      <Spinner width={10} height={10} margin={0} />
    </div>
  ) : (
    <div className="flex h-[var(--onboarding-height)] w-full flex-col items-center">
      <div className="flex h-full w-4/5 flex-col justify-between md:w-8/12">
        <div className="flex w-full">
          <NavbarLink title="Details" href={`/site-details/${siteUUID}`} />
          <NavbarLink title="Inverters" href={`/inverters/${siteUUID}`} />
        </div>
        <div className="flex w-full flex-grow flex-col pt-0">
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
            <h1 className="mb-4 mt-4 text-2xl font-semibold text-white md:text-3xl">
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
                onClick={() => toggleSelected(inverter.id)}
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
      <div className="mt-auto hidden w-4/5 w-full justify-between pb-24 md:block md:flex md:w-8/12 md:flex-row">
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
          {isSelectMode ? 'Finish' : 'Next'}
          {didSubmit && <div className="mx-4 w-5" />}
        </Button>
      </div>
    </div>
  );
};

export default ViewInverters;
