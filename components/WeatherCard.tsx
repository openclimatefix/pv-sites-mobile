import { FC } from 'react';
import {
  getTotalExpectedForecastOutput,
  getTotalExpectedClearSkyOutput,
} from '~/lib/utils';
import { useSiteData } from '~/lib/hooks';
import useTime from '~/lib/hooks/useTime';
import {
  outputDataOverDateRange,
  getGraphStartDate,
  getGraphEndDate,
} from '~/lib/graphs';

import CloudyIcon from './icons/CloudyIcon';
import SunnyIcon from './icons/SunnyIcon';
import PartlyCloudyIcon from './icons/PartlyCloudyIcon';
import { ClearSkyDataPoint, ForecastDataPoint } from '~/lib/types';

type WeatherProps = {
  siteUUID: string;
};

export const cloudyThreshold = 0.3;
export const sunnyThreshold = 0.7;

const WeatherCard: FC<WeatherProps> = ({ siteUUID }) => {
  const { forecastData, clearskyData, latitude, longitude } =
    useSiteData(siteUUID);
  const { currentTime } = useTime(latitude, longitude);
  if (forecastData && clearskyData) {
    const totalClearSkyOutput = getTotalExpectedClearSkyOutput(
      clearskyData.clearsky_estimate
    );
    const day1 = new Date();
    day1.setHours(getGraphStartDate(currentTime).getHours() + 24);
    const day1GraphData = outputDataOverDateRange<ForecastDataPoint>(
      JSON.parse(JSON.stringify(forecastData.forecast_values)),
      day1,
      day1
    );
    const diff1 =
      getTotalExpectedForecastOutput(day1GraphData) / totalClearSkyOutput;

    const day2 = new Date();
    day2.setHours(getGraphStartDate(currentTime).getHours() + 24);
    const day2GraphData = outputDataOverDateRange<ForecastDataPoint>(
      JSON.parse(JSON.stringify(forecastData.forecast_values)),
      day2,
      day2
    );
    const diff2 =
      getTotalExpectedForecastOutput(day2GraphData) / totalClearSkyOutput;

    const day3 = new Date();
    day3.setHours(getGraphStartDate(currentTime).getHours() + 48);
    const day3GraphData = outputDataOverDateRange<ForecastDataPoint>(
      JSON.parse(JSON.stringify(forecastData.forecast_values)),
      day3,
      day3
    );
    const diff3 =
      getTotalExpectedForecastOutput(day3GraphData) / totalClearSkyOutput;

    const day4 = new Date();
    day2.setHours(getGraphStartDate(currentTime).getHours() + 72);
    const day4GraphData = outputDataOverDateRange<ForecastDataPoint>(
      JSON.parse(JSON.stringify(forecastData.forecast_values)),
      day2,
      day2
    );
    const diff4 =
      getTotalExpectedForecastOutput(day2GraphData) / totalClearSkyOutput;

    return (
      <div className="bg-ocf-black-500 rounded-lg">
        <div className="w-full pt-3 pb-8 flex justify-center align-middle gap-4">
          {diff1 < cloudyThreshold ? (
            <div>
              <CloudyIcon />
            </div>
          ) : diff1 > sunnyThreshold ? (
            <div>
              <SunnyIcon />
            </div>
          ) : (
            <div>
              <PartlyCloudyIcon />
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default WeatherCard;
