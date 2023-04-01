import { LegendLineGraphIcon } from '@openclimatefix/nowcasting-ui.icons.icons';
import {
  outputDataOverDateRange,
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
import useDateFormatter from '~/lib/hooks/useDateFormatter';
import useTime from '~/lib/hooks/useTime';
import { ClearSkyDataPoint, ForecastDataPoint } from '~/lib/types';

function getGraphStartDate(currentTime: number) {
  const currentDate = new Date(currentTime);
  return new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate(),
    currentDate.getHours() - 5
  );
}

function getXTickValues(clearSkyData: ClearSkyDataPoint[], numTicks: number) {
  const tickValues: any[] = [];
  const dataLength = clearSkyData.length;

  if (dataLength === 0) {
    return tickValues;
  }

  const tickStep = Math.floor(dataLength / (numTicks - 1));

  for (let i = 0; i < numTicks; i++) {
    const index = Math.min(i * tickStep, dataLength - 1);
    const tickValue = clearSkyData[index].target_datetime_utc;
    tickValues.push(tickValue);
  }

  return tickValues;
}

const Graph: FC<{ siteUUID: string }> = ({ siteUUID }) => {
  const { forecastData, latitude, longitude, isLoading, clearskyData } =
    useSiteData(siteUUID);
  const [timeEnabled, setTimeEnabled] = useState(false);
  const { currentTime } = useTime(latitude, longitude, {
    updateEnabled: timeEnabled,
  });
  const { weekdayFormatter } = useDateFormatter(siteUUID);
  const endDate = new Date();
  endDate.setHours(endDate.getHours() + 48);
  const forecastDataTrimmed =
    forecastData &&
    outputDataOverDateRange(
      forecastData.forecast_values,
      getGraphStartDate(currentTime),
      endDate
    );

  const clearSkyEstimateTrimmed = clearskyData
    ? outputDataOverDateRange(
        clearskyData?.clearsky_estimate,
        getGraphStartDate(currentTime),
        endDate
      )
    : undefined;

  const maxGeneration = clearSkyEstimateTrimmed
    ? Math.max(
        ...clearSkyEstimateTrimmed.map((value) => value.clearsky_generation_kw)
      )
    : 0;

  const yTickArray = [
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

  const xTickArray =
    clearSkyEstimateTrimmed &&
    getXTickValues(clearSkyEstimateTrimmed as ClearSkyDataPoint[], 5);

  return (
    <div className="w-full h-[260px] bg-ocf-black-500 rounded-2xl p-1">
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
        <ResponsiveContainer className="mt-[20px]" width="100%" height={200}>
          <LineChart
            data={forecastDataTrimmed}
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
              tickCount={5}
              ticks={xTickArray}
              scale="band"
              fontSize="9px"
              dataKey="target_datetime_utc"
              allowDuplicatedCategory={false}
              stroke="white"
              axisLine={false}
              tickFormatter={(
                point: ForecastDataPoint['target_datetime_utc']
              ) => weekdayFormatter.format(new Date(point))}
            />
            <YAxis
              tickCount={7}
              ticks={yTickArray}
              domain={[0, maxGeneration * 1.25]}
              interval={0}
              fontSize="10px"
              axisLine={false}
              stroke="white"
              tickFormatter={(
                val: ClearSkyDataPoint['clearsky_generation_kw']
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
              ) => weekdayFormatter.format(new Date(point))}
            />
            <Line
              data={clearSkyEstimateTrimmed}
              type="monotone"
              dataKey="clearsky_generation_kw"
              stroke="#48B0DF"
              dot={false}
              activeDot={{ r: 8 }}
              onAnimationEnd={() => setTimeEnabled(true)}
            />
            <Line
              data={forecastDataTrimmed}
              type="monotone"
              dataKey="expected_generation_kw"
              stroke="#FFD053"
              dot={false}
              activeDot={{ r: 8 }}
            />
            <ReferenceLine
              x={
                forecastDataTrimmed
                  ? forecastDataTrimmed[
                      getCurrentTimeForecastIndex(forecastDataTrimmed)
                    ].target_datetime_utc
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
