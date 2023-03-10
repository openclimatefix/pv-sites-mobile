import { ForecastDataPoint } from './types';

/**
 * Turn a HTML element ID string (an-element-id) into camel case (anElementId)
 * @param id the HTML element id
 * @returns the id in camel case
 */
export function camelCaseID(id: string) {
  const [first, ...rest] = id.split('-');
  const capitalize = (part: string) =>
    part[0].toUpperCase() + part.substring(1);
  return [first, ...rest.map(capitalize)].join('');
}

/**
 * Converts Date object into Hour-Minute format based on device region
 */
export const formatter = new Intl.DateTimeFormat(['en-US', 'en-GB'], {
  hour: 'numeric',
  minute: 'numeric',
});

export enum Value {
  Min = 'Minimum',
  Max = 'Maximum',
}
interface MinMaxInterface {
  type: Value;
  number: number;
}

/**
 * Determines the next local minimum or maximum value in an array given a start index
 * @param array Array to search for a local minimum or maximum value
 * @param key The key that represents the values being compared in array
 * @param startIndex The index to start the search at
 * @returns The index of the next minimum or maximum value
 */
export const getArrayMaxOrMinAfterIndex = (
  array: Record<string, any>,
  key: string,
  startIndex: number
): MinMaxInterface | null => {
  if (startIndex === array.length - 1) {
    return {
      type: Value.Min,
      number: startIndex,
    };
  }

  startIndex += 1;

  while (startIndex < array.length) {
    const currentExpectedGenerationKW = array[startIndex][key];
    const previousExpectedGenerationKW = array[startIndex - 1][key];

    if (startIndex === array.length - 1) {
      if (currentExpectedGenerationKW > previousExpectedGenerationKW) {
        return {
          type: Value.Max,
          number: startIndex,
        };
      } else if (currentExpectedGenerationKW < previousExpectedGenerationKW) {
        return {
          type: Value.Min,
          number: startIndex,
        };
      }
    } else {
      const nextExpectedGenerationKW = array[startIndex + 1][key];

      if (
        currentExpectedGenerationKW > previousExpectedGenerationKW &&
        currentExpectedGenerationKW > nextExpectedGenerationKW
      ) {
        return {
          type: Value.Max,
          number: startIndex,
        };
      } else if (
        currentExpectedGenerationKW < previousExpectedGenerationKW &&
        currentExpectedGenerationKW < nextExpectedGenerationKW
      ) {
        return {
          type: Value.Min,
          number: startIndex,
        };
      }
    }
    startIndex += 1;
  }
  return null;
};

/**
 * @returns the index of the forecasted date that is closest to the current time
 */
export const getCurrentTimeForecastIndex = (
  forecast_values: ForecastDataPoint[]
) => {
  if (forecast_values) {
    const currentDate = new Date();

    const closestDateIndex = forecast_values
      .map((forecast_values, index) => ({ ...forecast_values, index: index }))
      .map((forecast_values) => ({
        ...forecast_values,
        difference: Math.abs(
          currentDate.getTime() -
            new Date(forecast_values.target_datetime_utc).getTime()
        ),
      }))
      .reduce((prev, curr) =>
        prev.difference < curr.difference ? prev : curr
      ).index;

    return closestDateIndex;
  }
  return 0;
};

export const getCurrentTimeForecast = (forecast_values: ForecastDataPoint[]) =>
  forecast_values[getCurrentTimeForecastIndex(forecast_values)]
    .expected_generation_kw;

/** Returns the difference in hours between two epoch times */
const findHourDifference = (date1: number, date2: number): number =>
  Math.abs(new Date(date1).getTime() - new Date(date2).getTime()) / 36e5;

interface NextThresholdInterface {
  aboveThreshold: boolean;
  number: number;
}

/**
 * Determines the hour difference between the current time and the next time we are above or below
 * the sunny threshold
 * @param forecast_values expected generated forecast values (kilowatts) at specific times
 * @param threshold sunny threshold in kilowatts
 * @returns Object containing hour difference between the next date and
 * if this date is above or below the threshold
 */
export const getNextThresholdIndex = (
  forecast_values: ForecastDataPoint[],
  threshold: number
): NextThresholdInterface => {
  let startIndex = getCurrentTimeForecastIndex(forecast_values);
  let currentIndex =
    startIndex + 1 < forecast_values.length ? startIndex + 1 : startIndex;

  const operator =
    forecast_values[currentIndex].expected_generation_kw >= threshold ? -1 : 1;

  const aboveThreshold =
    forecast_values[currentIndex].expected_generation_kw < threshold
      ? true
      : false;

  while (currentIndex < forecast_values.length) {
    const thresholdDifference =
      forecast_values[currentIndex].expected_generation_kw - threshold;
    if (operator * thresholdDifference > 0) {
      return {
        aboveThreshold,
        number: findHourDifference(
          forecast_values[currentIndex].target_datetime_utc,
          forecast_values[startIndex].target_datetime_utc
        ),
      };
    }
    currentIndex += 1;
  }
  return {
    aboveThreshold,
    number: findHourDifference(
      forecast_values[currentIndex - 1].target_datetime_utc,
      forecast_values[startIndex].target_datetime_utc
    ),
  };
};

/* Represents the threshold for the graph */
export const graphThreshold = 0.7;
