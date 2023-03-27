import { LegendLineGraphIcon } from '@openclimatefix/nowcasting-ui.icons.icons';
import {
  forecastDataOverDateRange,
  formatter,
  getCurrentTimeForecastIndex,
} from 'lib/graphs';
import { useSiteData } from 'lib/hooks';
import { FC, useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import useTime from '~/lib/hooks/useTime';
import { ForecastDataPoint } from '~/lib/types';

function getGraphStartDate(currentTime: number) {
  const currentDate = new Date(currentTime);
  return new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate(),
    currentDate.getHours() - 5
  );
}

const Graph: FC<{ siteUUID: string }> = ({ siteUUID }) => {
  const { forecastData, latitude, longitude, isLoading } =
    useSiteData(siteUUID);
  const [timeEnabled, setTimeEnabled] = useState(false);
  const { currentTime } = useTime(latitude, longitude, {
    enabled: timeEnabled,
  });

  const endDate = new Date();
  endDate.setHours(endDate.getHours() + 48);
  const graphData =
    forecastData &&
    forecastDataOverDateRange(
      forecastData.forecast_values,
      getGraphStartDate(currentTime),
      endDate
    );
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

  const renderLabel = ({ viewBox: { x }, height }: any) => {
    const yy = height * 0.75 + 5;
    const textProps = {
      className: 'text-xs fill-ocf-gray-1000',
      textAnchor: 'middle',
      x: x + 1,
      y: yy + 10,
    };
    return (
      <g>
        <g className="fill-white">
          <text stroke="white" strokeWidth="1em" {...textProps}>
            {/* Use invisible "H" character with stroke width to create white background around text */}
            {'H'.repeat('Now'.length)}
          </text>
          <text {...textProps}>Now</text>
        </g>
      </g>
    );
  };

  return (
    <div className="my-2 w-full h-[260px] bg-ocf-black-500 rounded-2xl">
      <div className="flex ml-[9%] mt-[20px]  text-sm">
        <LegendLineGraphIcon className="text-ocf-yellow-500" />
        <p className="text-white ml-[5px] mt-[2px]">OCF Final Forecast</p>
      </div>

      {!isLoading && (
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
              tickFormatter={(
                point: ForecastDataPoint['target_datetime_utc']
              ) => formatter.format(new Date(point))}
            />
            <YAxis
              tickCount={5}
              ticks={tickArray}
              domain={[0, maxGeneration * 1.25]}
              interval={0}
              fontSize="10px"
              axisLine={false}
              stroke="white"
              tickFormatter={(
                val: ForecastDataPoint['expected_generation_kw']
              ) => val.toFixed(2)}
            />
            <Tooltip
              wrapperStyle={{ outline: 'none' }}
              contentStyle={{ backgroundColor: '#2B2B2B90', opacity: 1 }}
              labelStyle={{ color: 'white' }}
              formatter={(
                value: ForecastDataPoint['expected_generation_kw']
              ) => [parseFloat(value.toFixed(5)), 'kW']}
              labelFormatter={(
                point: ForecastDataPoint['target_datetime_utc']
              ) => formatter.format(new Date(point))}
            />
            <Line
              type="monotone"
              dataKey="expected_generation_kw"
              stroke="#FFD053"
              dot={false}
              activeDot={{ r: 8 }}
              onAnimationEnd={() => setTimeEnabled(true)}
            />
            <ReferenceLine
              x={
                graphData
                  ? graphData[getCurrentTimeForecastIndex(graphData)]
                      .target_datetime_utc
                  : 0
              }
              strokeWidth={1}
              stroke="white"
              label={(props) => renderLabel({ ...props, height: 200 })}
            ></ReferenceLine>
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default Graph;
