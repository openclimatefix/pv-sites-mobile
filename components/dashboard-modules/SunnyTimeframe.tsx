import { FC, useState } from 'react';

import NumberDisplay from './NumberDisplay';

import { getNextThresholdIndex } from 'lib/utils';

import { graphThreshold } from 'lib/graphs';

import { useSiteData } from 'lib/hooks';
import { hoursToMinutes, millisecondsToHours } from 'date-fns';
import useDateFormatter from '~/lib/hooks/useDateFormatter';

const SunnyTimeframe: FC<{ siteUUID: string }> = ({ siteUUID }) => {
  const { forecastData, isLoading, installed_capacity_kw } =
    useSiteData(siteUUID);
  const [isRelativeTime, setIsRelativeTime] = useState(false);
  const { timeFormatter } = useDateFormatter(siteUUID);

  const thresholdCapacityKW = installed_capacity_kw
    ? installed_capacity_kw * graphThreshold
    : 0;

  if (!forecastData) {
    return (
      <NumberDisplay
        title="Loading"
        value="Loading..."
        isLoading={isLoading}
        onClick={() => {}}
      />
    );
  }

  const nextThreshold = getNextThresholdIndex(
    forecastData.forecast_values,
    thresholdCapacityKW
  );

  if (!nextThreshold) {
    return null;
  }

  const { aboveThreshold, index } = nextThreshold;

  let value = '';
  let sunnyText = '';

  if (isRelativeTime) {
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

    value = `${difference} ${timeUnit}`;
    sunnyText = aboveThreshold ? 'Sunny in' : 'Sunny for';
  } else {
    value = timeFormatter.format(
      forecastData.forecast_values[index].datetime_utc
    );
    sunnyText = aboveThreshold ? 'Sunny at' : 'Sunny until';
  }

  return (
    <NumberDisplay
      title={sunnyText}
      value={value}
      onClick={() => setIsRelativeTime(!isRelativeTime)}
      isLoading={isLoading}
    />
  );
};

export default SunnyTimeframe;
