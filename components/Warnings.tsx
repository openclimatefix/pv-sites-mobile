import React, { FC } from 'react';

const Warnings: FC = () => {
  return (
    <>
      <div className="flex-1 my-2 p-4 text-center bg-ocf-gray-900 rounded-2xl dark:bg-ocf-gray-800">
        <div className="mb-1 text-2xl text-ocf-yellow font-bold">
          Attention!
        </div>
        <div className="h-12"></div>
      </div>
    </>
  );
};

export default Warnings;
