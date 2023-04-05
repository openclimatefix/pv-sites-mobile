import { Fetcher } from 'swr';
import {
  ClearSkyData,
  ForecastData,
  UnparsedClearSkyData,
  UnparsedForecastData,
} from '../types';

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
  return new Date(datetime);
}

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
  const unparsedData: UnparsedForecastData = await fetch(url).then((res) =>
    res.json()
  );

  return parseForecastData(unparsedData);
};

export const manyForecastDataFetcher: Fetcher<Array<ForecastData>> = async (
  url: string
) => {
  const allUnparsedForecasts: Array<UnparsedForecastData> = await fetch(
    url
  ).then((res) => res.json());

  return allUnparsedForecasts.map((unparsedForecast) =>
    parseForecastData(unparsedForecast)
  );
};

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

export const clearSkyFetcher: Fetcher<ClearSkyData> = async (url: string) => {
  const unparsedData: UnparsedClearSkyData = await fetch(url).then((res) =>
    res.json()
  );

  return parseClearSkyData(unparsedData);
};
