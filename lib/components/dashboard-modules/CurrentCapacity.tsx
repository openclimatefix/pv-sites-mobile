import { FC } from 'react';
import NumberDisplay from './NumberDisplay';
import { getCurrentTimeGeneration } from '~/lib/generation';
import { useSiteAggregation } from '~/lib/sites';
import { Site } from '~/lib/types';

interface CurrentCapacityProps {
  sites: Site[];
}

const CurrentCapacity: FC<CurrentCapacityProps> = ({ sites }) => {
  const { totalInstalledCapacityKw, totalExpectedGeneration, isLoading } =
    useSiteAggregation(sites);

  let currentOutput = totalExpectedGeneration
    ? getCurrentTimeGeneration(totalExpectedGeneration)
    : null;

  return (
    <NumberDisplay
      title="Percent Yield"
      value={`${
        isLoading
          ? 'Loading...'
          : currentOutput != null &&
            totalInstalledCapacityKw != null &&
            totalInstalledCapacityKw != 0
          ? ((100 * currentOutput) / totalInstalledCapacityKw).toFixed(2) + '%'
          : 'N/A'
      }`}
      isLoading={isLoading}
    />
  );
};

export default CurrentCapacity;
