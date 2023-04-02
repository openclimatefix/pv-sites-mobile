import { FC } from 'react';

import NumberDisplay from './NumberDisplay';

import { getNextThresholdIndex } from 'lib/utils';

import { graphThreshold } from 'lib/graphs';

import { useSiteData } from 'lib/hooks';
import { hoursToMinutes, millisecondsToHours } from 'date-fns';

const SunnyTimeframe: FC<{ siteUUID: string }> = ({ siteUUID }) => {
  const { forecastData } = useSiteData(siteUUID);

  if (!forecastData) {
    return <NumberDisplay title="Loading" value="..." />;
  }

  const nextThreshold = getNextThresholdIndex(
    forecastData.forecast_values,
    graphThreshold
  );

  if (!nextThreshold) {
    return null;
  }

  const { aboveThreshold, index } = nextThreshold;

  let difference = millisecondsToHours(
    forecastData.forecast_values[index].datetime_utc.getTime() -
      new Date().getTime()
  );
  let timeUnit = difference === 1 ? 'Hour' : 'Hours';

  // If we are under an hour, round to minutes
  if (difference < 1) {
    difference = hoursToMinutes(difference);
    timeUnit = difference ? 'Minute' : 'Minutes';
  }

  const sunnyText = aboveThreshold ? 'Sunny in' : 'Sunny for';

  return (
    <NumberDisplay title={sunnyText} value={`${difference} ${timeUnit}`} />
  );
};

export default SunnyTimeframe;
