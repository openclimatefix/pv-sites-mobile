import { FC } from 'react';
import { InverterCard } from './InverterCard';

interface InverterViewProps {
  siteUUID: string;
  isSelectMode: boolean;
}

const InverterView: FC<InverterViewProps> = ({ siteUUID, isSelectMode }) => {
  return (
    <div className="flex justify-center w-full">
      <div className="flex flex-col w-full max-w-4xl p-3 pt-0">
        {isSelectMode ? (
          <>
            <h1 className="mt-4 text-ocf-gray text-xl">Select Inverters</h1>
            <h1 className="mb-4 text-ocf-gray text-md">
              Select the inverters that correspond to your site.
            </h1>
          </>
        ) : (
          <h1 className="mt-4 mb-4 text-ocf-gray text-xl">
            Conencted Inverters
          </h1>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <InverterCard
            siteName="101 Address Road"
            brand="Enphase envoy 5"
            isReachable={true}
          />
          <InverterCard
            siteName="101 Address Road"
            brand="Enphase envoy 5"
            isReachable={true}
          />
          <InverterCard
            siteName="101 Address Road"
            brand="Enphase envoy 5"
            isReachable={false}
          />
          <InverterCard
            siteName="101 Address Road"
            brand="Enphase envoy 5"
            isReachable={false}
          />
        </div>
      </div>
    </div>
  );
};

export default InverterView;
