import { FC } from 'react';
import useSWR from 'swr';
import NumberDisplay from './NumberDisplay';
import { getClosestForecastIndex } from 'lib/graphs';

const siteUUID = '725a8670-d012-474d-b901-1179f43e7182';

const CurrentCapacity = () => {
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

  const { data: site_list } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL_GET}/sites/site_list`,
    fetcher
  );
  let installed_capacity_kw = site_list?.site_list[0].installed_capacity_kw;

  return (
    <NumberDisplay
      title="Current Capacity"
      value={`${
        isLoading
          ? 'Loading...'
          : cur_output != null &&
            installed_capacity_kw != null &&
            installed_capacity_kw != 0
          ? ((100 * cur_output) / installed_capacity_kw).toFixed(2) + '%'
          : 'N/A'
      }`}
    />
  );
};

export default CurrentCapacity;
