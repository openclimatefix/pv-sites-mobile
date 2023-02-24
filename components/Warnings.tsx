import React, { FC } from 'react';

const Warnings: FC = () => {
  return (
    <>
      <div className="w-full mt-10 h-20 p-4 bg-ocf-gray border text-black rounded-2xl p-2.5 dark:bg-ocf-gray-800">
        <div className="ml-6 text-lg font-bold">Attention!</div>
      </div>
    </>
  );
};

export default Warnings;
