import { FC } from 'react';

import NumberDisplay from './NumberDisplay';

import {
  useFutureGraphData,
  getNextThresholdIndex,
  graphThreshold,
} from 'lib/utils';

const SunnyTimeframe: FC = () => {
  const { data } = useFutureGraphData();

  if (!data) {
    return null;
  }

  const nextThreshold = getNextThresholdIndex(
    data.forecast_values,
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
