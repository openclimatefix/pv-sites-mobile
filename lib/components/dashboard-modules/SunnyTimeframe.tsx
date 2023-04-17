import { FC, useState } from 'react';
import NumberDisplay from './NumberDisplay';
import { getNextThresholdIndex, graphThreshold } from 'lib/graphs';
import dayjs from 'dayjs';
import { useSiteData } from '~/lib/sites';
import { Site } from '~/lib/types';
import { useSiteTime } from '~/lib/time';

const SunnyTimeframe: FC<{ site: Site }> = ({ site }) => {
  const { forecastData, isLoading } = useSiteData(site.site_uuid);
  const [isRelativeTime, setIsRelativeTime] = useState(false);
  const { timeFormat } = useSiteTime(site);

  const thresholdCapacityKW = site.installed_capacity_kw * graphThreshold;

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
    let difference = dayjs(
      forecastData.forecast_values[index].datetime_utc
    ).diff(dayjs(), 'hours', true);

    let timeUnit = difference === 1 ? 'Hour' : 'Hours';

    // If we are under an hour, round to minutes
    if (difference < 1) {
      difference = Math.round(dayjs.duration(difference, 'hours').asMinutes());
      timeUnit = difference ? 'Minute' : 'Minutes';
    }

    value = `${difference} ${timeUnit}`;
    sunnyText = aboveThreshold ? 'Sunny in' : 'Sunny for';
  } else {
    value = timeFormat(forecastData.forecast_values[index].datetime_utc);
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
