import dayjs from 'dayjs';
import { Fetcher } from 'swr';
import { fetcher, getAuthenticatedRequestOptions } from './swr';
import {
  ActualData,
  ClearSkyData,
  ForecastData,
  UnparsedActualData,
  UnparsedClearSkyData,
  UnparsedForecastData,
} from './types';

/**
 * Parses a datetime string from the Nowcasting API, assumed to be in UTC.
 * The datetime string may or may not include a timezone indicator.
 * @param datetime The nowcasting datetime string
 * @returns The date object for the date
 */
export function parseNowcastingDatetime(datetime: string) {
  if (!datetime.endsWith('Z')) {
    datetime += 'Z';
  }
  // TODO REVERT ALL THIS
  return dayjs(new Date(datetime)).tz('America/Chicago', true).toDate();
}

/**
 * Transforms unparsed forecast data into a parsed form, with timestamps as dates
 * and consistent property names
 * @param unparsedForecastData the unparsed forecast data from the API
 * @returns the parsed forecast data
 */
function parseForecastData(
  unparsedForecastData: UnparsedForecastData
): ForecastData {
  const forecast_creation_datetime = parseNowcastingDatetime(
    unparsedForecastData.forecast_creation_datetime
  );

  const forecast_values: ForecastData['forecast_values'] =
    unparsedForecastData.forecast_values.map((forecastValue) => {
      return {
        generation_kw: forecastValue.expected_generation_kw,
        datetime_utc: parseNowcastingDatetime(
          forecastValue.target_datetime_utc
        ),
      };
    });

  return {
    ...unparsedForecastData,
    forecast_creation_datetime,
    forecast_values,
  };
}

export const forecastFetcher: Fetcher<ForecastData> = async (url: string) => {
  const unparsedData: UnparsedForecastData = await fetcher(url);

  return parseForecastData(unparsedData);
};

export const manyForecastDataFetcher: Fetcher<Array<ForecastData>> = async (
  url: string
) => {
  const allUnparsedForecasts: Array<UnparsedForecastData> = await fetcher(url);

  return allUnparsedForecasts.map((unparsedForecast) =>
    parseForecastData(unparsedForecast)
  );
};

/**
 * Transforms unparsed actual data into a parsed form, with timestamps as dates
 * and consistent property names
 * @param unparsedActualData the unparsed actual data from the API
 * @returns the parsed actual data
 */
function parseActualData(unparsedActualData: UnparsedActualData): ActualData {
  const pv_actual_values: ActualData['pv_actual_values'] =
    unparsedActualData.pv_actual_values.map((actual_datapoint) => {
      return {
        generation_kw: actual_datapoint.actual_generation_kw,
        datetime_utc: parseNowcastingDatetime(actual_datapoint.datetime_utc),
      };
    });

  return {
    ...unparsedActualData,
    pv_actual_values,
  };
}

export const manyActualsFetcher: Fetcher<Array<ActualData>> = async (
  url: string
) => {
  const allUnparsedActuals: Array<UnparsedActualData> = await fetcher(url);

  return allUnparsedActuals.map((unparsedActualData) =>
    parseActualData(unparsedActualData)
  );
};

export const actualsFetcher: Fetcher<ActualData> = async (url: string) => {
  const unparsedData: UnparsedActualData = await fetcher(url);
  return parseActualData(unparsedData);
};

/**
 * Transforms unparsed clear sky data into a parsed form, with timestamps as dates
 * and consistent property names
 * @param unparsedClearSkyData the unparsed clear sky data from the API
 * @returns the parsed clear sky data
 */
function parseClearSkyData(
  unparsedClearSkyData: UnparsedClearSkyData
): ClearSkyData {
  const clearsky_estimate: ClearSkyData['clearsky_estimate'] =
    unparsedClearSkyData.clearsky_estimate.map((clearsky_estimate) => {
      return {
        generation_kw: clearsky_estimate.clearsky_generation_kw,
        datetime_utc: parseNowcastingDatetime(
          clearsky_estimate.target_datetime_utc
        ),
      };
    });

  return {
    ...unparsedClearSkyData,
    clearsky_estimate,
  };
}

export const manyClearskyDataFetcher: Fetcher<Array<ClearSkyData>> = async (
  url: string
) => {
  const allUnparsedClearsSky: Array<UnparsedClearSkyData> = await fetcher(url);

  return allUnparsedClearsSky.map((unparsedClearSkyData) =>
    parseClearSkyData(unparsedClearSkyData)
  );
};

export const clearSkyFetcher: Fetcher<ClearSkyData> = async (url: string) => {
  const unparsedData: UnparsedClearSkyData = await fetcher(url);

  return parseClearSkyData(unparsedData);
};

/**
 * Acquire a function that sends a mutation request to the API, following SWR's mutation scheme
 * @param method the request method
 * @returns the SWR mutation function
 */
export const sendMutation =
  (method: string) =>
  async (url: string, { arg }: { arg: any }) => {
    const options = await getAuthenticatedRequestOptions(url);
    return fetch(url, {
      method: method,
      body: JSON.stringify(arg),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  };

/**
 * Acquires an Enode Link URL from the API
 * @param siteUUID the site identifier for the current site in the form
 * @returns the Enode link URL
 */
export const getEnodeLinkURL = async (siteUUID: string) => {
  const res = await fetcher(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL_GET
    }/enode/link?${new URLSearchParams({
      redirect_uri: encodeURIComponent(
        `${process.env.NEXT_PUBLIC_BASE_URL}/inverters/${siteUUID}`
      ),
    })}`
  );
  return res as string;
};
