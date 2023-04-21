import { FC } from 'react';
import {
  generationDataOverDateRange,
  getTotalExpectedOutput,
} from '~/lib/generation';
import { useSiteAggregation } from '~/lib/sites';
import { Site } from '~/lib/types';
import NumberDisplay from './NumberDisplay';
import { useSiteTime } from '~/lib/time';

interface ExpectedTotalOutputProps {
  sites: Site[];
}

const ExpectedTotalOutput: FC<ExpectedTotalOutputProps> = ({ sites }) => {
  const representativeSite = sites[0];
  const { isLoading, totalForecastedGeneration } = useSiteAggregation(sites);
  const { dawn, dusk } = useSiteTime(representativeSite);

  return (
    <NumberDisplay
      title="Today's Expected Output"
      value={
        totalForecastedGeneration
          ? getTotalExpectedOutput(
              generationDataOverDateRange(totalForecastedGeneration, dawn, dusk)
            )
              .toFixed(2)
              .toString() + ' kWh'
          : 'Loading'
      }
      isLoading={isLoading}
    />
  );
};

export default ExpectedTotalOutput;
