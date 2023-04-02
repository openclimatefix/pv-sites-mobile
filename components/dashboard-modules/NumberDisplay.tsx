import { FC } from 'react';

interface Props {
  title: string;
  value: string;
  onClick?: () => void;
}

const NumberDisplay: FC<Props> = ({ title, value, onClick }) => {
  const Element = onClick ? 'button' : 'div';
  return (
    <Element className="flex-1 p-4 text-center md:text-left bg-ocf-black-500 rounded-2xl h-[100%]">
      <div className="mb-2 text-xs md:text-lg text-ocf-gray font-semibold md:font-medium">
        {title}
      </div>
      <div className="mb-1 text-2xl text-ocf-yellow font-semibold">{value}</div>
    </Element>
  );
};

export default NumberDisplay;
