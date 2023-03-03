import { FC } from 'react';
import useSWR from 'swr';
import NumberDisplay from './NumberDisplay';

interface ActualOutputEntry {
  datetime_utc: string;
  actual_generation_kw: number;
}

function GetCurrentOutput(actual_outputs: ActualOutputEntry[]) {
  var cur_time = Date.now();
  var time = new Date(actual_outputs[0].datetime_utc).getTime();
  var min = Math.abs(cur_time - time);
  var index = 0;
  for (var i = 1; i < actual_outputs.length; i++) {
    time = new Date(actual_outputs[i].datetime_utc).getTime();
    if (Math.abs(cur_time - time) < min) {
      min = cur_time - time;
      index = i;
    }
  }
  return actual_outputs[index].actual_generation_kw;
}

const siteUUID = 'b97f68cd-50e0-49bb-a850-108d4a9f7b7e';

const CurrentCapacity = () => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data: pv_actual, loading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sites/pv_actual/${siteUUID}`,
    fetcher
  );

  let cur_output = pv_actual
    ? GetCurrentOutput(pv_actual?.pv_actual_values)
    : null;

  const { data: site_list } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sites/site_list`,
    fetcher
  );
  let installed_capacity_kw = site_list?.site_list[0].installed_capacity_kw;

  return (
    <NumberDisplay
      title="Current Capacity"
      value={`${
        cur_output != null && installed_capacity_kw != null
          ? (cur_output / installed_capacity_kw)?.toFixed(0)
          : 'Loading'
      }%`}
    />
  );
};

export default CurrentCapacity;
