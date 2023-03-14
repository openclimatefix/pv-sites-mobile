import { FC } from 'react';
import useSWR from 'swr';
import NumberDisplay from './NumberDisplay';
import { getClosestForecastIndex } from 'lib/graphs';

const siteUUID = '725a8670-d012-474d-b901-1179f43e7182';

const CurrentOutput = () => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data: pv_forecast, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL_GET}/sites/pv_forecast/${siteUUID}`,
    fetcher
  );
  let cur_output = pv_forecast
    ? pv_forecast.forecast_values[
        getClosestForecastIndex(pv_forecast, new Date())
      ].expected_generation_kw
    : null;

  return (
    <NumberDisplay
      title="Current Output"
      value={`${
        isLoading
          ? 'Loading...'
          : cur_output != null
          ? cur_output.toFixed(2) + ' kW'
          : 'N/A'
      }`}
    />
  );
};

export default CurrentOutput;
