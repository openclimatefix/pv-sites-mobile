import ThresholdGraph from '~/components/graphs/ThresholdGraph';
import CurrentCapacity from '../components/dashboard_modules/CurrentCapacity';
import CurrentOutput from '../components/dashboard_modules/CurrentOutput';
import ExpectedTotalOutput from '../components/dashboard_modules/ExpectedTotalOutput';
import Graph from '../components/graphs/Graph';
import { withPageAuthRequired } from '~/lib/auth';

const Dashboard = () => {
  return (
    <div className="bg-ocf-black w-screen min-h-screen px-4 mb-[75px]">
      <h1 className="mt-4 text-ocf-gray text-3xl font-bold">Dashboard</h1>
      <div className="flex flex-row w-full justify-start">
        <ThresholdGraph />
      </div>
      <div className="flex flex-row w-full justify-start">
        <ExpectedTotalOutput />
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
