import { FC } from 'react';
import { useSiteData } from '~/lib/hooks';
import useTime from '~/lib/hooks/useTime';

import CloudyIcon from './icons/CloudyIcon';
import SunnyIcon from './icons/SunnyIcon';
import PartlyCloudyIcon from './icons/PartlyCloudyIcon';
import { getTotalExpectedOutput } from './dashboard-modules/ExpectedTotalOutput';
import { generationDataOverDateRange } from '~/lib/graphs';
import { GenerationDataPoint } from '~/lib/types';

type WeatherProps = {
  siteUUID: string;
};

const GetExpectedOutputOverDay = (
  duskTime: Date,
  dawnTime: Date,
  offset: number,
  forecastValues: GenerationDataPoint[],
  clearSkyEstimate: GenerationDataPoint[]
) => {
  const newDuskTime = new Date(duskTime.getTime() + offset * 3600000);
  const newDawnTime = new Date(dawnTime.getTime() + offset * 3600000);
  const forecastData = generationDataOverDateRange(
    forecastValues,
    newDawnTime,
    newDuskTime
  );
  const clearSkyData = generationDataOverDateRange(
    clearSkyEstimate,
    newDawnTime,
    newDuskTime
  );

  return [
    getTotalExpectedOutput(forecastData),
    getTotalExpectedOutput(forecastData) / getTotalExpectedOutput(clearSkyData),
    newDuskTime.getDay(),
  ];
};

const getWeatherDisplay = (diff: number, total: number, day: number) => {
  const dates = ['Today', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'];
  return (
    <div className="flex-1 flex-col">
      <div className="w-full flex flex-col justify-center align-center text-center py-5 gap-1">
        <p className="flex-1 text-xs text-ocf-yellow-50">{dates[day]}</p>
        <div className="flex-1 self-center margin-0">
          {diff < cloudyThreshold ? (
            <CloudyIcon />
          ) : diff > sunnyThreshold ? (
            <SunnyIcon />
          ) : (
            <PartlyCloudyIcon />
          )}
        </div>
        <p className="flex-1 text-xs text-ocf-yellow-500">
          {total.toFixed(2)} kWh
        </p>
      </div>
    </div>
  );
};

export const cloudyThreshold = 0.3;
export const sunnyThreshold = 0.7;

const WeatherCard: FC<WeatherProps> = ({ siteUUID }) => {
  const { forecastData, clearskyData, latitude, longitude } =
    useSiteData(siteUUID);
  const { duskTime, dawnTime } = useTime(latitude, longitude);
  if (forecastData && clearskyData && latitude && longitude) {
    const [firstTotal, firstDiff] = GetExpectedOutputOverDay(
      duskTime,
      dawnTime,
      0,
      forecastData.forecast_values,
      clearskyData.clearsky_estimate
    );

    const [secondTotal, secondDiff, secondDate] = GetExpectedOutputOverDay(
      duskTime,
      dawnTime,
      24,
      forecastData.forecast_values,
      clearskyData.clearsky_estimate
    );

    const [thirdTotal, thirdDiff, thirdDate] = GetExpectedOutputOverDay(
      duskTime,
      dawnTime,
      48,
      forecastData.forecast_values,
      clearskyData.clearsky_estimate
    );

    return (
      <div className="bg-ocf-black-500 flex flex-row rounded-2xl px-5">
        {getWeatherDisplay(firstDiff, firstTotal, 0)}
        {getWeatherDisplay(secondDiff, secondTotal, secondDate)}
        {getWeatherDisplay(thirdDiff, thirdTotal, thirdDate)}
      </div>
    );
  }

  return null;
};

export default WeatherCard;
