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

  function outputMessage(
    isLoading: boolean,
    currentOutput: number | undefined
  ) {
    if (isLoading) {
      return 'Loading...';
    } else if (currentOutput === undefined) {
      return 'N/A';
    } else {
      return currentOutput.toFixed(2);
    }
  }

  return (
    <NumberDisplay
      title="Current Output"
      value={`${outputMessage(isLoading, currentOutput)}`}
    />
  );
};

export default CurrentOutput;
