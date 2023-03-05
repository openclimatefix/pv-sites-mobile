import { start } from 'repl';
import useSWR, { Fetcher } from 'swr';

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

interface ForecastDataPoint {
  target_datetime_utc: number;
  expected_generation_kw: number;
}

interface ForecastData {
  forecast_uuid: string;
  site_uuid: string;
  forecast_creation_datetime: number;
  forecast_version: string;
  forecast_values: ForecastDataPoint[];
}

interface UnparsedForecastDataPoint {
  target_datetime_utc: string | number;
  expected_generation_kw: number;
}

interface UnparsedForecastData {
  forecast_uuid: string;
  site_uuid: string;
  forecast_creation_datetime: string | number;
  forecast_version: string;
  forecast_values: UnparsedForecastDataPoint[];
}

const forecastFetcher: Fetcher<ForecastData> = async (url: string) => {
  const tempData: UnparsedForecastData = await fetch(url).then((res) =>
    res.json()
  );

  if (typeof tempData.forecast_creation_datetime === 'string') {
    tempData.forecast_creation_datetime = Date.parse(
      tempData.forecast_creation_datetime
    );
  } else {
    throw new Error('Data contains values with incompatible types');
  }

  tempData.forecast_values.map(({ target_datetime_utc }) => {
    if (typeof target_datetime_utc === 'string') {
      target_datetime_utc = Date.parse(target_datetime_utc);
    } else {
      throw new Error('Data contains values with incompatible types');
    }
  });
  return tempData as ForecastData;
};

const siteUUID = 'b97f68cd-50e0-49bb-a850-108d4a9f7b7e';

export const useFutureGraphData = () =>
  useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sites/pv_forecast/${siteUUID}`,
    forecastFetcher
  );

export enum Value {
  Min = 'Minimum',
  Max = 'Maximum',
}
interface MinMaxInterface {
  type: Value;
  index: number;
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
      index: startIndex,
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
          index: startIndex,
        };
      } else if (currentExpectedGenerationKW < previousExpectedGenerationKW) {
        return {
          type: Value.Min,
          index: startIndex,
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
          index: startIndex,
        };
      } else if (
        currentExpectedGenerationKW < previousExpectedGenerationKW &&
        currentExpectedGenerationKW < nextExpectedGenerationKW
      ) {
        return {
          type: Value.Min,
          index: startIndex,
        };
      }
    }
    startIndex += 1;
  }
  return null;
};
