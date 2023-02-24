import React, { FC } from 'react';
interface Props {
  title: string;
  value: string;
}

const NumberDisplay: FC<Props> = ({ title, value }) => {
  return (
    <div className="w-1/2 mt-20 p-4 text-center bg-ocf-gray border text-black rounded-2xl p-2.5 dark:bg-ocf-gray-800">
      <div className="mb-4 text-xs font-semibold">{title}</div>
      <div className="mb-4 text-lg font-bold">{value}</div>
    </div>
  );
};

export default NumberDisplay;
