import { FC } from 'react';
import { skeleton } from '../../lib/utils'

interface Props {
  title: string;
  value: string;
  onClick?: () => void;
}

const NumberDisplay: FC<Props> = ({ title, value, onClick }) => {
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
          className={`mb-2 text-xs md:text-lg text-ocf-gray font-semibold md:font-medium md:leading-none ${
            value == 'Loading...' ? `${skeleton} md:leading-none` : ``
          }`}
        >
          {title}
        </div>
        <div
          className={`text-2xl text-ocf-yellow font-semibold leading-none md:leading-none ${
            value == 'Loading...' ? `${skeleton} md:leading-none` : ``
          }`}
        >
          {value}
        </div>
      </div>
    </Element>
  );
};

export default NumberDisplay;
