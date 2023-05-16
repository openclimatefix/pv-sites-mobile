import { FC } from 'react';
import NumberDisplay from './NumberDisplay';
import { getCurrentTimeGeneration } from '~/lib/generation';
import { useSiteAggregation } from '~/lib/sites';
import { Site } from '~/lib/types';

interface CurrentOutputProps {
  sites: Site[];
}

const CurrentOutput: FC<CurrentOutputProps> = ({ sites }) => {
  const { totalInstalledCapacityKw, aggregateForecastedGeneration, isLoading } =
    useSiteAggregation(sites);

  const currentOutput = aggregateForecastedGeneration?.length
    ? getCurrentTimeGeneration(aggregateForecastedGeneration)
    : 0;

  const title = totalInstalledCapacityKw ? 'Current Output' : 'Percent Yield';

  const value = totalInstalledCapacityKw
    ? currentOutput.toFixed(2) + ' kW'
    : 100 * currentOutput + '%';

  return (
    <NumberDisplay
      title={title}
      value={isLoading ? 'Loading...' : value.toString()}
      isLoading={isLoading}
    />
  );
};

export default CurrentOutput;
