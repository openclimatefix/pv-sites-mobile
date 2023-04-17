import dayjs from 'dayjs';
import { GenerationDataPoint } from './types';
import {
  getClosestForecastIndex,
  getCurrentTimeGenerationIndex,
} from './generation';

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

  const forecastValuePeriod = dayjs
    .duration(
      generationData[1].datetime_utc.getTime() -
        generationData[0].datetime_utc.getTime()
    )
    .asMinutes();

  let forecastValueIndex = getClosestForecastIndex(generationData, date);
  let closestTime = generationData[forecastValueIndex].datetime_utc;
  if (closestTime.getTime() === date.getTime()) {
    return generationDataInterpolated;
  }

  if (closestTime.getTime() > date.getTime()) {
    forecastValueIndex--;
    closestTime = generationData[forecastValueIndex].datetime_utc;
  }

  const i = dayjs.duration(date.getTime() - closestTime.getTime()).asMinutes();

  const slope =
    generationData[forecastValueIndex + 1].generation_kw -
    generationData[forecastValueIndex].generation_kw;

  const interpolatedValue =
    slope * (i / forecastValuePeriod) +
    generationData[forecastValueIndex].generation_kw;

  const interpolatedTime = dayjs(
    generationData[forecastValueIndex].datetime_utc
  ).add(i, 'minute');

  generationDataInterpolated.splice(forecastValueIndex + 1, 0, {
    generation_kw: interpolatedValue,
    datetime_utc: interpolatedTime.toDate(),
  });

  return generationDataInterpolated;
}

interface SlopeInterface {
  type: 'increasing' | 'decreasing' | 'constant';
  endIndex: number;
}

/**
 * Determines the next local minimum or maximum value in a generation array
 * @param array Array to search for a local minimum or maximum value
 * @param key The key that represents the values being compared in array
 * @param startIndex The index to start the search at
 * @returns The index of the next minimum or maximum value
 */
export const getTrendAfterIndex = (
  array: GenerationDataPoint[],
  startIndex: number
): SlopeInterface | null => {
  if (startIndex === array.length - 1) {
    return {
      type: 'constant',
      endIndex: startIndex,
    };
  }

  const first = array[startIndex].generation_kw;
  const second = array[startIndex + 1].generation_kw;

  const firstDifference = second - first;
  const firstSlopeSign = Math.sign(firstDifference);

  startIndex += 1;

  while (startIndex < array.length - 1) {
    const prev = array[startIndex - 1].generation_kw;
    const curr = array[startIndex].generation_kw;

    const currentDifference = curr - prev;
    const currentSlopeSign = Math.sign(currentDifference);

    if (firstSlopeSign !== currentSlopeSign && currentSlopeSign !== 0) {
      // Slope was constant until current index
      if (firstSlopeSign === 0) {
        return { type: 'constant', endIndex: startIndex };
      }

      // Slope was negative or positive until current index
      return {
        type: firstSlopeSign < currentSlopeSign ? 'decreasing' : 'increasing',
        endIndex: startIndex,
      };
    }

    startIndex += 1;
  }

  return {
    type: firstSlopeSign < 0 ? 'decreasing' : 'increasing',
    endIndex: startIndex,
  };
};

interface NextThreshold {
  aboveThreshold: boolean;
  index: number;
}

/**
 * Determines the hour difference between the current time and the next time we are above or below
 * the sunny threshold
 * @param generationData expected generation data (kilowatts) at specific times
 * @param threshold sunny threshold in kilowatts
 * @returns Object containing hour difference between the next date and
 * if this date is above or below the threshold
 */
export const getNextThresholdIndex = (
  generationData: GenerationDataPoint[],
  threshold: number
): NextThreshold | null => {
  const startIndex = getCurrentTimeGenerationIndex(generationData);

  const currentAboveThreshold =
    generationData[startIndex].generation_kw >= threshold;

  for (let i = startIndex; i < generationData.length; i++) {
    const futureAboveThreshold = generationData[i].generation_kw >= threshold;
    // If this future point's "aboveThreshold" state is different than current
    if (futureAboveThreshold !== currentAboveThreshold) {
      return {
        aboveThreshold: futureAboveThreshold,
        index: i,
      };
    }
  }

  return null;
};

/* Represents the threshold for the threshold graph, as a proportion of installed-capacity-kw */
export const graphThreshold = 0.1;
