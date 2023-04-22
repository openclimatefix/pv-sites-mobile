import { FC } from 'react';
import { skeleton } from '~/lib/utils';

interface Props {
  title: string;
  value: string;
  onClick?: () => void;
  isLoading: boolean;
}

const NumberDisplay: FC<Props> = ({ title, value, onClick, isLoading }) => {
  const renderDisplay = () => (
    <div className="flex-1 p-4 flex flex-col justify-center text-center md:text-left bg-ocf-black-500 rounded-2xl w-full h-full">
      <div
        className={`mb-2 text-xs md:text-lg text-ocf-gray font-semibold transition-all md:font-medium md:leading-none ${
          isLoading ? skeleton : ``
        }`}
      >
        {title}
      </div>
      <div
        className={`text-2xl text-ocf-yellow font-semibold leading-none transition-all md:leading-none ${
          isLoading ? skeleton : ``
        }`}
      >
        {value}
      </div>
    </div>
  );

  return onClick ? (
    <button
      className="cursor-pointer transition-all active:scale-95 flex-1 h-[100%] w-[100%]"
      onClick={onClick}
    >
      {renderDisplay()}
    </button>
  ) : (
    renderDisplay()
  );
};

export default NumberDisplay;
