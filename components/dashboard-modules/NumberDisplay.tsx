import { FC } from 'react';

interface Props {
  title: string;
  value: string;
  onClick?: () => void;
}

const skeleton = `md:my-1.5 text-transparent bg-ocf-gray-1000 w-[100%] rounded-2xl animate-pulse select-none md:leading-none`;

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
          className={`mb-2 text-xs md:text-lg text-ocf-gray font-semibold md:font-medium ${
            value == 'Loading...' ? skeleton : ``
          }`}
        >
          {title}
        </div>
        <div
          className={`text-2xl text-ocf-yellow font-semibold leading-none ${
            value == 'Loading...' ? skeleton : ``
          }`}
        >
          {value}
        </div>
      </div>
    </Element>
  );
};

export default NumberDisplay;
