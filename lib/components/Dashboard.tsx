import { FC } from 'react';
import EnergyRecommendation from '~/lib/components/dashboard-modules/EnergyRecommendation';
import ThresholdGraph from '~/lib/components/graphs/ThresholdGraph';
import WeatherCard from './dashboard-modules/WeatherCard';
import ExpectedTotalOutput from './dashboard-modules/ExpectedTotalOutput';
import SunnyTimeframe from './dashboard-modules/SunnyTimeframe';
import Graph from './graphs/Graph';
import CurrentOutput from './dashboard-modules/CurrentOutput';
import { Site } from '~/lib/types';

interface DashboardProps {
  sites: Site[];
}
const Dashboard: FC<DashboardProps> = ({ sites }) => {
  const isAggregate = sites.length > 1;

  return (
    <div className="bg-ocf-black max-w-screen-xl w-screen min-h-screen px-4 mb-[var(--bottom-nav-margin)]">
      <h1 className="mt-4 mb-4 text-ocf-gray text-3xl font-bold">
        {isAggregate ? 'Dashboard' : sites[0].client_site_name}
      </h1>
      <div className="grid grid-areas-dashboard-mobile grid-cols-mobile-columns grid-rows-mobile-rows md:grid-areas-dashboard-desktop md:grid-cols-desktop-columns md:grid-rows-desktop-rows w-full gap-4">
        <div className="grid-in-Heading1 block md:hidden">
          <h2 className="text-ocf-gray text-base font-semibold leading-none mt-2">
            Solar Activity
          </h2>
        </div>
        {!isAggregate && (
          <div className="grid-in-Sunny">
            <SunnyTimeframe site={sites[0]} />
          </div>
        )}
        <div className="grid-in-Recommendation">
          <EnergyRecommendation sites={sites} />
        </div>
        <div className="grid-in-Site-Graph">
          <ThresholdGraph sites={sites} />
        </div>
        <div className="grid-in-Heading2 block md:hidden md:grid-in-Sunny">
          <h2 className="text-ocf-gray text-base font-semibold leading-none mt-2">
            Metrics
          </h2>
        </div>
        <div className="grid-in-Expected-Total-Output">
          <ExpectedTotalOutput sites={sites} />
        </div>
        <div className="grid-in-Current-Output md:hidden">
          <CurrentOutput site={sites[0]} />
        </div>
        {!isAggregate && (
          <div className="grid-in-Weather-Icons">
            <WeatherCard site={sites[0]} />
          </div>
        )}
        <div className="grid-in-Graph">
          <Graph sites={sites} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
