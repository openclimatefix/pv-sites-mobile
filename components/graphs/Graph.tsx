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
import useTime from '~/lib/hooks/useTime';
import { GenerationDataPoint } from '~/lib/types';

function getGraphStartDate(currentTime: number) {
  const currentDate = new Date(currentTime);
  return new Date(
    Date.UTC(
      currentDate.getUTCFullYear(),
      currentDate.getUTCMonth(),
      currentDate.getUTCDate(),
      currentDate.getUTCHours() - 5
    )
  );
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
    makeGraphable(
      addTimePoint(
        generationDataOverDateRange(
          forecastData.forecast_values,
          getGraphStartDate(currentTime),
          endDate
        ),
        new Date(currentTime)
      )
    );

  const clearSkyEstimateTrimmed =
    clearskyData &&
    makeGraphable(
      addTimePoint(
        generationDataOverDateRange(
          clearskyData?.clearsky_estimate,
          getGraphStartDate(currentTime),
          endDate
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
    <div className="w-full h-[260px] bg-ocf-black-500 rounded-2xl p-4">
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
              contentStyle={{ backgroundColor: '#2B2B2B90', opacity: 1 }}
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
              label={(props) => renderLabel({ ...props, height: 200 })}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default Graph;
