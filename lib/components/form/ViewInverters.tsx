import { FC, useState } from 'react';
import { InverterCard } from '../InverterCard';
import useSWR from 'swr';
import { Inverters } from '~/lib/types';
interface ViewInvertersProps {
  siteUUID: string;
  isSelectMode: boolean;
}

const ViewInverters: FC<ViewInvertersProps> = ({
  siteUUID,
  isSelectMode = true,
}) => {
  const {
    data: inverters,
    error,
    isLoading,
  } = useSWR<Inverters>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL_GET}/enode/inverters`
  );

  const [selectedInverters, setSelectedInverters] = useState<string[]>([]);

  const addOrRemove = (inverter: string) => {
    if (selectedInverters.includes(inverter)) {
      setSelectedInverters(selectedInverters.filter((e) => e !== inverter));
    } else {
      setSelectedInverters([...selectedInverters, inverter]);
    }
  };

  // @TODO skeletons!!
  return (
    <div className="flex w-11/12 w-full max-w-lg justify-center md:mt-8 md:max-w-4xl">
      <div className="flex w-full flex-col p-3 pt-0">
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
        <div className="grid w-full grid-cols-1 items-center justify-center gap-4 md:mt-2 md:grid-cols-2">
          {inverters?.inverters.map((inverter) => (
            <InverterCard
              inverter={inverter}
              selectMode={isSelectMode}
              selected={selectedInverters.includes(inverter.id)}
              onClick={() => addOrRemove(inverter.id)}
              key={inverter.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewInverters;
