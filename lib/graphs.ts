import { addMinutes, millisecondsToMinutes } from 'date-fns';
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

export function addTimePoint(
  generationData: GenerationDataPoint[],
  date: Date
) {
  const generationDataInterpolated = generationData.map((data) => ({
    ...data,
  }));

  if (generationData.length < 2) {
    return generationDataInterpolated;
  }

  const forecastValuePeriod = millisecondsToMinutes(
    generationData[1].datetime_utc.getTime() -
      generationData[0].datetime_utc.getTime()
  );

  let forecastValueIndex = getClosestForecastIndex(generationData, date);
  let closestTime = generationData[forecastValueIndex].datetime_utc;
  if (closestTime.getTime() === date.getTime()) {
    return generationDataInterpolated;
  }

  if (closestTime.getTime() > date.getTime()) {
    forecastValueIndex--;
    closestTime = generationData[forecastValueIndex].datetime_utc;
  }

  const i = millisecondsToMinutes(date.getTime() - closestTime.getTime());

  const slope =
    generationData[forecastValueIndex + 1].generation_kw -
    generationData[forecastValueIndex].generation_kw;

  const interpolatedValue =
    slope * (i / forecastValuePeriod) +
    generationData[forecastValueIndex].generation_kw;

  const interpolatedTime = addMinutes(
    generationData[forecastValueIndex].datetime_utc,
    i
  );

  generationDataInterpolated.splice(forecastValueIndex + 1, 0, {
    generation_kw: interpolatedValue,
    datetime_utc: interpolatedTime,
  });

  return generationDataInterpolated;
}

/* Represents the threshold for the threshold graph, in kW  */
export const graphThreshold = 0.7;
