import { Fetcher } from 'swr';
import { ForecastData, UnparsedForecastData } from '../types';

/**
 * Parses a datetime string from the Nowcasting API, assumed to be in UTC.
 * The datetime string may or may not include a timezone indicator.
 * @param datetime The nowcasting datetime string
 * @returns The datetime's UNIX timestamp
 */
export function parseNowcastingDatetime(datetime: string) {
  if (!datetime.endsWith('Z')) {
    datetime += 'Z';
  }
  return Date.parse(datetime);
}

function parseForecastData(
  unparsedForecastData: UnparsedForecastData
): ForecastData {
  const forecast_creation_datetime = parseNowcastingDatetime(
    unparsedForecastData.forecast_creation_datetime
  );

  const forecast_values = unparsedForecastData.forecast_values.map(
    (forecastValue) => {
      return {
        ...forecastValue,
        target_datetime_utc: parseNowcastingDatetime(
          forecastValue.target_datetime_utc
        ),
      };
    }
  );

  return {
    ...unparsedForecastData,
    forecast_creation_datetime,
    forecast_values,
  };
}

export const forecastFetcher: Fetcher<ForecastData> = async (url: string) => {
  const tempData: UnparsedForecastData = await fetch(url).then((res) =>
    res.json()
  );

  return parseForecastData(tempData);
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
