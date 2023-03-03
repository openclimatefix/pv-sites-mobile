import { FC } from 'react';
import useSWR from 'swr';
import NumberDisplay from './NumberDisplay';

interface ForecastedOutputEntry {
  target_datetime_utc: string;
  expected_generation_kw: number;
}

function GetCurrentOutput(forecasted_outputs: ForecastedOutputEntry[]) {
  var cur_time = Date.now();
  var time = new Date(forecasted_outputs[0].target_datetime_utc).getTime();
  var min = Math.abs(cur_time - time);
  var index = 0;
  for (var i = 1; i < forecasted_outputs.length; i++) {
    time = new Date(forecasted_outputs[i].target_datetime_utc).getTime();
    if (Math.abs(cur_time - time) < min) {
      min = cur_time - time;
      index = i;
    }
  }
  return forecasted_outputs[index].expected_generation_kw;
}

const siteUUID = 'b97f68cd-50e0-49bb-a850-108d4a9f7b7e';

const CurrentOutput = () => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data: pv_forecast, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sites/pv_forecast/${siteUUID}`,
    fetcher
  );
  let cur_output = pv_forecast
    ? GetCurrentOutput(pv_forecast?.forecast_values)
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