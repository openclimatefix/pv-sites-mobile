import { FC } from 'react';

interface Props {
  title: string;
  value: string;
}

const NumberDisplay: FC<Props> = ({ title, value }) => {
  return (
    <div className="flex-1 p-4 text-center bg-ocf-gray-1000 rounded-2xl h-[100%]">
      <div className="mb-2 text-xs text-ocf-gray font-semibold">{title}</div>
      <div className="mb-1 text-2xl text-ocf-yellow font-semibold">{value}</div>
    </div>
  );
};

export default NumberDisplay;
