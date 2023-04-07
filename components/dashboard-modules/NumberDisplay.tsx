import { FC } from 'react';
import { skeleton } from '../../lib/utils';

interface Props {
  title: string;
  value: string;
  onClick?: () => void;
  isLoading: boolean;
}

const NumberDisplay: FC<Props> = ({ title, value, onClick, isLoading }) => {

  const Element = onClick ? 'button' : 'div';
  return (
    <Element
      className={`flex-1 w-full p-3 text-center md:text-left bg-ocf-black-500 rounded-2xl h-[100%] ${
        onClick ? 'cursor-pointer transition-all active:scale-95' : ''
      }`}
      onClick={onClick}
    >
      <div>
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
    </Element>
  );
};

export default NumberDisplay;
