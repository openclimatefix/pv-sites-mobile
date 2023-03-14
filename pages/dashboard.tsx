import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import ThresholdGraph from '~/components/graphs/ThresholdGraph';
import CurrentCapacity from '../components/dashboard-modules/CurrentCapacity';
import CurrentOutput from '../components/dashboard-modules/CurrentOutput';
import ExpectedTotalOutput from '../components/dashboard-modules/ExpectedTotalOutput';
import Graph from '../components/graphs/Graph';
import SunnyTimeframe from '../components/dashboard-modules/SunnyTimeframe';

const siteUUID = 'b97f68cd-50e0-49bb-a850-108d4a9f7b7e';

const Dashboard = () => {
  return (
    <div className="bg-ocf-black max-w-screen-lg w-screen min-h-screen px-4 mb-[75px]">
      <h1 className="mt-4 text-ocf-gray text-3xl font-bold">Dashboard</h1>
      <div className="flex flex-row w-full justify-center space-x-4">
        <SunnyTimeframe siteUUID={siteUUID} />
      </div>
      <div className="flex flex-row w-full justify-start">
        <ThresholdGraph siteUUID={siteUUID} />
      </div>
      <div className="flex flex-row w-full justify-start">
        <ExpectedTotalOutput siteUUID={siteUUID} />
      </div>
      <div className="flex flex-row w-full justify-center space-x-4">
        <CurrentOutput siteUUID={siteUUID} />
        <CurrentCapacity siteUUID={siteUUID} />
      </div>
      <div className="flex flex-row w-full justify-start">
        <Graph siteUUID={siteUUID} />
      </div>
    </div>
  );
};

export default Dashboard;
export const getServerSideProps = withPageAuthRequired();
