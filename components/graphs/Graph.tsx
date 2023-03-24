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
import { formatter } from 'lib/utils';
import { useSiteData } from 'lib/hooks';
import { FC } from 'react';
import { ClearSkyDataPoint } from '~/lib/types';

const Graph: FC<{ siteUUID: string }> = ({ siteUUID }) => {
  const { forecastData, clearskyData } = useSiteData(siteUUID);

  const maxGeneration = forecastData
    ? Math.max(
        ...forecastData.forecast_values.map(
          (value) => value.expected_generation_kw
        )
      )
    : 0;

  const clearSkyEstimateTrimmed = clearskyData?.clearsky_estimate.filter(
    (clearSkyDataPoint: ClearSkyDataPoint) => {
      return (
        (forecastData?.forecast_values[0]?.target_datetime_utc ?? 0) <=
          clearSkyDataPoint.target_datetime_utc &&
        (forecastData?.forecast_values[forecastData.forecast_values.length - 1]
          ?.target_datetime_utc ?? 0) >= clearSkyDataPoint.target_datetime_utc
      );
    }
  );

  const tickArray = [
    0,
    maxGeneration / 4,
    maxGeneration / 2,
    (3 * maxGeneration) / 4,
    maxGeneration,
  ];

  return (
    <div className="my-2 w-full h-[260px] bg-ocf-gray-1000 rounded-2xl">
      <div className="flex ml-[9%] mt-[20px]  text-sm gap-3 ">
        <div className="flex">
          <LegendLineGraphIcon className="text-ocf-yellow-500" />
          <p className="text-white ml-[5px] mt-[2px]">OCF Final Forecast</p>
        </div>
        <div className="flex">
          <LegendLineGraphIcon className="text-ocf-blue" />
          <p className="text-white ml-[5px] mt-[2px]">Clear Sky</p>
        </div>
      </div>

      <ResponsiveContainer className="mt-[30px]" width="100%" height={200}>
        <LineChart
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
            allowDuplicatedCategory={false}
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
            data={clearSkyEstimateTrimmed}
            type="monotone"
            dataKey="clearsky_generation_kw"
            stroke="#00B4FF"
            dot={false}
            activeDot={{ r: 8 }}
          />
          <Line
            data={forecastData?.forecast_values}
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
