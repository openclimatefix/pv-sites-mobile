import { FC, useState } from 'react';

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
  forecastDataOverDateRange,
  timeFormatter,
  getCurrentTimeForecastIndex,
  getGraphEndDate,
  getGraphStartDate,
  graphThreshold,
} from 'lib/graphs';

import { getArrayMaxOrMinAfterIndex, Value } from 'lib/utils';

import { useSiteData } from 'lib/hooks';
import useTime from '~/lib/hooks/useTime';

const ThresholdGraph: FC<{ siteUUID: string }> = ({ siteUUID }) => {
  const { forecastData, latitude, longitude, isLoading } =
    useSiteData(siteUUID);
  const [timeEnabled, setTimeEnabled] = useState(false);
  const { currentTime } = useTime(latitude, longitude, {
    updateEnabled: timeEnabled,
  });

  const graphData =
    forecastData &&
    forecastDataOverDateRange(
      forecastData.forecast_values,
      getGraphStartDate(currentTime),
      getGraphEndDate(currentTime)
    );

  const maxGeneration = graphData
    ? Math.max(...graphData.map((value) => value.expected_generation_kw))
    : 0;

  const renderCurrentTimeMarker = ({ x, y, index }: any) => {
    if (!graphData) return null;

    const currentTimeIndex = getCurrentTimeForecastIndex(graphData);
    if (index !== currentTimeIndex) return null;

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
      (forecast) => forecast.expected_generation_kw > graphThreshold
    );

    if (aboveThreshold) {
      const maxExpectedGenerationKW = Math.max.apply(
        null,
        graphData.map(({ expected_generation_kw }) => expected_generation_kw)
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

    const startTime = timeFormatter.format(
      new Date(graphData[0].target_datetime_utc)
    );
    const endTime = timeFormatter.format(
      new Date(graphData[numForecastValues - 1].target_datetime_utc)
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
    if (!graphData) return null;

    const currIndex = getCurrentTimeForecastIndex(graphData);
    const minMax = getArrayMaxOrMinAfterIndex(
      graphData,
      'expected_generation_kw',
      currIndex
    );

    if (minMax) {
      const { type, number: index } = minMax;
      const minMaxForecastDate = timeFormatter.format(
        new Date(graphData[index].target_datetime_utc)
      );
      return type === Value.Max
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
    <div className="relative my-2 w-full h-[260px] bg-ocf-black-500 rounded-2xl content-center">
      <div className="flex flex-col w-full justify-start">
        <div className="flex justify-end mt-[20px] mr-10 text-sm">
          <FutureThresholdLegendIcon />
        </div>
        {!isLoading && (
          <ResponsiveContainer className="mt-[15px]" width="100%" height={100}>
            <AreaChart
              data={graphData}
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
                dataKey="expected_generation_kw"
                strokeWidth={2}
                stroke="white"
                strokeDasharray="2"
                fill="url(#colorUv)"
                onAnimationEnd={() => setTimeEnabled(true)}
              >
                <LabelList
                  dataKey="expected_generation_kw"
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
      <div className="flex flex-col justify-center content-center absolute bottom-8 inset-x-0 text-center">
        {renderStartAndEndTime()}
        {renderCurrentTime()}
        {getSolarActivityText()}
      </div>
    </div>
  );
};

export default ThresholdGraph;
