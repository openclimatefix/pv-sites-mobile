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
  const { isLoading, aggregateForecastedGeneration } =
    useSiteAggregation(sites);
  const { sunrise, sunset } = useSiteTime(representativeSite);

  const value = aggregateForecastedGeneration
    ? getTotalExpectedOutput(
        generationDataOverDateRange(
          aggregateForecastedGeneration,
          sunrise,
          sunset
        )
      )
        .toFixed(2)
        .toString() + ' kWh'
    : 'Loading...';

  return (
    <NumberDisplay
      title="Today's Expected Output"
      value={value}
      isLoading={isLoading}
    />
  );
};

export default ExpectedTotalOutput;
