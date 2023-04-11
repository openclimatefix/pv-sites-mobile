import { FC, useMemo, useState } from 'react';

import {
  Area,
  AreaChart,
  Label,
  LabelList,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  DownArrowIcon,
  LineCircle,
  UpArrowIcon,
} from '../icons/future_threshold';

import {
  generationDataOverDateRange,
  getCurrentTimeGenerationIndex,
  graphThreshold,
  makeGraphable,
} from 'lib/graphs';

import { getTrendAfterIndex } from 'lib/utils';

import { useSiteData } from 'lib/hooks';
import useDateFormatter from '~/lib/hooks/useDateFormatter';
import useTime from '~/lib/hooks/useTime';
import useSiteAggregation from '~/lib/hooks/useSiteAggregation';
import { GenerationDataPoint } from '~/lib/types';

const ThresholdGraph: FC<{ siteUUIDs: string[] }> = ({ siteUUIDs }) => {
  const { latitude, longitude, isLoading } = useSiteData(siteUUIDs[0]);
  const { totalExpectedGeneration } = useSiteAggregation(siteUUIDs);
  const [timeEnabled, setTimeEnabled] = useState(
    totalExpectedGeneration !== undefined
  );
  const { currentTime, duskTime, dawnTime } = useTime(latitude, longitude, {
    updateEnabled: timeEnabled,
  });
  const { timeFormatter, dayFormatter, weekdayFormatter } = useDateFormatter(
    siteUUIDs[0]
  );

  const graphData = useMemo(() => {
    if (totalExpectedGeneration && dawnTime && duskTime) {
      return generationDataOverDateRange(
        totalExpectedGeneration,
        dawnTime,
        duskTime
      );
    }
    return null;
  }, [totalExpectedGeneration, dawnTime, duskTime]);

  const maxGeneration = graphData
    ? Math.max(...graphData.map((value) => value.generation_kw))
    : 0;

  const renderCurrentTimeMarker = ({ x, y, index }: any) => {
    if (!graphData) return null;

    /* 
      Return null if this index doesn't correspond to the current time
      or if the current time is past the start/end dates of the graph
    */
    const currentTimeIndex = getCurrentTimeGenerationIndex(graphData);
    if (
      index !== currentTimeIndex ||
      (currentTimeIndex === 0 &&
        Date.now() < graphData[index].datetime_utc.getTime()) ||
      (currentTimeIndex === graphData.length - 1 &&
        Date.now() > graphData[index].datetime_utc.getTime())
    ) {
      return null;
    }

    return (
      <g>
        <LineCircle x={x} y={y} />
      </g>
    );
  };

  /**
   * Generates the gradient for the graph based on the threshold
   * @returns SVG gradient
   */
  const generateGraphGradient = () => {
    if (!graphData) return null;

    const aboveThreshold = graphData.some(
      (forecast) => forecast.generation_kw > graphThreshold
    );

    if (aboveThreshold) {
      const maxExpectedGenerationKW = Math.max.apply(
        null,
        graphData.map(({ generation_kw }) => generation_kw)
      );

      let gradientPercentage =
        100 - (graphThreshold / maxExpectedGenerationKW) * 100;

      if (gradientPercentage < 0) {
        gradientPercentage = 0;
      }

      return (
        <linearGradient id="thresholdGraphArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="1%" stopColor="#444444" stopOpacity={0} />
          <stop
            offset={`${gradientPercentage}%`}
            stopColor="#FFD053"
            stopOpacity={0.4}
          />
          <stop offset="0%" stopColor="#FFD053" stopOpacity={0} />
        </linearGradient>
      );
    }
    return null;
  };

  /**
   * @returns the time text below the threshold graph
   */
  const renderTime = () => {
    if (!graphData) return null;

    const numForecastValues = graphData.length;
    if (numForecastValues <= 0) {
      return null;
    }
    const startTime = timeFormatter.format(new Date(graphData[0].datetime_utc));
    const startDay = dayFormatter.format(new Date(graphData[0].datetime_utc));

    const endTime = timeFormatter.format(
      new Date(graphData[numForecastValues - 1].datetime_utc)
    );
    const endDay = dayFormatter.format(
      new Date(graphData[numForecastValues - 1].datetime_utc)
    );

    return (
      <div className="flex flex-row justify-between">
        <div>
          <p className="text-white text-xs sm:text-base font-semibold sm:font-medium ml-3 sm:ml-6">
            {startTime}
          </p>
          <p className="text-white text-xs sm:text-base font-normal ml-3 sm:ml-6">
            {startDay}
          </p>
        </div>
        <div className="w-9/12 sm:w-4/6">
          {renderCurrentTime()}
          {getSolarActivityText()}
        </div>
        <div>
          <p className="text-white text-xs sm:text-base font-semibold sm:font-medium mr-3 sm:mr-6">
            {endTime}
          </p>
          <p className="text-white text-xs sm:text-base font-normal mr-3 sm:mr-6">
            {endDay}
          </p>
        </div>
      </div>
    );
  };

  const solarIncreasingText = (formattedDate: string) => {
    return (
      <div className="flex flex-row justify-center mt-2">
        <UpArrowIcon />
        <p className="text-white text-sm font-normal ml-1 sm:ml-2">
          Solar activity is increasing until {formattedDate}
        </p>
      </div>
    );
  };

  const solarDecreasingText = (formattedDate: string) => {
    return (
      <div className="flex flex-row justify-center mt-2">
        <DownArrowIcon />
        <p className="text-white text-sm font-normal ml-1 sm:ml-2">
          Solar activity is decreasing until {formattedDate}
        </p>
      </div>
    );
  };

  const solarConstantText = (formattedDate: string) => {
    return (
      <div className="flex flex-row justify-center mt-2">
        <p className="text-white text-sm font-normal ml-2">
          Solar activity is constant until {formattedDate}
        </p>
      </div>
    );
  };

  /**
   * Calculates the next peak/trough starting from the current time
   * and returns text indicating increasing/decreasing solar activity
   */
  const getSolarActivityText = () => {
    if (!totalExpectedGeneration) return null;

    const currIndex = getCurrentTimeGenerationIndex(totalExpectedGeneration);
    const minMax = getTrendAfterIndex(totalExpectedGeneration, currIndex);

    if (minMax) {
      const { type, endIndex } = minMax;
      const slopeForecastDate = timeFormatter.format(
        new Date(totalExpectedGeneration[endIndex].datetime_utc)
      );

      switch (type) {
        case 'increasing':
          return solarIncreasingText(slopeForecastDate);
        case 'decreasing':
          return solarDecreasingText(slopeForecastDate);
        case 'constant':
          return solarConstantText(slopeForecastDate);
        default:
          return '';
      }
    }

    return '';
  };

  const renderCurrentTime = () => {
    if (!graphData) {
      return null;
    }

    const numForecastValues = graphData.length;

    if (
      Date.now() < graphData[0].datetime_utc.getTime() ||
      Date.now() > graphData[numForecastValues - 1].datetime_utc.getTime()
    ) {
      return (
        <p className="text-white text-base font-medium">
          Tomorrow&apos;s Forecast
        </p>
      );
    }

    return (
      <p suppressHydrationWarning className="text-white text-base font-medium">
        {timeFormatter.format(currentTime)}
      </p>
    );
  };
  const graphableData = graphData ? makeGraphable(graphData) : undefined;

  return (
    <div className="relative w-full h-[260px] bg-ocf-black-500 rounded-2xl content-center">
      <div className="flex flex-col w-full justify-start">
        <div className="flex justify-end mt-[20px] mr-10 text-sm">
          <div className="flex flex-col gap-1 justify-start">
            <div className="flex gap-2 items-center justify-end">
              <p className="text-[10px] text-white text-right leading-none">
                Forecast
              </p>
              <div className="not-sr-only w-[27px] h-[2px] border-b-2 border-dotted border-white"></div>
            </div>
            <div className="flex gap-2 items-center justify-end">
              <p className="text-[10px] text-ocf-yellow text-right leading-none">
                Threshold
              </p>
              <div className="not-sr-only w-[27px] h-[2px] border-b-2 border-dotted border-ocf-yellow"></div>
            </div>
          </div>
        </div>

        {!isLoading && graphData !== null && (
          <ResponsiveContainer
            className="mt-[15px] touch-pan-y touch-pinch-zoom"
            width="100%"
            height={100}
          >
            <AreaChart
              data={graphableData}
              margin={{
                top: 0,
                right: 40,
                left: 0,
                bottom: 10,
              }}
            >
              <defs>{generateGraphGradient()}</defs>
              <XAxis
                hide
                scale="time"
                domain={['auto', 'auto']}
                dataKey="datetime_utc"
                type="number"
              />
              <YAxis
                type="number"
                domain={[0, maxGeneration + 0.25]}
                axisLine={false}
                tick={false}
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
                  weekdayFormatter.format(point)
                }
              />
              <Area
                type="monotone"
                dataKey="generation_kw"
                strokeWidth={2}
                fillOpacity={1}
                stroke="white"
                strokeDasharray="2"
                fill="url(#thresholdGraphArea)"
                onAnimationEnd={() => setTimeEnabled(true)}
              >
                <LabelList
                  dataKey="generation_kw"
                  content={renderCurrentTimeMarker}
                />
              </Area>
              <ReferenceLine
                y={graphThreshold}
                strokeWidth={2}
                stroke="#FFD053"
                strokeDasharray="2"
              >
                <Label
                  value={graphThreshold + ' kW'}
                  position="left"
                  className="text-xs fill-ocf-yellow"
                />
              </ReferenceLine>
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="flex flex-col justify-center content-center inset-x-0 text-center">
        {renderTime()}
      </div>
    </div>
  );
};

export default ThresholdGraph;
