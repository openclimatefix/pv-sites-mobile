import { useState, useEffect } from 'react';

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

import {
  formatter,
  useFutureGraphData,
  forecastDataOverDateRange,
  getClosestForecastIndex,
} from 'lib/graphs';

import { getArrayMaxOrMinAfterIndex, Value } from 'lib/utils';

/* Represents the threshold for the graph */
const graphThreshold = 0.7;

const ThresholdGraph = () => {
  const { data, isLoading } = useFutureGraphData();
  const [currentTime, setCurrentTime] = useState(formatter.format(Date.now()));

  console.log(data);

  let currentDate = new Date();
  let endDate = new Date();
  currentDate.setHours(8);
  endDate.setHours(20);
  const graphData = data
    ? forecastDataOverDateRange(
        JSON.parse(JSON.stringify(data)),
        currentDate,
        endDate
      )
    : null;

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(formatter.format(Date.now()));
    }, 1000);

    // clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId);
  });

  /**
   * @returns the index of the forecasted date that is closest to the current time
   */
  const getCurrentTimeForecastIndex = () => {
    // if (graphData) {
    //   const currentDate = new Date();

    //   const closestDateIndex = graphData.forecast_values
    //     .map((forecast_values, index) => ({ ...forecast_values, index: index }))
    //     .map((forecast_values) => ({
    //       ...forecast_values,
    //       difference: Math.abs(
    //         currentDate.getTime() -
    //           new Date(forecast_values.target_datetime_utc).getTime()
    //       ),
    //     }))
    //     .reduce((prev, curr) =>
    //       prev.difference < curr.difference ? prev : curr
    //     ).index;

    //   return closestDateIndex;
    // }
    // return 0;
    return getClosestForecastIndex(graphData, new Date());
  };

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
      if (index === getCurrentTimeForecastIndex()) {
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
      const currIndex = getCurrentTimeForecastIndex();
      const minMax = getArrayMaxOrMinAfterIndex(
        data.forecast_values,
        'expected_generation_kw',
        currIndex
      );

      if (minMax) {
        const { type, index } = minMax;
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
        {currentTime}
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
