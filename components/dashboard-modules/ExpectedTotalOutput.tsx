import { FC } from 'react';
import NumberDisplay from './NumberDisplay';
import { useSiteData } from 'lib/hooks';
import { ForecastDataPoint } from '~/lib/types';

const getTotalExpectedOutput = (points: ForecastDataPoint[]) => {
  let approxArea = 0;
  const millisInHour = 3.6e6;

  for (let i = 0; i < points.length - 1; i++) {
    const avgHeight =
      (points[i].expected_generation_kw +
        points[i + 1].expected_generation_kw) /
      2;
    const timeDiffMilli =
      new Date(points[i + 1].target_datetime_utc).getTime() -
      new Date(points[i].target_datetime_utc).getTime();

    const timeDiffHours = timeDiffMilli / millisInHour;
    approxArea += avgHeight * timeDiffHours;
  }

  return approxArea.toFixed(2).toString() + ' kWh';
};

const ExpectedTotalOutput: FC<{ siteUUID: string }> = ({ siteUUID }) => {
  const { forecastData } = useSiteData(siteUUID);
  return (
    <NumberDisplay
      title="Today's Expected Output"
      value={
        forecastData
          ? getTotalExpectedOutput(forecastData.forecast_values)
          : 'Loading'
      }
    />
  );
};

export default ExpectedTotalOutput;
