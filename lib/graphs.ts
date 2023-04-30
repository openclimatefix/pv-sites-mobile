import dayjs from 'dayjs';
import { GenerationDataPoint } from './types';
import {
  getClosestForecastIndex,
  getCurrentTimeGenerationIndex,
} from './generation';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';

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

export function makeGraphable(
  generationData: GenerationDataPoint[],
  restrictPeriod = false
) {
  return generationData
    .filter((point) =>
      restrictPeriod ? point.datetime_utc.getMinutes() % 15 === 0 : true
    )
    .map((point) => ({
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
  let closestTime = generationData[forecastValueIndex]?.datetime_utc;
  if (!closestTime || forecastValueIndex >= generationData.length - 1) {
    return generationDataInterpolated;
  }

  if (closestTime.getTime() === date.getTime()) {
    return generationDataInterpolated;
  }

  if (closestTime.getTime() > date.getTime()) {
    forecastValueIndex--;
    if (forecastValueIndex < 0) {
      return generationDataInterpolated;
    }

    closestTime = generationData[forecastValueIndex].datetime_utc;
  }

  const i = Math.floor(
    dayjs.duration(date.getTime() - closestTime.getTime()).asMinutes()
  );

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

/**
 * Determines the moving average, by calculating the averages for a given period in each array
 * @param array Array of GenerationDataPoints to determine the Simple moving averages for
 * @param period the length of each interval of the average, the length of the period must be odd or it will throw an exception
 * @returns a GenerationDataPoint array of Simple Moving Averages for each indexin O(n * p) time unfortunately
 */

export const SimpleMovingAverage = (
  array: GenerationDataPoint[],
  period: number
): GenerationDataPoint[] => {
  if (period % 2 == 0) {
    throw new Error('Period must be an odd number');
  } else if (period > array.length) {
    throw new Error('Period must be less than or equal to array size');
  }

  let averages: number[] = [];

  const upperBound = Math.floor(period / 2);

  for (let i = 0; i < array.length; i++) {
    const valsBefore = i;
    const valsAfter = array.length - i - 1;

    const range = Math.min(valsBefore, valsAfter, upperBound);
    let currSum = 0;
    for (let j = i - range; j < i + range + 1; j++) {
      currSum += array[j].generation_kw;
    }
    averages.push(currSum / (2 * range + 1));
  }

  let newPoints: GenerationDataPoint[] = [];
  for (let i = 0; i < averages.length; i++) {
    const point: GenerationDataPoint = {
      datetime_utc: array[i].datetime_utc,
      generation_kw: averages[i],
    };
    newPoints.push(point);
  }

  return newPoints;
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
