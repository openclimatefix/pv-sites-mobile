import { FC } from 'react';

interface Props {
  title: string;
  value: string;
}

const NumberDisplay: FC<Props> = ({ title, value }) => {
  return (
    <div className="flex-1 p-4 text-center md:text-left bg-ocf-black-500 rounded-2xl h-[100%]">
      <div className="mb-2 text-xs md:text-lg text-ocf-gray font-semibold">
        {title}
      </div>
      <div className="mb-1 text-2xl text-ocf-yellow font-semibold">{value}</div>
    </div>
  );
};

export default NumberDisplay;
