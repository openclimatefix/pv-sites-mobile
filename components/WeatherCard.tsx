import { FC } from 'react';
import { useSiteData } from '~/lib/hooks';
import useTime from '~/lib/hooks/useTime';

import { CloudyIcon, PartlyCloudyIcon, SunnyIcon } from './icons';
import { getTotalExpectedOutput } from './dashboard-modules/ExpectedTotalOutput';
import { generationDataOverDateRange } from '~/lib/graphs';
import { GenerationDataPoint } from '~/lib/types';
import NumberDisplay from './dashboard-modules/NumberDisplay';

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

const getWeatherDisplay = (
  clearskyCapacity: number,
  total: number,
  day: number
) => {
  const dates = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
  return (
    <div className="flex-1 flex-col">
      <div className="w-full flex flex-col justify-center align-center text-center py-5 gap-1">
        <p className="flex-1 text-xs text-amber-50">
          {day == -1 ? 'Today' : dates[day]}
        </p>
        <div className="flex-1 self-center margin-0">
          {clearskyCapacity < cloudyThreshold ? (
            <CloudyIcon />
          ) : clearskyCapacity > sunnyThreshold ? (
            <SunnyIcon />
          ) : (
            <PartlyCloudyIcon />
          )}
        </div>
        <p className="flex-1 text-xs text-amber">{total.toFixed(2)} kWh</p>
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
    const [firstTotal, firstClearskyCapacity] = GetExpectedOutputOverDay(
      duskTime,
      dawnTime,
      0,
      forecastData.forecast_values,
      clearskyData.clearsky_estimate
    );

    const [secondTotal, secondClearskyCapacity, secondDate] =
      GetExpectedOutputOverDay(
        duskTime,
        dawnTime,
        24,
        forecastData.forecast_values,
        clearskyData.clearsky_estimate
      );

    const [thirdTotal, thirdClearskyCapacity, thirdDate] =
      GetExpectedOutputOverDay(
        duskTime,
        dawnTime,
        48,
        forecastData.forecast_values,
        clearskyData.clearsky_estimate
      );

    return (
      <div className="bg-ocf-black-500 flex flex-row rounded-2xl px-5">
        {getWeatherDisplay(firstClearskyCapacity, firstTotal, -1)}
        {getWeatherDisplay(secondClearskyCapacity, secondTotal, secondDate)}
        {thirdTotal != 0 &&
          getWeatherDisplay(thirdClearskyCapacity, thirdTotal, thirdDate)}
      </div>
    );
  }

  return <NumberDisplay title="" value="Loading..." />;
};

export default WeatherCard;
