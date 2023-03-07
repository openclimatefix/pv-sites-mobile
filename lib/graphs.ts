import useSWR, { Fetcher } from 'swr';

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
  