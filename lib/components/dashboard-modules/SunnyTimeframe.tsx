import dayjs from 'dayjs';
import { getNextThresholdIndex, graphThreshold } from 'lib/graphs';
import { FC, useState } from 'react';
import { useSiteAggregation } from '~/lib/sites';
import { useSiteTime } from '~/lib/time';
import { Site } from '~/lib/types';
import NumberDisplay from './NumberDisplay';

interface SunnyTimeframeProps {
  sites: Site[];
}

const SunnyTimeframe: FC<SunnyTimeframeProps> = ({ sites }) => {
  const representativeSite = sites[0];
  const { aggregateForecastedGeneration, totalInstalledCapacityKw, isLoading } =
    useSiteAggregation(sites);
  const [isRelativeTime, setIsRelativeTime] = useState(false);
  const { timeFormat } = useSiteTime(representativeSite);

  const thresholdCapacityKW = totalInstalledCapacityKw * graphThreshold;

  if (!aggregateForecastedGeneration) {
    return (
      <NumberDisplay
        title="Loading"
        value="Loading..."
        onClick={() => {}}
        isLoading
      />
    );
  }

  const nextThreshold = getNextThresholdIndex(
    aggregateForecastedGeneration,
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
      aggregateForecastedGeneration[index].datetime_utc
    ).diff(dayjs(), 'hours', true);

    let timeUnit = difference === 1 ? 'Hour' : 'Hours';

    // If we are under an hour, convert to minutes
    if (difference < 1) {
      difference = dayjs.duration(difference, 'hours').asMinutes();
      timeUnit = difference ? 'Minute' : 'Minutes';
    }

    value = `${Math.round(difference)} ${timeUnit}`;
    sunnyText = aboveThreshold ? 'Sunny in' : 'Sunny for';
  } else {
    value = timeFormat(aggregateForecastedGeneration[index].datetime_utc);
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
