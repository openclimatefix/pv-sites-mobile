import ExpectedOutput from '../components/ExpectedOutput';
import CurrentCapacity from '../components/CurrentCapacity';
import HighLowTimes from '../components/HighLowTimes';
import Warnings from '../components/Warnings';
import Graph from '../components/Graph';
import React from 'react';

const Dashboard = () => {
  return (
    <>
      <div className="flex flex-row w-full justify-center">
        <div className="w-1/2 mt-20 mr-2 p-4 text-center bg-ocf-gray border text-black rounded-2xl p-2.5 dark:bg-ocf-gray-800">
          <ExpectedOutput />
        </div>
        <div className="w-1/2 mt-20 ml-2 p-4 text-center bg-ocf-gray border text-black rounded-2xl p-2.5 dark:bg-ocf-gray-800">
          <CurrentCapacity />
        </div>
      </div>
      <div className="flex flex-row w-full justify-center">
        <div className="w-1/2 mt-3 mr-2 text-center">
          <HighLowTimes />
        </div>
        <div className="w-1/2 ml-2" />
      </div>
      <div className="w-full mt-10 mr-2 p-4 bg-ocf-gray border text-black rounded-2xl p-2.5 dark:bg-ocf-gray-800">
        <Warnings />
      </div>
      <div className="w-full mt-6 mr-2 p-4 bg-ocf-gray border text-black rounded-2xl p-2.5 dark:bg-ocf-gray-800">
        <Graph />
      </div>
    </>
  );
};

export default Dashboard;
