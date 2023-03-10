import { FC } from 'react';

import {
  useFutureGraphData,
  getNextThresholdIndex,
  graphThreshold,
  Value,
} from 'lib/utils';

const SunnyTimeframe: FC = () => {
  const { data } = useFutureGraphData();
  const nextThreshold = getNextThresholdIndex(
    data?.forecast_values,
    graphThreshold
  );

  if (nextThreshold) {
    let { type, number } = nextThreshold;
    let timeUnit = number === 1 ? 'Hour' : 'Hours';

    // If we are under an hour, round to minutes
    if (number < 1) {
      number = Math.round(number * 60);
      timeUnit = number === 1 ? 'Minute' : 'Minutes';
    }

    const sunnyText = type === Value.Max ? 'Sunny for' : 'Sunny in';

    return (
      <div className="flex-1 my-2 p-4 text-center bg-ocf-gray-1000 rounded-2xl">
        <div className="mb-2 text-xs text-ocf-gray font-semibold">
          {sunnyText}
        </div>
        <div className="mb-1 text-2xl text-ocf-yellow font-semibold">
          {number} {timeUnit}
        </div>
      </div>
    );
  }

  return null;
};

export default SunnyTimeframe;
