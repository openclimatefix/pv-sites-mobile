import { FC, useMemo, useState } from 'react';

import {
  Area,
  AreaChart,
  Label,
  LabelList,
  ReferenceLine,
  ResponsiveContainer,
  YAxis,
} from 'recharts';

import {
  DownArrowIcon,
  FutureThresholdLegendIcon,
  LineCircle,
  UpArrowIcon,
} from '../icons/future_threshold';

import {
  generationDataOverDateRange,
  getCurrentTimeGenerationIndex,
  graphThreshold,
  makeGraphable,
} from 'lib/graphs';

import { getArrayMaxOrMinAfterIndex } from 'lib/utils';

import { useSiteData } from 'lib/hooks';
import useDateFormatter from '~/lib/hooks/useDateFormatter';
import useTime from '~/lib/hooks/useTime';

const ThresholdGraph: FC<{ siteUUID: string }> = ({ siteUUID }) => {
  const { forecastData, latitude, longitude, isLoading } =
    useSiteData(siteUUID);
  const [timeEnabled, setTimeEnabled] = useState(false);
  const { currentTime, duskTime, dawnTime } = useTime(latitude, longitude, {
    updateEnabled: timeEnabled,
  });
  const { timeFormatter } = useDateFormatter(siteUUID);

  const graphData = useMemo(() => {
    if (forecastData && dawnTime && duskTime) {
      return generationDataOverDateRange(
        forecastData.forecast_values,
        dawnTime,
        duskTime
      );
    }
    return null;
  }, [forecastData, dawnTime, duskTime]);

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
        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
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
   * @returns the start and end time label on the graph's x-axis
   */
  const renderStartAndEndTime = () => {
    if (!graphData) return null;

    const numForecastValues = graphData.length;

    if (numForecastValues <= 0) {
      return null;
    }

    const startTime = timeFormatter.format(new Date(graphData[0].datetime_utc));
    const endTime = timeFormatter.format(
      new Date(graphData[numForecastValues - 1].datetime_utc)
    );

    return (
      <div className="flex flex-row justify-between">
        <p className="text-white text-xs font-medium ml-6">{startTime}</p>
        <p className="text-white text-xs font-medium mr-6">{endTime}</p>
      </div>
    );
  };

  const solarIncreasingText = (formattedDate: string) => {
    return (
      <div className="flex flex-row justify-center mt-2">
        <UpArrowIcon />
        <p className="text-white text-sm font-normal ml-2">
          Solar activity is increasing until {formattedDate}
        </p>
      </div>
    );
  };

  const solarDecreasingText = (formattedDate: string) => {
    return (
      <div className="flex flex-row justify-center mt-2">
        <DownArrowIcon />
        <p className="text-white text-sm font-normal ml-2">
          Solar activity is decreasing until {formattedDate}
        </p>
      </div>
    );
  };

  /**
   * Calculates the next peak/trough starting from the current time
   * and returns text indicating increasing/decreasing solar activity
   */
  const getSolarActivityText = () => {
    if (!forecastData) return null;

    const currIndex = getCurrentTimeGenerationIndex(
      forecastData.forecast_values
    );
    const minMax = getArrayMaxOrMinAfterIndex(
      forecastData.forecast_values,
      currIndex
    );

    if (minMax) {
      console.log(minMax);

      const { type, index } = minMax;
      const minMaxForecastDate = timeFormatter.format(
        new Date(forecastData.forecast_values[index].datetime_utc)
      );
      return type === 'max'
        ? solarIncreasingText(minMaxForecastDate)
        : solarDecreasingText(minMaxForecastDate);
    }

    return '';
  };

  const renderCurrentTime = () => {
    return (
      <p
        suppressHydrationWarning
        className="text-white text-base font-semibold"
      >
        {timeFormatter.format(currentTime)}
      </p>
    );
  };

  return (
    <div className="relative w-full h-[260px] bg-ocf-black-500 rounded-2xl content-center">
      <div className="flex flex-col w-full justify-start">
        <div className="flex justify-end mt-[20px] mr-10 text-sm">
          <FutureThresholdLegendIcon />
        </div>

        {!isLoading && graphData !== null && (
          <ResponsiveContainer className="mt-[15px]" width="100%" height={100}>
            <AreaChart
              data={makeGraphable(graphData)}
              margin={{
                top: 0,
                right: 40,
                left: 0,
                bottom: 10,
              }}
            >
              <defs>{generateGraphGradient()}</defs>
              <YAxis
                type="number"
                domain={[0, maxGeneration + 0.25]}
                axisLine={false}
                tick={false}
              />
              <Area
                type="monotone"
                dataKey="generation_kw"
                strokeWidth={2}
                stroke="white"
                strokeDasharray="2"
                fill="url(#colorUv)"
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
      <div className="flex flex-col justify-center content-center bottom-8 inset-x-0 text-center">
        {renderStartAndEndTime()}
        {renderCurrentTime()}
        {getSolarActivityText()}
      </div>
    </div>
  );
};

export default ThresholdGraph;
