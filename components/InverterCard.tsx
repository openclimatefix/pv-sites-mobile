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
  <div className="flex flex-col bg-white rounded-lg p-4 w-full max-w-md">
    <h1>{siteName}</h1>
    <h1>{brand}</h1>
    <h1>{isReachable ? 'Reachable' : 'Not Reachable'}</h1>
  </div>
);
