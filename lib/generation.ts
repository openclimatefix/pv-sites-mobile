import { GenerationDataPoint } from './types';

/**
 * Gets the current output given some generation data, or undefined if
 * the generation data doesn't contain the current time
 * @param generationData the generation data
 * @returns the current output or undefined
 */
export const getCurrentTimeGeneration = (
  generationData: GenerationDataPoint[]
) =>
  generationData[getCurrentTimeGenerationIndex(generationData)]?.generation_kw;

/**
 * @param generationData the generation data
 * @returns the index of the forecasted date that is closest to the current time
 */
export function getCurrentTimeGenerationIndex(
  generationData: GenerationDataPoint[]
) {
  return getClosestForecastIndex(generationData, new Date());
}

/**
 * Gets the forecast data object for the target datetime
 * @param generationData the generation data
 * @param targetDate the target data
 * @returns the index of the forecasted date that is closest to the target time
 */
export function getClosestForecastIndex(
  generationData: GenerationDataPoint[],
  targetDate: Date
) {
  if (generationData.length === 0) {
    return -1;
  }

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

/**
 * Restricts the generation data to a specific time range, and assumes the generation data
 * is currently ordered by time already
 * @param generationData the generation data
 * @param startDate the start date
 * @param endDate the end date
 * @returns the restricted generation data
 */
export const generationDataOverDateRange = (
  generationData: GenerationDataPoint[],
  startDate: Date,
  endDate: Date
) => {
  const startIndex = getClosestForecastIndex(generationData, startDate);
  const endIndex = getClosestForecastIndex(generationData, endDate);
  return generationData.slice(startIndex, endIndex + 1);
};

/**
 * Gets the "total expected output", or energy for a certain set of generation data points
 * @param points the generation data
 * @returns the total expected output
 */
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
