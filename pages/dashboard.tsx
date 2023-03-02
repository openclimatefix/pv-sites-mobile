import NumberDisplay from '../components/NumberDisplay';
import Warnings from '../components/Warnings';
import Graph from '../components/Graph';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import useSWR from 'swr';

function GetCurrentOutput(pv_actual) {
  var cur_time = Date.now();
  var time = new Date(pv_actual[0].datetime_utc).getTime();
  var min = Math.abs(cur_time - time);
  var index = 0;
  for (var i = 1; i < pv_actual.length; i++) {
    time = new Date(pv_actual[i].datetime_utc).getTime();
    if (Math.abs(cur_time - time) < min) {
      min = cur_time - time;
      index = i;
    }
  }
  return pv_actual[index].actual_generation_kw;
}

const Dashboard = () => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data: pv_actual } = useSWR(
    '/api/sites/pv_actual/b97f68cd-50e0-49bb-a850-108d4a9f7b7e',
    fetcher
  );
  // let cur_time = '2023-02-15T23:30:00+00:00';
  // let cur_output = pv_actual?.pv_actual_values.filter(
  //   (item: { datetime_utc: string; actual_generation_kw: number }) => {
  //     return item.datetime_utc == cur_time;
  //   }
  // )[0].actual_generation_kw;

  const { data: site_list } = useSWR('/api/sites/site_list', fetcher);
  //console.log(site_list.site_list[0].installed_capacity_kw);
  let installed_capacity_kw = site_list?.site_list[0].installed_capacity_kw;

  let cur_output = GetCurrentOutput(pv_actual?.pv_actual_values);

  return (
    <div className="bg-black w-screen h-screen px-4">
      <h1 className="mt-24 text-ocf-gray text-3xl font-bold">Dashboard</h1>
      <div className="flex flex-row w-full justify-start">
        <Warnings />
      </div>
      <div className="flex flex-row w-full justify-start">
        <NumberDisplay title="Today's Expected Output" value="2700kW" />
      </div>
      <div className="flex flex-row w-full justify-center space-x-4">
        <NumberDisplay title="Current Output" value={`${cur_output} kW`} />
        <NumberDisplay
          title="Current Capacity"
          value={`${cur_output / installed_capacity_kw}%`}
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
