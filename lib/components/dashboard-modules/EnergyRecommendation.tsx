import { FC } from 'react';
import NumberDisplay from './NumberDisplay';
import RecommendationDisplay from './RecommendationDisplay';
import { Site } from '~/lib/types';
import { useSitesGeneration } from '~/lib/sites';
import { getCurrentTimeGeneration } from '~/lib/generation';
import { useSiteTime } from '~/lib/time';
import { skeleton } from '~/lib/skeleton';
import { Appliance, appliances } from '~/lib/appliances';

/**
 * Finds the "recommended appliance" given the current output and a list of appliances
 * The "recommended appliance" is just the appliance with the most power required,
 * but still useable given the current output.
 * @param currentOutput the current output
 * @param appliances the list of appliances
 * @returns the "recommended appliance"
 */
const getRecommendedAppliance = (
  currentOutput: number,
  appliances: Appliance[]
) => {
  let recommended: Appliance | null = null;

  for (const appliance of appliances) {
    if (
      appliance.kW > (recommended?.kW ?? 0) &&
      appliance.kW <= currentOutput
    ) {
      recommended = appliance;
    }
  }

  return recommended;
};

interface EnergyRecommendationProps {
  sites: Site[];
}

const EnergyRecommendation: FC<EnergyRecommendationProps> = ({ sites }) => {
  const { isLoading, aggregateForecastedGeneration } =
    useSitesGeneration(sites);
  const representativeSite = sites[0];

  const currentOutput =
    aggregateForecastedGeneration &&
    getCurrentTimeGeneration(aggregateForecastedGeneration);
  const recommended =
    currentOutput && getRecommendedAppliance(currentOutput, appliances);

  const { isDayTime } = useSiteTime(representativeSite);

  if (isLoading) {
    return (
      <div
        className="
        align-center
        flex
        h-[100%]
        flex-1
        justify-center
        rounded-lg
        bg-ocf-black-500
        p-4
        text-center"
      >
        <div className={skeleton}></div>
      </div>
    );
  }

  if (!isDayTime && currentOutput === 0) {
    return (
      <RecommendationDisplay
        src="/nighttime.svg"
        alt="Moon and stars"
        description="Solar output is currently 0&nbsp;kW"
      />
    );
  }

  if (recommended) {
    return (
      <RecommendationDisplay
        src={`/appliances/icons/${recommended.icon}`}
        alt={recommended.name}
        description={`You have enough power to ${
          recommended.action
        } your ${recommended.name.toLowerCase()}`}
      />
    );
  }

  return (
    <NumberDisplay title="Recommendations" value="N/A" isLoading={isLoading} />
  );
};

export default EnergyRecommendation;
