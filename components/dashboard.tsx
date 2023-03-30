import { FC } from 'react';
import EnergyRecommendation from '~/components/dashboard-modules/EnergyRecommendation';
import ThresholdGraph from '~/components/graphs/ThresholdGraph';
import { withSites } from '~/lib/utils';
import CurrentCapacity from './dashboard-modules/CurrentCapacity';
import CurrentOutput from './dashboard-modules/CurrentOutput';
import ExpectedTotalOutput from './dashboard-modules/ExpectedTotalOutput';
import SunnyTimeframe from './dashboard-modules/SunnyTimeframe';
import Graph from './graphs/Graph';

interface DashboardProps {
  siteUUID: string;
}
const Dashboard: FC<DashboardProps> = ({ siteUUID }) => {
  return (
    <div className="bg-ocf-black max-w-screen-lg w-screen min-h-screen px-4 mb-[75px]">
      <h1 className="mt-4 mb-6 text-ocf-gray text-3xl font-bold">Dashboard</h1>
      <h2 className="mt-4 mb-2 text-ocf-gray text-base font-semibold">
        Solar Activity
      </h2>
      <div className="flex flex-row w-full justify-center space-x-4">
        <SunnyTimeframe siteUUID={siteUUID} />
        <EnergyRecommendation siteUUID={siteUUID} />
      </div>
      <div className="flex flex-row w-full justify-start">
        <ThresholdGraph siteUUID={siteUUID} />
      </div>
      <h2 className="mt-4 mb-2 text-ocf-gray text-base font-semibold">
        Metrics
      </h2>
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
export const getServerSideProps = withSites();
