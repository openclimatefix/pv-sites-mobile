// const siteUUID = 'b97f68cd-50e0-49bb-a850-108d4a9f7b7e';
import useSWR from 'swr';
import { Fetcher } from 'swr';
import { Site, SiteListProps } from '../types';
import { ForecastDataPoint } from '../types';

interface ForecastData {
  forecast_uuid: string;
  site_uuid: string;
  forecast_creation_datetime: number;
  forecast_version: string;
  forecast_values: ForecastDataPoint[];
}

interface UnparsedForecastData {
  forecast_uuid: string;
  site_uuid: string;
  forecast_creation_datetime: string | number;
  forecast_version: string;
  forecast_values: UnparsedForecastDataPoint[];
}

interface UnparsedForecastDataPoint {
  target_datetime_utc: string | number;
  expected_generation_kw: number;
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

const siteListFetcher: Fetcher<SiteListProps> = async (url: string) =>
  fetch(url).then((res) => res.json());

const useSiteData = (siteUUID: string) => {
  const {
    data: forecastData,
    error: forecastError,
    isLoading: isForecastLoading,
  } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sites/pv_forecast/${siteUUID}`,
    forecastFetcher
  );

  const {
    data: siteListData,
    error: siteListError,
    isLoading: isSiteListLoading,
  } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sites/site_list`,
    siteListFetcher
  );

  const error = AggregateError(forecastError, siteListError);
  const isLoading = isSiteListLoading || isForecastLoading;

  const siteData: Site | undefined = siteListData
    ? siteListData.site_list.find(site => site.site_uuid === siteUUID)
    : undefined;

  return { forecastData, ...siteData, error, isLoading };
};

export default useSiteData;
