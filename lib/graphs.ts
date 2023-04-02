import { GenerationDataPoint } from './types';

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

export const getGraphStartDate = (currentTime: number) => {
  const currentDate = new Date(currentTime);
  return new Date(
    Date.UTC(
      currentDate.getUTCFullYear(),
      currentDate.getUTCMonth(),
      currentDate.getUTCHours() > 20
        ? currentDate.getUTCDate() + 1
        : currentDate.getUTCDate(),
      8
    )
  );
};

export const getGraphEndDate = (currentTime: number) => {
  const currentDate = new Date(currentTime);
  return new Date(
    Date.UTC(
      currentDate.getUTCFullYear(),
      currentDate.getUTCMonth(),
      currentDate.getUTCHours() > 20
        ? currentDate.getUTCDate() + 1
        : currentDate.getUTCDate(),
      20
    )
  );
};

/**
 * @returns the index of the forecasted date that is closest to the current time
 */
export function getCurrentTimeGenerationIndex(
  generationData: GenerationDataPoint[]
) {
  return getClosestForecastIndex(generationData, new Date());
}

export function makeGraphable(generationData: GenerationDataPoint[]) {
  return generationData.map((point) => ({
    ...point,
    datetime_utc: point.datetime_utc.getTime(),
  }));
}

/* Represents the threshold for the threshold graph, in kW  */
export const graphThreshold = 0.7;
