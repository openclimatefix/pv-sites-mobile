import { FC } from 'react';
import content from '../../../content/power-card-content.json';
import NumberDisplay from './NumberDisplay';
import RecommendationDisplay from './RecommendationDisplay';
import { Site } from '~/lib/types';
import { useSiteAggregation } from '~/lib/sites';
import { getCurrentTimeGeneration } from '~/lib/generation';
import { useSiteTime } from '~/lib/time';
import { skeleton } from '~/lib/skeleton';

/**
 * Determines the appliance with the greatest energy required that is less than or equal to the current output
 * @param currentOutput the current output in kW based on the getCurrentTimeGeneration
 * @returns the index of the appliance with the greatest enrgy requiement less than or equal to the current ouput
 * or -1 if an index could not be found
 */

const getBestRecommendationIndex = (currentOutput: number) => {
  let maxIndex = null;
  let maxKW = 0;

  content.appliances.forEach((appliance, i) => {
    if (Number(appliance.kW) > maxKW && Number(appliance.kW) <= currentOutput) {
      maxIndex = i;
      maxKW = Number(appliance.kW);
    }
  });

  return maxIndex;
};

interface EnergyRecommendationProps {
  sites: Site[];
}

const EnergyRecommendation: FC<EnergyRecommendationProps> = ({ sites }) => {
  const { isLoading, totalForecastedGeneration } = useSiteAggregation(sites);
  const representativeSite = sites[0];

  const currentOutput =
    totalForecastedGeneration &&
    getCurrentTimeGeneration(totalForecastedGeneration);
  const recommendationIdx = currentOutput
    ? getBestRecommendationIndex(currentOutput)
    : null;

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
        rounded-2xl
        bg-ocf-black-500
        p-4
        text-center"
      >
        <div className={skeleton}></div>
      </div>
    );
  } else if (!isDayTime && currentOutput === 0) {
    return (
      <RecommendationDisplay
        src="/nighttime.svg"
        alt="Moon and stars"
        description="Solar output is currently 0 kW"
      />
    );
  } else if (recommendationIdx) {
    const appliance = content.appliances[recommendationIdx];
    return (
      <RecommendationDisplay
        src={appliance.icon}
        alt=""
        description={appliance.description}
      />
    );
  } else {
    return (
      <NumberDisplay
        title="Recommendations"
        value="N/A"
        isLoading={isLoading}
      />
    );
  }
};

export default EnergyRecommendation;
