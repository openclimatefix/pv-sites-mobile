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
import { formatter, forecastDataOverDateRange } from 'lib/graphs';
import { useSiteData } from 'lib/hooks';
import useTime from '~/lib/hooks/useTime';
import { FC } from 'react';

const Graph: FC<{ siteUUID: string }> = ({ siteUUID }) => {
  const { forecastData, latitude, longitude } = useSiteData(siteUUID);
  const { currentTime } = useTime(latitude, longitude);

  const endDate = new Date();
  endDate.setHours(endDate.getHours() + 48);
  const graphData = forecastData
    ? forecastDataOverDateRange(
        JSON.parse(JSON.stringify(forecastData.forecast_values)),
        new Date(currentTime),
        endDate
      )
    : [];
  const maxGeneration = graphData
    ? Math.max(...graphData.map((value) => value.expected_generation_kw))
    : 0;

  const tickArray = [
    0,
    maxGeneration / 4,
    maxGeneration / 2,
    (3 * maxGeneration) / 4,
    maxGeneration,
  ];

  return (
    <div className="my-2 w-full h-[260px] bg-ocf-gray-1000 rounded-2xl">
      <div className="flex ml-[9%] mt-[20px]  text-sm">
        <LegendLineGraphIcon className="text-ocf-yellow-500" />
        <p className="text-white ml-[5px] mt-[2px]">OCF Final Forecast</p>
      </div>

      <ResponsiveContainer className="mt-[30px]" width="100%" height={200}>
        <LineChart
          data={graphData}
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
            domain={[0, maxGeneration * 1.25]}
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
