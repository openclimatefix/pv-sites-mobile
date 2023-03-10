import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import ThresholdGraph from '~/components/graphs/ThresholdGraph';
import CurrentCapacity from '../components/dashboard_modules/CurrentCapacity';
import CurrentOutput from '../components/dashboard_modules/CurrentOutput';
import NumberDisplay from '../components/dashboard_modules/NumberDisplay';
import Graph from '../components/graphs/Graph';
import SunnyTimeframe from '../components/dashboard_modules/SunnyTimeframe';

const Dashboard = () => {
  return (
    <div className="bg-ocf-black w-screen min-h-screen px-4 mb-[75px]">
      <h1 className="mt-4 text-ocf-gray text-3xl font-bold">Dashboard</h1>
      <div className="flex flex-row w-full justify-center space-x-4">
        <SunnyTimeframe />
      </div>
      <div className="flex flex-row w-full justify-start">
        <ThresholdGraph />
      </div>
      <div className="flex flex-row w-full justify-start">
        <NumberDisplay title="Today's Expected Output" value="10.23 kWh" />
      </div>
      <div className="flex flex-row w-full justify-center space-x-4">
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
