import NumberDisplay from '../components/NumberDisplay';
import Warnings from '../components/Warnings';
import Graph from '../components/Graph';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import useSWR from 'swr';

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

const Dashboard = () => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data: pv_actual } = useSWR(
    '/api/sites/pv_actual/b97f68cd-50e0-49bb-a850-108d4a9f7b7e',
    fetcher
  );

  let cur_output = pv_actual
    ? GetCurrentOutput(pv_actual?.pv_actual_values)
    : null;

  const { data: site_list } = useSWR('/api/sites/site_list', fetcher);
  let installed_capacity_kw = site_list?.site_list[0].installed_capacity_kw;

  return (
    <div className="bg-ocf-black w-screen h-screen px-4">
      <h1 className="mt-4 text-ocf-gray text-3xl font-bold">Dashboard</h1>
      <div className="flex flex-row w-full justify-start">
        <Warnings />
      </div>
      <div className="flex flex-row w-full justify-start">
        <NumberDisplay title="Today's Expected Output" value="2700kW" />
      </div>
      <div className="flex flex-row w-full justify-center space-x-4">
        <NumberDisplay
          title="Current Output"
          value={`${cur_output != null ? cur_output.toFixed(0) : 'Loading'} kW`}
        />
        <NumberDisplay
          title="Current Capacity"
          value={`${
            cur_output != null && installed_capacity_kw != null
              ? (cur_output / installed_capacity_kw)?.toFixed(0)
              : 'Loading'
          }%`}
        />
      </div>
      <div className="flex flex-row w-full justify-start">
        <Graph />
      </div>
    </div>
  );
};

export default Dashboard;
export const getServerSideProps = withPageAuthRequired();
