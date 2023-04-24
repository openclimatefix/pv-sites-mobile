import { FC } from 'react';
import { InverterCard } from './InverterCard';

interface InverterViewProps {
  siteUUID: string;
}

const InverterView: FC<InverterViewProps> = ({ siteUUID }) => {
  return (
    <div className="flex justify-center w-full border-2">
      {/* <div className="flex flex-col w-full"> */}
      <div className="flex flex-col w-full max-w-4xl border-2 border-orange-600">
        <h1 className="mt-4 mb-4 text-ocf-gray text-3xl font-bold">
          Conencted Inverters
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <InverterCard siteName="Site 1" brand="Brand 1" isReachable={true} />
          <InverterCard siteName="Site 1" brand="Brand 1" isReachable={true} />
          <InverterCard siteName="Site 1" brand="Brand 1" isReachable={true} />
          <InverterCard siteName="Site 1" brand="Brand 1" isReachable={true} />
        </div>
      </div>
    </div>
  );
};

export default InverterView;
