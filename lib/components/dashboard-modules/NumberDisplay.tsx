import { FC } from 'react';
import { skeleton } from '~/lib/skeleton';

interface Props {
  title: string;
  value: string;
  onClick?: () => void;
  isLoading: boolean;
}

const NumberDisplay: FC<Props> = ({ title, value, onClick, isLoading }) => {
  const renderDisplay = () => (
    <div className="flex h-full w-full flex-1 flex-col justify-center rounded-lg bg-ocf-black-500 p-4 text-center md:text-left">
      <div
        className={`mb-2 text-xs font-semibold text-ocf-gray transition-all md:text-lg md:font-medium md:leading-none ${
          isLoading ? skeleton : ``
        }`}
      >
        {title}
      </div>
      <div
        className={`text-2xl font-semibold leading-none text-ocf-yellow transition-all md:leading-none ${
          isLoading ? skeleton : ``
        }`}
      >
        {value}
      </div>
    </div>
  );

  return onClick ? (
    <button
      className="h-[100%] w-[100%] flex-1 cursor-pointer transition-all active:scale-95"
      onClick={onClick}
    >
      {renderDisplay()}
    </button>
  ) : (
    renderDisplay()
  );
};

export default NumberDisplay;
