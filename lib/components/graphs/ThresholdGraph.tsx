import { FC, useCallback, useMemo, useState } from 'react';

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
} from '../icons/FutureThreshold';

import {
  addTimePoint,
  getTrendAfterIndex,
  graphThreshold,
  makeGraphable,
} from 'lib/graphs';

import dayjs from 'dayjs';
import {
  generationDataOverDateRange,
  getClosestForecastIndex,
  getCurrentTimeGenerationIndex,
} from '~/lib/generation';
import { useSiteAggregation } from '~/lib/sites';
import { useSiteTime } from '~/lib/time';
import { GenerationDataPoint, Site } from '~/lib/types';

interface ThresholdGraphProps {
  sites: Site[];
}

const ThresholdGraph: FC<ThresholdGraphProps> = ({ sites }) => {
  const representativeSite = sites[0];
  const { totalForecastedGeneration, totalInstalledCapacityKw, isLoading } =
    useSiteAggregation(sites);
  const [timeEnabled, setTimeEnabled] = useState(
    totalForecastedGeneration !== undefined
  );
  const { currentTime, sunrise, sunset, timeFormat, weekdayFormat, timezone } =
    useSiteTime(representativeSite, {
      updateEnabled: timeEnabled,
    });

  const thresholdCapacityKW = totalInstalledCapacityKw * graphThreshold;

  const rawGraphData = useMemo(() => {
    if (totalForecastedGeneration && sunrise && sunset) {
      return generationDataOverDateRange(
        totalForecastedGeneration,
        sunrise,
        sunset
      );
    }
    return null;
  }, [totalForecastedGeneration, sunrise, sunset]);
  const graphData =
    rawGraphData && addTimePoint(rawGraphData, currentTime.toDate());

  const maxGeneration = graphData
    ? Math.max(...graphData.map((value) => value.generation_kw))
    : 0;

  const renderCurrentTimeMarker = useCallback(
    ({ x, y, index }: any) => {
      if (!graphData) return;
      /* 
    Return null if this index doesn't correspond to the current time
    or if the current time is past the start/end dates of the graph
    */
      const currentTimeIndex = getClosestForecastIndex(
        graphData,
        currentTime.toDate()
      );

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
    },
    [graphData, currentTime]
  );

  /**
   * Generates the gradient for the graph based on the threshold
   * @returns SVG gradient
   */
  const generateGraphGradient = () => {
    if (!graphData) return null;

    const aboveThreshold = graphData.some(
      (forecast) => forecast.generation_kw > thresholdCapacityKW
    );

    if (aboveThreshold) {
      const maxExpectedGenerationKW = Math.max.apply(
        null,
        graphData.map(({ generation_kw }) => generation_kw)
      );

      let gradientPercentage =
        100 - (thresholdCapacityKW / maxExpectedGenerationKW) * 100;

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
    const startTime = timeFormat(sunrise);
    const endTime = timeFormat(sunset);

    return (
      <div className="flex flex-col">
        <div className="flex flex-row justify-between">
          <div>
            <p className="ml-3 text-xs font-semibold text-white sm:ml-6 sm:text-base sm:font-medium">
              {startTime}
            </p>
          </div>
          <div className="w-9/12 sm:w-4/6">{renderCurrentTime()}</div>
          <div>
            <p className="mr-3 text-xs font-semibold text-white sm:mr-6 sm:text-base sm:font-medium">
              {endTime}
            </p>
          </div>
        </div>
        {getSolarActivityText()}
      </div>
    );
  };

  const solarIncreasingText = (formattedDate: string) => {
    return (
      <div className="mt-2 flex flex-row justify-center">
        <UpArrowIcon />
        <p className="ml-1 text-sm font-normal text-white sm:ml-2">
          Solar activity is increasing until {formattedDate}
        </p>
      </div>
    );
  };

  const solarDecreasingText = (formattedDate: string) => {
    return (
      <div className="mt-2 flex flex-row justify-center">
        <DownArrowIcon />
        <p className="ml-1 text-sm font-normal text-white sm:ml-2">
          Solar activity is decreasing until {formattedDate}
        </p>
      </div>
    );
  };

  const solarConstantText = (formattedDate: string) => {
    return (
      <div className="mt-2 flex flex-row justify-center">
        <p className="ml-2 text-sm font-normal text-white">
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
    if (!totalForecastedGeneration) return null;

    const currIndex = getCurrentTimeGenerationIndex(totalForecastedGeneration);
    const slope = getTrendAfterIndex(totalForecastedGeneration, currIndex);

    if (slope) {
      const { type, endIndex } = slope;
      const slopeForecastDate = timeFormat(
        totalForecastedGeneration[endIndex].datetime_utc
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
      const currentDay = currentTime.day();
      const firstDay = dayjs(graphData[0].datetime_utc).tz(timezone).day();
      const relativeDay = currentDay !== firstDay ? 'Tomorrow' : 'Today';

      return (
        <p className="text-base font-medium text-white">
          {relativeDay}&apos;s Forecast
        </p>
      );
    }

    return (
      <p suppressHydrationWarning className="text-base font-medium text-white">
        {timeFormat(currentTime)}
      </p>
    );
  };

  const graphableData = graphData ? makeGraphable(graphData) : undefined;

  return (
    <div className="relative h-[240px] w-full content-center rounded-2xl bg-ocf-black-500">
      <div className="flex w-full flex-col justify-start">
        <div className="mr-10 mt-[20px] flex justify-end text-sm">
          <div className="flex flex-col justify-start gap-1">
            <div className="flex items-center justify-end gap-2">
              <p className="text-right text-[10px] leading-none text-white">
                Forecast
              </p>
              <div className="not-sr-only h-[2px] w-[27px] border-b-2 border-dotted border-white"></div>
            </div>
            <div className="flex items-center justify-end gap-2">
              <p className="text-right text-[10px] leading-none text-ocf-yellow">
                Threshold
              </p>
              <div className="not-sr-only h-[2px] w-[27px] border-b-2 border-dotted border-ocf-yellow"></div>
            </div>
          </div>
        </div>

        {!isLoading && graphableData && (
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
                  weekdayFormat(point)
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
                isAnimationActive={!timeEnabled}
              >
                <LabelList
                  dataKey="generation_kw"
                  content={renderCurrentTimeMarker}
                />
              </Area>
              <ReferenceLine
                y={thresholdCapacityKW}
                ifOverflow="extendDomain"
                strokeWidth={2}
                stroke="#FFD053"
                strokeDasharray="2"
              >
                <Label
                  value={thresholdCapacityKW.toFixed(1) + ' kW'}
                  position="left"
                  className="fill-ocf-yellow text-xs"
                />
              </ReferenceLine>
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="inset-x-0 flex flex-col content-center justify-center text-center">
        {renderTime()}
      </div>
    </div>
  );
};

export default ThresholdGraph;
