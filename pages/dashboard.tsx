import HighLowTimes from '../components/HighLowTimes';
import NumberDisplay from '../components/NumberDisplay';
import Warnings from '../components/Warnings';
import Graph from '../components/Graph';
import React from 'react';

const Dashboard = () => {
  return (
    <>
      <div className="flex flex-row w-full justify-center space-x-4">
        <NumberDisplay title="Today's Expected Output" value="2700MW" />
        <NumberDisplay title="Current Capacity" value="80%" />
      </div>
      <div className="flex flex-row w-full justify-start">
        <HighLowTimes />
      </div>
      <Warnings />
      <Graph />
    </>
  );
};

export default Dashboard;
