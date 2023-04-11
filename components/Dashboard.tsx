import { FC } from 'react';
import EnergyRecommendation from '~/components/dashboard-modules/EnergyRecommendation';
import ThresholdGraph from '~/components/graphs/ThresholdGraph';
import { useSiteData } from '~/lib/hooks';
import WeatherCard from './WeatherCard';
import ExpectedTotalOutput from './dashboard-modules/ExpectedTotalOutput';
import SunnyTimeframe from './dashboard-modules/SunnyTimeframe';
import Graph from './graphs/Graph';
import { SiteList } from '~/lib/types';

interface DashboardProps {
  siteUUIDs: SiteList;
}
const Dashboard: FC<DashboardProps> = ({ siteUUIDs }) => {
  const isAggregate = siteUUIDs.site_list.length > 1;
  const sites = siteUUIDs.site_list.map((site) => site.site_uuid);
  const { client_site_name } = useSiteData(sites[0]);
  return (
    <div className="bg-ocf-black max-w-screen-lg w-screen min-h-screen px-4 mb-[var(--bottom-nav-margin)]">
      <h1 className="mt-4 mb-4 text-ocf-gray text-3xl font-bold">
        {isAggregate ? 'Aggregate Dashboard' : client_site_name}
      </h1>
      <div className="grid grid-areas-dashboard-mobile grid-cols-mobile-columns grid-rows-mobile-rows md:grid-areas-dashboard-desktop md:grid-cols-desktop-columns md:grid-rows-desktop-rows w-full gap-4">
        <div className="grid-in-Heading1 block md:hidden">
          <h2 className="text-ocf-gray text-base font-semibold leading-none mt-2">
            Solar Activity
          </h2>
        </div>
        {!isAggregate && (
          <div className="grid-in-Sunny">
            <SunnyTimeframe siteUUID={sites[0]} />
          </div>
        )}
        <div className="grid-in-Recommendation">
          <EnergyRecommendation siteUUIDs={sites} />
        </div>
        <div className="grid-in-Site-Graph">
          <ThresholdGraph siteUUIDs={sites} />
        </div>
        <div className="grid-in-Heading2 block md:hidden md:grid-in-Sunny">
          <h2 className="text-ocf-gray text-base font-semibold leading-none mt-2">
            Metrics
          </h2>
        </div>

        <div className="grid-in-Expected">
          <ExpectedTotalOutput siteUUIDs={sites} />
        </div>
        {!isAggregate && (
          <div className="grid-in-Yield">
            <WeatherCard siteUUID={sites[0]} />
          </div>
        )}
        <div className="grid-in-Graph">
          <Graph siteUUIDs={sites} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
