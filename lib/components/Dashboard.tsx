import { FC } from 'react';
import EnergyRecommendation from '~/lib/components/dashboard-modules/EnergyRecommendation';
import ThresholdGraph from '~/lib/components/graphs/ThresholdGraph';
import WeatherCard from './dashboard-modules/WeatherCard';
import ExpectedTotalOutput from './dashboard-modules/ExpectedTotalOutput';
import SunnyTimeframe from './dashboard-modules/SunnyTimeframe';
import Graph from './graphs/Graph';
import CurrentOutput from './dashboard-modules/CurrentOutput';
import { Site } from '~/lib/types';
import ContactButton from './ContactButton';
import { useMediaQuery } from '../utils';

interface DashboardProps {
  sites: Site[];
}
const Dashboard: FC<DashboardProps> = ({ sites }) => {
  const isAggregate = sites.length > 1;

  return (
    <div className="mb-[var(--bottom-nav-margin)] w-screen max-w-screen-lg bg-ocf-black px-4">
      <div className="flex flex-row items-center justify-between">
        <h1 className="mb-4 mt-4 text-xl font-semibold text-ocf-gray md:text-2xl">
          {isAggregate ? 'Dashboard' : sites[0].client_site_name}
        </h1>
        <div className="block md:hidden">
          <ContactButton />
        </div>
      </div>
      <hr className="mx-[-100px] h-[1px] w-[500%] border-0 bg-ocf-black-500 md:hidden" />
      <div className="grid w-full grid-cols-mobile-columns grid-rows-mobile-rows gap-4 grid-areas-dashboard-mobile md:grid-cols-desktop-columns md:grid-rows-desktop-rows md:grid-areas-dashboard-desktop xs:grid-areas-dashboard-mobile-xs">
        <div className="block grid-in-Heading1 md:hidden">
          <h2 className="mt-2 text-base font-semibold leading-none text-ocf-gray">
            Solar Activity
          </h2>
        </div>
        <div className="grid-in-Sunny">
          <SunnyTimeframe sites={sites} />
        </div>
        <div className="grid-in-Recommendation">
          <EnergyRecommendation sites={sites} />
        </div>
        <div className="grid-in-Site-Graph">
          <ThresholdGraph sites={sites} />
        </div>
        <div className="block grid-in-Heading2 md:hidden md:grid-in-Sunny">
          <h2 className="mt-2 text-base font-semibold leading-none text-ocf-gray">
            Metrics
          </h2>
        </div>
        <div className="grid-in-Expected-Total-Output xs:hidden">
          <ExpectedTotalOutput sites={sites} />
        </div>
        <div className="grid-in-Current-Output md:hidden">
          <CurrentOutput sites={sites} />
        </div>
        <div className="grid-in-Weather-Icons">
          <WeatherCard sites={sites} />
        </div>
        <div className="grid-in-Graph">
          <Graph sites={sites} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
