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
  <div className="flex w-full max-w-md flex-col rounded-lg bg-ocf-black-500 p-5">
    <h1 className="text-lg font-bold text-ocf-gray">{siteName}</h1>
    <h1 className="text-md mb-2 text-ocf-gray ">{brand}</h1>
    <div className="flex items-center gap-1">
      <div
        className={`h-2 w-2 rounded-full ${
          isReachable ? 'bg-green-500' : 'bg-red-500'
        }`}
      />
      <h1 className={isReachable ? 'text-green-500' : 'text-red-500'}>
        {isReachable ? 'Reachable' : 'Not Reachable'}
      </h1>
    </div>
  </div>
);
