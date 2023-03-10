import useSWR, { Fetcher } from 'swr';
import { getArrayMaxOrMinAfterIndex, Value } from 'utils';

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

const siteUUID = 'b97f68cd-50e0-49bb-a850-108d4a9f7b7e'
//const siteUUID = '725a8670-d012-474d-b901-1179f43e7182';

export const useFutureGraphData = () =>
  useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL_GET}/sites/pv_forecast/${siteUUID}`,
    forecastFetcher
  );

export const getClosestForecastIndex = (forecastData : ForecastData, targetDate: Date) => {
    if (forecastData) {
      const closestDateIndex = forecastData.forecast_values
        .map((forecast_values, index) => ({ ...forecast_values, index: index }))
        .map((forecast_values) => ({
          ...forecast_values,
          difference: Math.abs(
            targetDate.getTime() -
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

export const forecastDataOverDateRange = (forecastData : ForecastData, start_date : Date, end_date : Date) => {
  console.log("start date ", formatter.format(start_date), "end date ", formatter.format(end_date));
  const start_index = getClosestForecastIndex(forecastData, start_date);
  console.log("closest start date", formatter.format(new Date(forecastData.forecast_values[start_index].target_datetime_utc)));
  const end_index = getClosestForecastIndex(forecastData, end_date);
  console.log("closest end date", formatter.format(new Date(forecastData.forecast_values[end_index].target_datetime_utc)));
  if (forecastData)
    forecastData.forecast_values = forecastData.forecast_values.slice(start_index, end_index + 1);
  return forecastData;
}
