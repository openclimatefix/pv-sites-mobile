import { Fetcher } from 'swr';
import {
  ActualData,
  ClearSkyData,
  ForecastData,
  Site,
  UnparsedActualData,
  UnparsedClearSkyData,
  UnparsedForecastData,
} from './types';
import { fetcher } from './swr';

/**
 * Parses a datetime string from the Nowcasting API, assumed to be in UTC.
 * The datetime string may or may not include a timezone indicator.
 * @param datetime The nowcasting datetime string
 * @returns The date object for the date
 */
export function parseNowcastingDatetime(datetime: string) {
  // if (!datetime.endsWith('Z')) {
  //   datetime += 'Z';
  // }
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

export const sitesFetcher: Fetcher<Site[]> = async (url: string) => {
  const { site_list } = await fetcher(url).then((res) => res.json());
  return site_list;
};
