import { FC } from 'react';

interface Props {
  title: string;
  value: string;
  onClick?: () => void;
}

const NumberDisplay: FC<Props> = ({ title, value, onClick }) => {
  const Element = onClick ? 'button' : 'div';
  return (
    <Element
      className={`flex-1 w-full p-4 text-center md:text-left bg-ocf-black-500 rounded-2xl h-[100%] transition-all active:scale-95 ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={onClick}
    >
      <div className="mb-2 text-xs md:text-lg text-ocf-gray font-semibold md:font-medium">
        {title}
      </div>
      <div className="text-2xl text-ocf-yellow font-semibold leading-none">
        {value}
      </div>
    </Element>
  );
};

export default NumberDisplay;
