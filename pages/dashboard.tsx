import HighLowTimes from '../components/HighLowTimes';
import NumberDisplay from '../components/NumberDisplay';
import Warnings from '../components/Warnings';
import Graph from '../components/Graph';
import React from 'react';

const Dashboard = () => {
  return (
    <div className="bg-black w-screen h-screen px-4">
      <div className="mt-24 text-ocf-gray text-3xl font-bold">Dashboard</div>
      <div className="flex flex-row w-full justify-start">
        <NumberDisplay title="Today's Expected Output" value="2700kW" />
      </div>
      <div className="flex flex-row w-full justify-center space-x-4">
        <NumberDisplay title="Current Output" value="2200kW" />
        <NumberDisplay title="Current Capacity" value="80%" />
      </div>
      <Warnings />
      <Graph />
    </div>
  );
};

export default Dashboard;
