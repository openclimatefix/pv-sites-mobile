import { FC } from 'react';

import NumberDisplay from './NumberDisplay';

import { getNextThresholdIndex, graphThreshold } from 'lib/utils';

import { useSiteData } from 'lib/hooks';

const SunnyTimeframe: FC<{ siteUUID: string }> = ({ siteUUID }) => {
  const { forecastData } = useSiteData(siteUUID);

  if (!forecastData) {
    return null;
  }

  const nextThreshold = getNextThresholdIndex(
    forecastData.forecast_values,
    graphThreshold
  );

  let { aboveThreshold, number } = nextThreshold;
  let timeUnit = number === 1 ? 'Hour' : 'Hours';

  // If we are under an hour, round to minutes
  if (number < 1) {
    number = Math.round(number * 60);
    timeUnit = number === 1 ? 'Minute' : 'Minutes';
  }

  const sunnyText = aboveThreshold ? 'Sunny in' : 'Sunny for';

  return <NumberDisplay title={sunnyText} value={`${number} ${timeUnit}`} />;
};

export default SunnyTimeframe;
