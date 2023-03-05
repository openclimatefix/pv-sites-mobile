import ThresholdGraph from '~/components/ThresholdGraph';
import NumberDisplay from '../components/NumberDisplay';
import Graph from '../components/Graph';
import CurrentOutput from '../components/CurrentOutput';
import CurrentCapacity from '../components/CurrentCapacity';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

const Dashboard = () => {
  return (
    <div className="bg-ocf-black w-screen h-screen px-4">
      <h1 className="mt-4 text-ocf-gray text-3xl font-bold">Dashboard</h1>
      <div className="flex flex-row w-full justify-start">
        <ThresholdGraph />
      </div>
      <div className="flex flex-row w-full justify-start">
        <NumberDisplay title="Today's Expected Output" value="2700 kW" />
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
