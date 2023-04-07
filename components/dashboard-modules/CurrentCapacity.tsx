import { FC } from 'react';
import { useSiteData } from '~/lib/hooks';
import useSiteAggregation from '~/lib/hooks/useSiteAggregation';
import { getCurrentTimeGeneration } from '~/lib/utils';
import NumberDisplay from './NumberDisplay';

const CurrentCapacity: FC<{ siteUUIDs: string[] }> = ({ siteUUIDs }) => {
  const { totalInstalledCapacityKw, totalExpectedGeneration, isLoading } =
    useSiteAggregation(siteUUIDs);

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
    />
  );
};

export default CurrentCapacity;
