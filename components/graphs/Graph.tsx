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

function getGraphStartDate(currentTime: number, totalHours: number) {
  const currentDate = new Date(currentTime);
  return new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate(),
    totalHours > 1
      ? currentDate.getHours() - totalHours / 8
      : currentDate.getHours(),
    totalHours > 1 ? 0 : currentDate.getMinutes() - 15
  );
}

function getGraphEndDate(currentTime: number, totalHours: number) {
  const currentDate = new Date(currentTime);
  return new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate(),
    totalHours > 1
      ? currentDate.getHours() + (7 * totalHours) / 8
      : currentDate.getHours(),
    totalHours > 1 ? 0 : currentDate.getMinutes() + 45
  );
}

const Graph: FC<{ siteUUID: string }> = ({ siteUUID }) => {
  const { forecastData, latitude, longitude, isLoading } =
    useSiteData(siteUUID);
  const [timeEnabled, setTimeEnabled] = useState(false);
  const { currentTime } = useTime(latitude, longitude, {
    updateEnabled: timeEnabled,
  });

  const [timeRange, setTimeRange] = useState('24');
  const handleChange = (event: any) => {
    setTimeRange(event.target.value);
  };

  const endDate = new Date();
  endDate.setHours(endDate.getHours() + 48);
  const graphData =
    forecastData &&
    forecastDataOverDateRange(
      forecastData.forecast_values,
      getGraphStartDate(currentTime, parseInt(timeRange)),
      getGraphEndDate(currentTime, parseInt(timeRange))
    );
  console.log(graphData);

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
    <div className="my-2 w-full h-[300px] bg-ocf-black-500 rounded-2xl">
      <div className="mt-4 ml-2">
        <label className="mx-2">
          <input
            className="hidden peer"
            type="radio"
            name="1H"
            id="1H"
            value="1"
            checked={timeRange === '1'}
            onChange={handleChange}
          />
          <span className="peer-checked:bg-ocf-yellow-500 peer-checked:rounded-md peer-checked:text-black text-ocf-gray-300 w-10 h-7 pt-0.5 text-center bg-ocf-gray-1000 rounded-md inline-block relative">
            1H
          </span>
        </label>
        <label className="mx-2">
          <input
            className="hidden peer"
            type="radio"
            name="1D"
            id="1D"
            value="24"
            checked={timeRange === '24'}
            onChange={handleChange}
          />
          <span className="peer-checked:bg-ocf-yellow-500 peer-checked:rounded-md peer-checked:text-black text-ocf-gray-300 w-10 h-7 pt-0.5 text-center bg-ocf-gray-1000 rounded-md inline-block relative">
            1D
          </span>
        </label>
        <label className="mx-2">
          <input
            className="hidden peer"
            type="radio"
            name="3D"
            id="3D"
            value="72"
            checked={timeRange === '72'}
            onChange={handleChange}
          />
          <span className="peer-checked:bg-ocf-yellow-500 peer-checked:rounded-md peer-checked:text-black text-ocf-gray-300 w-10 h-7 pt-0.5 text-center bg-ocf-gray-1000 rounded-md inline-block relative">
            3D
          </span>
        </label>
      </div>
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
              //scale="band"
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
