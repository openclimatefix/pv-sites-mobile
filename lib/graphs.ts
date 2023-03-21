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

/**
 * @returns the index of the forecasted date that is closest to the target time
 */
export const getClosestForecastIndex = (
  forecastData: ForecastDataPoint[],
  targetDate: Date
) => {
  if (forecastData) {
    const closestDateIndex = forecastData
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

export const forecastDataOverDateRange = (
  forecastData: ForecastDataPoint[],
  start_date: Date,
  end_date: Date
) => {
  const start_index = getClosestForecastIndex(forecastData, start_date);
  const end_index = getClosestForecastIndex(forecastData, end_date);
  if (forecastData)
    forecastData = forecastData.slice(start_index, end_index + 1);
  return forecastData;
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

/* Represents the threshold for the graph */
export const graphThreshold = 0.7;
