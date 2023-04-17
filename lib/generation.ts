import { GenerationDataPoint } from './types';

export const getCurrentTimeGeneration = (
  generationData: GenerationDataPoint[]
) =>
  generationData[getCurrentTimeGenerationIndex(generationData)].generation_kw;

/**
 * @returns the index of the forecasted date that is closest to the current time
 */
export function getCurrentTimeGenerationIndex(
  generationData: GenerationDataPoint[]
) {
  return getClosestForecastIndex(generationData, new Date());
}

/**
 * @returns the index of the forecasted date that is closest to the target time
 */
export function getClosestForecastIndex(
  generationData: GenerationDataPoint[],
  targetDate: Date
) {
  let closest = 0;

  for (let i = 0; i < generationData.length; i++) {
    const difference = Math.abs(
      targetDate.getTime() - generationData[i].datetime_utc.getTime()
    );
    const closestDifference = Math.abs(
      targetDate.getTime() - generationData[closest].datetime_utc.getTime()
    );
    if (difference < closestDifference) {
      closest = i;
    }
  }

  return closest;
}

export const generationDataOverDateRange = (
  generationData: GenerationDataPoint[],
  startDate: Date,
  endDate: Date
) => {
  const startIndex = getClosestForecastIndex(generationData, startDate);
  const endIndex = getClosestForecastIndex(generationData, endDate);
  return generationData.slice(startIndex, endIndex + 1);
};
