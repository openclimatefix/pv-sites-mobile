import { FC } from 'react';

interface InverterCardProps {
  siteName: string;
  brand: string;
  isReachable: boolean;
}

export const InverterCard: FC<InverterCardProps> = ({
  siteName,
  brand,
  isReachable,
}) => (
  <div className="flex flex-col bg-ocf-black-500 rounded-lg p-5 w-full max-w-md">
    <h1 className="text-ocf-gray text-lg font-bold">{siteName}</h1>
    <h1 className="mb-2 text-ocf-gray text-md ">{brand}</h1>
    <div className="flex items-center gap-1">
      <div
        className={`w-2 h-2 rounded-full ${
          isReachable ? 'bg-green-500' : 'bg-red-500'
        }`}
      />
      <h1 className={isReachable ? 'text-green-500' : 'text-red-500'}>
        {isReachable ? 'Reachable' : 'Not Reachable'}
      </h1>
    </div>
  </div>
);
