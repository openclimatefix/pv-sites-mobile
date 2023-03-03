import NumberDisplay from '../components/NumberDisplay';
import Warnings from '../components/Warnings';
import Graph from '../components/Graph';
import CurrentOutput from '../components/CurrentOutput';
import CurrentCapacity from '../components/CurrentCapacity';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import useSWR from 'swr';

const Dashboard = () => {
  return (
    <div className="bg-ocf-black w-screen h-screen px-4">
      <h1 className="mt-4 text-ocf-gray text-3xl font-bold">Dashboard</h1>
      <div className="flex flex-row w-full justify-start">
        <Warnings />
      </div>
      <div className="flex flex-row w-full justify-start">
        <NumberDisplay title="Today's Expected Output" value="2700kW" />
      </div>
      <div className="flex flex-row w-full justify-center space-x-4">
        {/* <NumberDisplay
          title="Current Output"
          value={`${cur_output != null ? cur_output.toFixed(0) : 'Loading'} kW`}
        />
        <NumberDisplay
          title="Current Capacity"
          value={`${
            cur_output != null && installed_capacity_kw != null
              ? (cur_output / installed_capacity_kw)?.toFixed(0)
              : 'Loading'
          }%`}
        /> */}
        <CurrentOutput />
        <CurrentCapacity />
      </div>
      <div className="flex flex-row w-full justify-start">
        <Graph />
      </div>
    </div>
  );
};

export default Dashboard;
export const getServerSideProps = withPageAuthRequired();
