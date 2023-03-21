import { FC } from 'react';

import {
  ResponsiveContainer,
  YAxis,
  AreaChart,
  LabelList,
  Area,
  ReferenceLine,
} from 'recharts';

import {
  FutureThresholdLegendIcon,
  UpArrowIcon,
  DownArrowIcon,
  LineCircle,
} from '../icons/future_threshold';

import { formatter, forecastDataOverDateRange } from 'lib/graphs';

import {
  getArrayMaxOrMinAfterIndex,
  Value,
  getCurrentTimeForecastIndex,
  graphThreshold,
} from 'lib/utils';

import { useSiteData } from 'lib/hooks';
import useTime from '~/lib/hooks/useTime';

const ThresholdGraph: FC<{ siteUUID: string }> = ({ siteUUID }) => {
  const { forecastData, latitude, longitude, isLoading } =
    useSiteData(siteUUID);
  const { currentTime } = useTime(latitude, longitude);
  let currentDate = new Date();
  let endDate = new Date();
  currentDate.setHours(8);
  currentDate.setMinutes(0);
  currentDate.setSeconds(0);
  currentDate.setMilliseconds(0);
  endDate.setHours(20);
  endDate.setMinutes(0);
  endDate.setSeconds(0);
  endDate.setMilliseconds(0);
  const graphData = forecastData
    ? forecastDataOverDateRange(
        JSON.parse(JSON.stringify(forecastData)),
        currentDate,
        endDate
      )
    : null;
  /**
   * Renders a text label for the threshold
   * @param props data about the point, such as x and y position on the graph
   * @returns SVG element
   */
  const renderThresholdLabel = ({ x, index }: any) => {
    if (graphData && graphData.forecast_values.length > 0) {
      if (index === 0) {
        return (
          <g>
            <text
              fill="#FFD053"
              x={x - 25}
              y={-78.95 * graphThreshold + 80.84}
              className="text-xs"
            >
              {graphThreshold}
            </text>
            <text
              fill="#FFD053"
              x={x - 25}
              y={-78.95 * graphThreshold + 94.84}
              className="text-xs"
            >
              kw
            </text>
          </g>
        );
      }
    }

    return null;
  };

  /**
   * Renders a marker representing the current time
   * @param props data about the point, such as x and y position on the graph
   * @returns SVG element
   */
  const renderCurrentTimeMarker = ({ x, y, index }: any) => {
    if (graphData && graphData.forecast_values.length > 0) {
      if (index === getCurrentTimeForecastIndex(graphData?.forecast_values)) {
        return (
          <g>
            <LineCircle x={x} y={y} />
          </g>
        );
      }
    }

    return null;
  };

  /**
   * Generates the gradient for the graph based on the threshold
   * @returns SVG gradient
   */
  const generateGraphGradient = () => {
    if (!isLoading && graphData) {
      const aboveThreshold = graphData.forecast_values.some(
        (forecast) => forecast.expected_generation_kw > graphThreshold
      );

      if (aboveThreshold) {
        const maxExpectedGenerationKW = Math.max.apply(
          null,
          graphData.forecast_values.map(
            ({ expected_generation_kw }) => expected_generation_kw
          )
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
    }
    return null;
  };

  /**
   * @returns the start and end time label on the graph's x-axis
   */
  const renderStartAndEndTime = () => {
    if (!isLoading && graphData) {
      const numForecastValues = graphData.forecast_values.length;

      if (numForecastValues > 0) {
        const startTime = formatter.format(
          new Date(graphData.forecast_values[0].target_datetime_utc)
        );
        const endTime = formatter.format(
          new Date(
            graphData.forecast_values[numForecastValues - 1].target_datetime_utc
          )
        );

        return (
          <div className="flex flex-row justify-between">
            <p className="text-white text-xs font-medium ml-6">{startTime}</p>
            <p className="text-white text-xs font-medium mr-6">{endTime}</p>
          </div>
        );
      }
    }

    return null;
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
    if (graphData) {
      const currIndex = getCurrentTimeForecastIndex(graphData?.forecast_values);
      const minMax = getArrayMaxOrMinAfterIndex(
        graphData.forecast_values,
        'expected_generation_kw',
        currIndex
      );

      if (minMax) {
        const { type, number: index } = minMax;
        const minMaxForecastDate = formatter.format(
          new Date(graphData.forecast_values[index].target_datetime_utc)
        );
        return type === Value.Max
          ? solarIncreasingText(minMaxForecastDate)
          : solarDecreasingText(minMaxForecastDate);
      }
    }

    return '';
  };

  const renderCurrentTime = () => {
    return (
      <p
        suppressHydrationWarning
        className="text-white text-base font-semibold"
      >
        {formatter.format(currentTime)}
      </p>
    );
  };

  return (
    <div className="relative my-2 w-full h-[260px] bg-ocf-gray-1000 rounded-2xl content-center">
      <div className="flex flex-col w-full justify-start">
        <div className="flex justify-end mt-[20px] mr-10 text-sm">
          <FutureThresholdLegendIcon />
        </div>
        <ResponsiveContainer className="mt-[15px] " width="100%" height={100}>
          <AreaChart
            data={graphData?.forecast_values}
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
              domain={[0, 1.1]}
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
            >
              <LabelList
                dataKey="expected_generation_kw"
                content={renderThresholdLabel}
              />
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
            />
          </AreaChart>
        </ResponsiveContainer>
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
