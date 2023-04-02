import { FC } from 'react';
import { useSiteData } from '~/lib/hooks';
import { getCurrentTimeGeneration } from '~/lib/utils';
import NumberDisplay from './NumberDisplay';

const CurrentCapacity: FC<{ siteUUID: string }> = ({ siteUUID }) => {
  const { forecastData, installed_capacity_kw, isLoading } =
    useSiteData(siteUUID);

  let currentOutput = forecastData
    ? getCurrentTimeGeneration(forecastData.forecast_values)
    : null;

  return (
    <NumberDisplay
      title="Current Capacity"
      value={`${
        isLoading
          ? 'Loading...'
          : currentOutput != null &&
            installed_capacity_kw != null &&
            installed_capacity_kw != 0
          ? ((100 * currentOutput) / installed_capacity_kw).toFixed(2) + '%'
          : 'N/A'
      }`}
    />
  );
};

export default CurrentCapacity;
