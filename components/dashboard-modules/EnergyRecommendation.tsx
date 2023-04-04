import { FC } from 'react';
import { useSiteData } from '~/lib/hooks';
import useTime from '~/lib/hooks/useTime';
import content from '../../content/power-card-content.json';
import NumberDisplay from './NumberDisplay';
import RecommendationDisplay from './RecommendationDisplay';
import { getCurrentTimeGeneration } from '~/lib/utils';
import useSiteAggregation from '~/lib/hooks/useSiteAggregation';

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

const EnergyRecommendation: FC<{ siteUUIDs: string[] }> = ({ siteUUIDs }) => {
  const { totalExpectedGeneration } = useSiteAggregation(siteUUIDs);
  const { latitude, longitude } = useSiteData(siteUUIDs[0]);
  const currentOutput = totalExpectedGeneration
    ? getCurrentTimeGeneration(totalExpectedGeneration)
    : undefined;

  const recommendationIdx = currentOutput
    ? getBestRecommendationIndex(currentOutput)
    : null;

  const { isDayTime } = useTime(latitude, longitude);
  if (!isDayTime && currentOutput === 0) {
    return (
      <RecommendationDisplay
        src="/nighttime.svg"
        alt="Moon and stars"
        description="Solar output is currently 0"
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
    return <NumberDisplay title="Recommendations" value="N/A" />;
  }
};

export default EnergyRecommendation;
