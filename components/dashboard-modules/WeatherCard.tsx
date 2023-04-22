import { FC } from 'react';
import { useSiteData } from '~/lib/hooks';
import useTime from '~/lib/hooks/useTime';

import { CloudyIcon, PartlyCloudyIcon, SunnyIcon } from '../icons';
import { getTotalExpectedOutput } from './ExpectedTotalOutput';
import { generationDataOverDateRange } from '~/lib/graphs';
import { GenerationDataPoint } from '~/lib/types';
import { dayOfWeekAsInteger, skeleton } from '~/lib/utils';
import useDateFormatter from '~/lib/hooks/useDateFormatter';

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
  const millisInDay = 86400000;
  const newDuskTime = new Date(duskTime.getTime() + offset * millisInDay);
  const newDawnTime = new Date(dawnTime.getTime() + offset * millisInDay);
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
  day: number | 'Today'
) => {
  const dates = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
  return (
    <div className="flex-1 flex-col">
      <div className="w-full flex flex-col justify-center align-center text-center py-2 gap-1">
        <p className="flex-1 text-xs text-amber-50">
          {day === 'Today' ? day : dates[day]}
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
  const { currentTime, duskTime, dawnTime } = useTime(latitude, longitude);
  const { timezone } = useDateFormatter(siteUUID);
  if (forecastData && clearskyData && latitude && longitude) {
    const [firstTotal, firstClearskyCapacity, firstDay] =
      GetExpectedOutputOverDay(
        duskTime,
        dawnTime,
        0,
        forecastData.forecast_values,
        clearskyData.clearsky_estimate
      );

    const currentDay = dayOfWeekAsInteger(
      new Intl.DateTimeFormat(['en-US', 'en-GB'], {
        weekday: 'long',
        timeZone: timezone,
      }).format(currentTime)
    );

    const firstDayOrToday = firstDay === currentDay ? 'Today' : firstDay;

    const [secondTotal, secondClearskyCapacity, secondDay] =
      GetExpectedOutputOverDay(
        duskTime,
        dawnTime,
        1,
        forecastData.forecast_values,
        clearskyData.clearsky_estimate
      );

    const [thirdTotal, thirdClearskyCapacity, thirdDay] =
      GetExpectedOutputOverDay(
        duskTime,
        dawnTime,
        2,
        forecastData.forecast_values,
        clearskyData.clearsky_estimate
      );

    return (
      <div className="bg-ocf-black-500 flex flex-row justify-evenly rounded-2xl">
        {getWeatherDisplay(firstClearskyCapacity, firstTotal, firstDayOrToday)}
        {getWeatherDisplay(secondClearskyCapacity, secondTotal, secondDay)}
        {thirdTotal != 0 &&
          getWeatherDisplay(thirdClearskyCapacity, thirdTotal, thirdDay)}
      </div>
    );
  }

  return (
    <div className="bg-ocf-black-500 flex flex-row rounded-2xl px-5">
      <div className="flex-1 flex-col">
        <div className="w-full flex flex-col justify-center align-center text-center py-5 gap-1">
          <p className={`text-xs ${skeleton}`}>Loading...</p>
          <div className={`${skeleton}`}>
            <div className="h-[35px]"></div>
          </div>
          <p className={`text-xs ${skeleton}`}>Loading...</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
