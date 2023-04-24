import { FC } from 'react';
import NumberDisplay from './NumberDisplay';
import { Site } from '~/lib/types';
import { useSiteAggregation, useSiteData } from '~/lib/sites';
import { getCurrentTimeGeneration } from '~/lib/generation';

interface CurrentOutputProps {
  sites: Site[];
}

const CurrentOutput: FC<CurrentOutputProps> = ({ sites }) => {
  const { totalForecastedGeneration, isLoading } = useSiteAggregation(sites);
  const currentOutput =
    totalForecastedGeneration &&
    getCurrentTimeGeneration(totalForecastedGeneration);

  function outputMessage(
    isLoading: boolean,
    currentOutput: number | undefined
  ) {
    if (isLoading) {
      return 'Loading...';
    } else if (currentOutput === undefined) {
      return 'N/A';
    } else {
      return currentOutput.toFixed(2);
    }
  }

  return (
    <NumberDisplay
      title="Current Output"
      value={`${outputMessage(isLoading, currentOutput)}`}
      isLoading={isLoading}
    />
  );
};

export default CurrentOutput;
