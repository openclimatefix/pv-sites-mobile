import { Fetcher } from 'swr';
import { ForecastData, SiteList, UnparsedForecastData } from '../types';

export const siteListFetcher: Fetcher<SiteList> = async (url: string) =>
  fetch(url).then((res) => res.json());

export const forecastFetcher: Fetcher<ForecastData> = async (url: string) => {
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

export const manyForecastDataFetcher: Fetcher<Array<ForecastData>> = async (
  url: string
) => {
  const allUnparsedForecasts: Array<UnparsedForecastData> = await fetch(
    url
  ).then((res) => res.json());

  for (let idx = 0; idx < allUnparsedForecasts.length; idx++) {
    if (
      typeof allUnparsedForecasts[idx].forecast_creation_datetime === 'string'
    ) {
      allUnparsedForecasts[idx].forecast_creation_datetime = Date.parse(
        allUnparsedForecasts[idx].forecast_creation_datetime as string
      );
    } else {
      throw new Error('Data contains values with incompatible types');
    }

    allUnparsedForecasts[idx].forecast_values.map(({ target_datetime_utc }) => {
      if (typeof target_datetime_utc === 'string') {
        target_datetime_utc = Date.parse(target_datetime_utc);
      } else {
        throw new Error('Data contains values with incompatible types');
      }
    });
  }

  return allUnparsedForecasts as Array<ForecastData>;
};

export const clearskyFetcher: Fetcher<SiteList> = async (url: string) =>
  fetch(url).then((res) => res.json());