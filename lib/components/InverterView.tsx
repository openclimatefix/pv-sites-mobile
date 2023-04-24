import { FC } from 'react';
import { InverterCard } from './InverterCard';

interface InverterViewProps {
  siteUUID: string;
  isSelectMode: boolean;
}

const InverterView: FC<InverterViewProps> = ({ siteUUID, isSelectMode }) => {
  return (
    <div className="flex w-full justify-center">
      <div className="flex w-full max-w-4xl flex-col p-3 pt-0">
        {isSelectMode ? (
          <>
            <h1 className="mt-4 text-xl text-ocf-gray">Select Inverters</h1>
            <h1 className="text-md mb-4 text-ocf-gray">
              Select the inverters that correspond to your site.
            </h1>
          </>
        ) : (
          <h1 className="mb-4 mt-4 text-xl text-ocf-gray">
            Conencted Inverters
          </h1>
        )}
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
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
