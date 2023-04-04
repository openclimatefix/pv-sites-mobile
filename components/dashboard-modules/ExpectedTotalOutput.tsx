import { FC } from 'react';
import NumberDisplay from './NumberDisplay';
import { useSiteData } from 'lib/hooks';
import { getTotalExpectedForecastOutput } from '~/lib/utils';

const ExpectedTotalOutput: FC<{ siteUUID: string }> = ({ siteUUID }) => {
  const { forecastData } = useSiteData(siteUUID);
  return (
    <NumberDisplay
      title="Today's Expected Output"
      value={
        forecastData
          ? getTotalExpectedForecastOutput(forecastData.forecast_values)
              .toFixed(2)
              .toString() + ' kWh'
          : 'Loading'
      }
    />
  );
};

export default ExpectedTotalOutput;
