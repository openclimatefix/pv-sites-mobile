import React, { FC } from 'react';

const HighLowTimes: FC = () => {
  return (
    <div className="w-1/2 mt-3 mr-2 text-center">
      <div className="mb-2 text-xs dark:text-ocf-gray">
        Highest Output at 12:00
      </div>
      <div className="text-xs dark:text-ocf-gray">Lowest Output at 1:00</div>
    </div>
  );
};

export default HighLowTimes;
