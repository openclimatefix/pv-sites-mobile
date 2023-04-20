import { useSiteData } from 'lib/hooks';
import { FC } from 'react';
import { generationDataOverDateRange } from '~/lib/graphs';
import useSiteAggregation from '~/lib/hooks/useSiteAggregation';
import useTime from '~/lib/hooks/useTime';
import { GenerationDataPoint } from '~/lib/types';
import NumberDisplay from './NumberDisplay';

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

const ExpectedTotalOutput: FC<{ siteUUIDs: string[] }> = ({ siteUUIDs }) => {
  const representativeSiteUUID = siteUUIDs[0];
  const { isLoading, totalForecastedGeneration } =
    useSiteAggregation(siteUUIDs);
  const { latitude, longitude } = useSiteData(representativeSiteUUID);
  const { sunriseTime, sunsetTime } = useTime(latitude, longitude);
  return (
    <NumberDisplay
      title="Today's Expected Output"
      value={
        totalForecastedGeneration
          ? getTotalExpectedOutput(
              generationDataOverDateRange(
                totalForecastedGeneration,
                sunriseTime,
                sunsetTime
              )
            )
              .toFixed(2)
              .toString() + ' kWh'
          : 'Loading'
      }
      isLoading={isLoading}
    />
  );
};

export default ExpectedTotalOutput;
