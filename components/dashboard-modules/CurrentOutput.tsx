import { FC } from 'react';
import useSWR from 'swr';
import { useSiteData } from '~/lib/hooks';
import { getCurrentTimeForecast } from '~/lib/utils';
import NumberDisplay from './NumberDisplay';

const CurrentOutput: FC<{ siteUUID: string }> = ({ siteUUID }) => {
  const { forecastData, isLoading } = useSiteData(siteUUID);
  const currentOutput = forecastData
    ? getCurrentTimeForecast(forecastData.forecast_values)
    : undefined;

  return (
    <NumberDisplay
      title="Current Output"
      value={`${
        isLoading
          ? 'Loading...'
          : currentOutput
          ? currentOutput.toFixed(2) + ' kW'
          : 'N/A'
      }`}
    />
  );
};

export default CurrentOutput;
