import { ClearSkyDataPoint } from './types';

/**
 * Converts Date object into Hour-Minute format based on device region
 */
export const timeFormatter = new Intl.DateTimeFormat(['en-US', 'en-GB'], {
  hour: 'numeric',
  minute: 'numeric',
});

interface ForecastDataPoint {
  target_datetime_utc: number;
  expected_generation_kw: number;
}

/**
 * @returns the index of the forecasted date that is the closest date to the
 * targetDate
 */
export const getClosestForecastIndex = (
  forecastData: Pick<ForecastDataPoint, 'target_datetime_utc'>[],
  targetDate: Date
) => {
  if (forecastData) {
    const closestIndex = forecastData
      .map((forecast_values, index) => ({ ...forecast_values, index: index }))
      .map((forecast_values) => ({
        ...forecast_values,
        difference: Math.abs(
          targetDate.getTime() - forecast_values.target_datetime_utc
        ),
      }))
      .reduce((prev, curr) =>
        prev.difference < curr.difference ? prev : curr
      );
    return closestIndex;
  }
  return 0;
};

export const outputDataOverDateRange = <
  T extends Pick<ForecastDataPoint, 'target_datetime_utc'>
>(
  forecastData: T[],
  start_date: Date,
  end_date: Date
) => {
  const start_index = getClosestForecastIndex(forecastData, start_date);
  const end_index = getClosestForecastIndex(forecastData, end_date);
  if (forecastData)
    forecastData = forecastData.slice(start_index, end_index + 1);
  return forecastData;
};

export const getGraphStartDate = (currentTime: number) => {
  const currentDate = new Date(currentTime);
  return new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getHours() > 20
      ? currentDate.getDate() + 1
      : currentDate.getDate(),
    8
  );
};

export const getGraphEndDate = (currentTime: number) => {
  const currentDate = new Date(currentTime);
  return new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getHours() > 20
      ? currentDate.getDate() + 1
      : currentDate.getDate(),
    20
  );
};

/**
 * @returns the index of the forecasted date that is closest to the current time
 */
export const getCurrentTimeForecastIndex = (
  forecast_values: ForecastDataPoint[]
) => {
  return getClosestForecastIndex(forecast_values, new Date());
};

/* Represents the threshold for the graph */
export const graphThreshold = 0.7;
