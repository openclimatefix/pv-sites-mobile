import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { LegendLineGraphIcon } from '@openclimatefix/nowcasting-ui.icons.icons';
import {
  formatter,
  useFutureGraphData,
  forecastDataOverDateRange,
} from 'lib/graphs';

const Graph = () => {
  const { data } = useFutureGraphData();

  let endDate = new Date();
  endDate.setHours(endDate.getHours() + 48);
  const graphData = data
    ? forecastDataOverDateRange(
        JSON.parse(JSON.stringify(data)),
        new Date(),
        endDate
      )
    : null;

  const MAX = data
    ? Math.max(...data.forecast_values.map((obj) => obj.expected_generation_kw))
    : 0;

  const tickArray = [0, MAX / 4, MAX / 2, (3 * MAX) / 4, MAX];

  return (
    <div className="my-2 w-full h-[260px] bg-ocf-gray-1000 rounded-2xl">
      <div className="flex ml-[9%] mt-[20px]  text-sm">
        <LegendLineGraphIcon className="text-ocf-yellow-500" />
        <p className="text-white ml-[5px] mt-[2px]">OCF Final Forecast</p>
      </div>

      <ResponsiveContainer className="mt-[30px]" width="100%" height={200}>
        <LineChart
          data={data?.forecast_values}
          margin={{
            top: 0,
            right: 10,
            left: -25,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" color="white" />
          <XAxis
            scale="band"
            fontSize="10px"
            dataKey="target_datetime_utc"
            stroke="white"
            axisLine={false}
            tickFormatter={(point: string) =>
              formatter.format(Date.parse(point))
            }
          />
          <YAxis
            tickCount={5}
            ticks={tickArray}
            domain={[0, MAX * 1.25]}
            interval={0}
            fontSize="10px"
            axisLine={false}
            stroke="white"
            tickFormatter={(val: number) => val.toFixed(2)}
          />
          <Tooltip
            contentStyle={{ backgroundColor: 'ocf-gray-1000', opacity: '.7' }}
            labelStyle={{ color: 'white' }}
            formatter={(value: number, name, props) => [
              parseFloat(value.toFixed(5)),
              'KW',
            ]}
            labelFormatter={(point: string) =>
              formatter.format(Date.parse(point))
            }
          />
          <Line
            type="monotone"
            dataKey="expected_generation_kw"
            stroke="#FFD053"
            dot={false}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Graph;
