import { FC } from 'react';
import { Inverter } from '../types';

interface InverterCardProps {
  inverter: Inverter;
  selected: boolean | undefined;
  selectMode: boolean;
  onClick?: () => void;
}

export const InverterCard: FC<InverterCardProps> = ({
  inverter,
  selected,
  onClick,
  selectMode,
}) => {
  const renderCardContent = () => (
    <div
      className={`flex w-full flex-col rounded-lg border-[1px] bg-ocf-black-500 p-3 pl-4 text-left ${
        selected ? 'border-ocf-yellow-500' : 'border-ocf-black-500'
      }`}
    >
      <h1 className="text-lg font-semibold text-white">
        {inverter.information.siteName}
      </h1>
      <h1 className="text-md mb-1 text-ocf-gray ">
        {inverter.information.brand}
      </h1>
      <div className="flex items-center gap-1">
        <div
          className={`h-2 w-2 rounded-full ${
            inverter.isReachable ? 'bg-green-500' : 'bg-red-500'
          }`}
        />
        <p
          className={`text-sm ${
            inverter.isReachable ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {inverter.isReachable ? 'Reachable' : 'Not Reachable'}
        </p>
      </div>
    </div>
  );

  return selectMode ? (
    <button onClick={onClick}>{renderCardContent()}</button>
  ) : (
    renderCardContent()
  );
};
