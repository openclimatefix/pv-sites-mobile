import { FC } from 'react';
import NumberDisplay from './NumberDisplay';
import { useSiteData } from 'lib/hooks';
import { GenerationDataPoint } from '~/lib/types';

export const getTotalExpectedOutput = (points: GenerationDataPoint[]) => {
  let approxArea = 0;
  const millisInHour = 3.6e6;

  for (let i = 0; i < points.length - 1; i++) {
    const avgHeight =
      (points[i].generation_kw + points[i + 1].generation_kw) / 2;
    const timeDiffMilli =
      new Date(points[i + 1].datetime_utc).getTime() -
      new Date(points[i].datetime_utc).getTime();

    const timeDiffHours = timeDiffMilli / millisInHour;
    approxArea += avgHeight * timeDiffHours;
  }

  return approxArea;
};

const ExpectedTotalOutput: FC<{ siteUUID: string }> = ({ siteUUID }) => {
  const { forecastData, isLoading } = useSiteData(siteUUID);
  return (
    <NumberDisplay
      title="Today's Expected Output"
      value={
        forecastData
          ? getTotalExpectedOutput(forecastData.forecast_values)
              .toFixed(2)
              .toString() + ' kWh'
          : 'Loading...'
      }
      isLoading={isLoading}
    />
  );
};

export default ExpectedTotalOutput;
