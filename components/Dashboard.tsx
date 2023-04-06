import { FC } from 'react';
import EnergyRecommendation from '~/components/dashboard-modules/EnergyRecommendation';
import ThresholdGraph from '~/components/graphs/ThresholdGraph';
import CurrentCapacity from './dashboard-modules/CurrentCapacity';
import ExpectedTotalOutput from './dashboard-modules/ExpectedTotalOutput';
import SunnyTimeframe from './dashboard-modules/SunnyTimeframe';
import Graph from './graphs/Graph';
import { useSiteData } from '~/lib/hooks';

interface DashboardProps {
  siteUUID: string;
}
const Dashboard: FC<DashboardProps> = ({ siteUUID }) => {
  const { client_site_name } = useSiteData(siteUUID);
  return (
    <div className="bg-ocf-black max-w-screen-lg w-screen min-h-screen px-4 mb-[var(--bottom-nav-margin)]">
      <h1 className="mt-4 mb-4 text-ocf-gray text-3xl font-bold">
        {client_site_name}
      </h1>
      <div className="grid grid-areas-dashboard-mobile grid-cols-mobile-columns grid-rows-mobile-rows md:grid-areas-dashboard-desktop md:grid-cols-desktop-columns md:grid-rows-desktop-rows w-full gap-4">
        <div className="grid-in-Heading1 block md:hidden">
          <h2 className="text-ocf-gray text-base font-semibold leading-none mt-2">
            Solar Activity
          </h2>
        </div>
        <div className="grid-in-Sunny">
          <SunnyTimeframe siteUUID={siteUUID} />
        </div>
        <div className="grid-in-Recommendation">
          <EnergyRecommendation siteUUID={siteUUID} />
        </div>
        <div className="grid-in-Site-Graph">
          <ThresholdGraph siteUUID={siteUUID} />
        </div>
        <div className="grid-in-Heading2 block md:hidden md:grid-in-Sunny">
          <h2 className="text-ocf-gray text-base font-semibold leading-none mt-2">
            Metrics
          </h2>
        </div>

        <div className="grid-in-Expected">
          <ExpectedTotalOutput siteUUID={siteUUID} />
        </div>
        <div className="grid-in-Yield">
          <CurrentCapacity siteUUID={siteUUID} />
        </div>
        <div className="grid-in-Graph">
          <Graph siteUUID={siteUUID} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;