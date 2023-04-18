import { LegendLineGraphIcon } from '@openclimatefix/nowcasting-ui.icons.icons';
import { setMilliseconds, setSeconds } from 'date-fns';
import {
  addTimePoint,
  generationDataOverDateRange,
  makeGraphable,
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
import useDateFormatter from '~/lib/hooks/useDateFormatter';
import useSiteAggregation from '~/lib/hooks/useSiteAggregation';
import useTime from '~/lib/hooks/useTime';
import { GenerationDataPoint } from '~/lib/types';

function getGraphStartDate(currentTime: number, totalHours: number) {
  const currentDate = new Date(currentTime);
  return new Date(
    Date.UTC(
      currentDate.getUTCFullYear(),
      currentDate.getUTCMonth(),
      currentDate.getUTCDate(),
      totalHours > 1
        ? currentDate.getUTCHours() - totalHours / 8 //ensures Now indicator is ~1/8 of the way through the graph for 1D and 2D
        : currentDate.getUTCHours(),
      totalHours > 1 ? 0 : currentDate.getUTCMinutes() - 15 //ensures Now indicator is ~1/8 of the way through the graph for 1H
    )
  );
}

function getGraphEndDate(currentTime: number, totalHours: number) {
  const currentDate = new Date(currentTime);
  return new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate(),
    totalHours > 1
      ? currentDate.getHours() + (7 * totalHours) / 8 //ensures end time is 1D or 2D after start time
      : currentDate.getHours(),
    totalHours > 1 ? 0 : currentDate.getMinutes() + 45 //ensures end time is 1H after start time
  );
}

function getXTickValues(times: number[], numTicks: number) {
  const tickValues: any[] = [];
  const dataLength = times.length;

  if (dataLength === 0) {
    return tickValues;
  }

  const tickStep = Math.floor(dataLength / (numTicks - 1));

  for (let i = 0; i < numTicks; i++) {
    const index = Math.min(i * tickStep, dataLength - 1);
    const tickValue = times[index];
    tickValues.push(tickValue);
  }

  return tickValues;
}

const Graph: FC<{ siteUUIDs: string[] }> = ({ siteUUIDs }) => {
  // TODO: we want a aggregate form of the clearskyData variable
  const { latitude, longitude } = useSiteData(siteUUIDs[0]);

  const { totalForecastedGeneration, isLoading, totalClearskyData } =
    useSiteAggregation(siteUUIDs);
  const [timeEnabled, setTimeEnabled] = useState(false);
  const { currentTime } = useTime(latitude, longitude, {
    updateEnabled: timeEnabled,
  });

  const [timeRange, setTimeRange] = useState(48);
  const handleChange = (event: any) => {
    setTimeEnabled(false);
    setTimeRange(event.target.value);
  };

  const { weekdayFormatter } = useDateFormatter(siteUUIDs[0]);
  const endDate = new Date();
  endDate.setHours(endDate.getHours() + 48);

  const forecastDataTrimmed =
    totalForecastedGeneration &&
    makeGraphable(
      addTimePoint(
        generationDataOverDateRange(
          totalForecastedGeneration,
          getGraphStartDate(currentTime, timeRange),
          getGraphEndDate(currentTime, timeRange)
        ),
        new Date(currentTime)
      )
    );

  const clearSkyEstimateTrimmed =
    totalClearskyData &&
    makeGraphable(
      addTimePoint(
        generationDataOverDateRange(
          totalClearskyData,
          getGraphStartDate(currentTime, timeRange),
          getGraphEndDate(currentTime, timeRange)
        ),
        new Date(currentTime)
      )
    );
  const maxGeneration = clearSkyEstimateTrimmed
    ? Math.max(...clearSkyEstimateTrimmed.map((value) => value.generation_kw))
    : 0;

  const yTickArray = [
    0,
    maxGeneration / 4,
    maxGeneration / 2,
    (3 * maxGeneration) / 4,
    maxGeneration,
  ];

  const renderLabel = ({ viewBox: { x }, height }: any) => {
    const yy = height * 0.75 + 2.5;
    const textProps = {
      className: 'text-xs fill-ocf-gray-1000',
      textAnchor: 'middle',
      x: x + 1,
      y: yy,
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

  const xTickArray =
    clearSkyEstimateTrimmed &&
    getXTickValues(
      clearSkyEstimateTrimmed.map((item) => item.datetime_utc),
      5
    );

  return (
    <div className="w-full h-[260px] bg-ocf-black-500 rounded-2xl p-3">
      <div className="ml-1 flex gap-2">
        <label className="block">
          <input
            className="sr-only peer"
            type="radio"
            name="1H"
            id="1H"
            value={1}
            checked={timeRange == 1}
            onChange={handleChange}
          />
          <span className="cursor-pointer peer-checked:bg-ocf-yellow-500 peer-checked:rounded-md peer-checked:text-black text-ocf-gray-300 w-10 h-7 pt-0.5 text-center bg-ocf-gray-1000 rounded-md inline-block relative peer-focus-visible:ring">
            1H
          </span>
        </label>
        <label className="block">
          <input
            className="sr-only peer"
            type="radio"
            name="1D"
            id="1D"
            value={24}
            checked={timeRange == 24}
            onChange={handleChange}
          />
          <span className="cursor-pointer peer-checked:bg-ocf-yellow-500 peer-checked:rounded-md peer-checked:text-black text-ocf-gray-300 w-10 h-7 pt-0.5 text-center bg-ocf-gray-1000 rounded-md inline-block relative peer-focus-visible:ring">
            1D
          </span>
        </label>
        <label className="block">
          <input
            className="sr-only peer"
            type="radio"
            name="2D"
            id="2D"
            value={48}
            checked={timeRange == 48}
            onChange={handleChange}
          />
          <span className="cursor-pointer peer-checked:bg-ocf-yellow-500 peer-checked:rounded-md peer-checked:text-black text-ocf-gray-300 w-10 h-7 pt-0.5 text-center bg-ocf-gray-1000 rounded-md inline-block relative peer-focus-visible:ring">
            2D
          </span>
        </label>
      </div>
      <div className="flex ml-[9%] mt-[20px]  text-sm gap-3">
        <div className="flex">
          <LegendLineGraphIcon className="text-ocf-yellow-500" />
          <p className="text-white ml-[5px] mt-[2px]">OCF Final Forecast</p>
        </div>
        <div className="flex">
          <LegendLineGraphIcon className="text-ocf-blue" />
          <p className="text-white ml-[5px] mt-[2px]">Clear Sky</p>
        </div>
      </div>
      {!isLoading && (
        <ResponsiveContainer
          className="mt-[20px] touch-pinch-zoom touch-pan-y"
          width="100%"
          height={150}
        >
          <LineChart
            margin={{
              top: 0,
              right: 10,
              left: -25,
              bottom: 20,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              color="white"
              // vertical={false}
            />
            <XAxis
              scale="time"
              domain={['auto', 'auto']}
              tickCount={5}
              ticks={xTickArray}
              fontSize="9px"
              dataKey="datetime_utc"
              allowDuplicatedCategory={false}
              stroke="white"
              axisLine={false}
              tickFormatter={(point: GenerationDataPoint['datetime_utc']) =>
                weekdayFormatter.format(point)
              }
              type="number"
            />
            <YAxis
              tickCount={7}
              ticks={yTickArray}
              domain={[0, maxGeneration * 1.25]}
              interval={0}
              fontSize="10px"
              axisLine={false}
              stroke="white"
              tickFormatter={(val: GenerationDataPoint['generation_kw']) =>
                val.toFixed(2)
              }
            />
            <Tooltip
              wrapperStyle={{ outline: 'none' }}
              contentStyle={{
                backgroundColor: '#2B2B2B90',
                opacity: 1,
              }}
              labelStyle={{ color: 'white' }}
              formatter={(value: GenerationDataPoint['generation_kw']) => [
                parseFloat(value.toFixed(5)),
                'kW',
              ]}
              labelFormatter={(point: GenerationDataPoint['datetime_utc']) =>
                weekdayFormatter.format(new Date(point))
              }
            />
            <Line
              data={clearSkyEstimateTrimmed}
              type="monotone"
              dataKey="generation_kw"
              stroke="#48B0DF"
              dot={false}
              activeDot={{ r: 8 }}
              onAnimationEnd={() => setTimeEnabled(true)}
            />
            <Line
              data={forecastDataTrimmed}
              type="monotone"
              dataKey="generation_kw"
              stroke="#FFD053"
              dot={false}
              activeDot={{ r: 8 }}
            />
            <ReferenceLine
              x={setSeconds(setMilliseconds(currentTime, 0), 0).getTime()}
              strokeWidth={1}
              stroke="white"
              label={(props) => renderLabel({ ...props, height: 150 })}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default Graph;
