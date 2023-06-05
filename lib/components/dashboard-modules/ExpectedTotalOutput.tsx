import { FC } from 'react';
import {
  generationDataOverDateRange,
  getTotalExpectedOutput,
} from '~/lib/generation';
import { useSitesGeneration } from '~/lib/sites';
import { useSiteTime } from '~/lib/time';
import { Site } from '~/lib/types';
import NumberDisplay from './NumberDisplay';

interface ExpectedTotalOutputProps {
  sites: Site[];
}

const ExpectedTotalOutput: FC<ExpectedTotalOutputProps> = ({ sites }) => {
  const representativeSite = sites[0];
  const { isLoading, aggregateForecastedGeneration } =
    useSitesGeneration(sites);
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
