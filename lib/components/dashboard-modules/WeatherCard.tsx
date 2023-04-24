import { FC } from 'react';

import {
  generationDataOverDateRange,
  getTotalExpectedOutput,
} from '~/lib/generation';
import { useSiteAggregation } from '~/lib/sites';
import { skeleton } from '~/lib/skeleton';
import { useSiteTime } from '~/lib/time';
import { GenerationDataPoint, Site } from '~/lib/types';
import { CloudyIcon, PartlyCloudyIcon, SunnyIcon } from '../icons';

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
      <div className="align-center flex w-full flex-col justify-center gap-1 py-2 text-center">
        <p className="flex-1 text-xs text-amber-50">
          {day === 'Today' ? day : dates[day]}
        </p>
        <div className="margin-0 flex-1 self-center">
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

type WeatherCardProps = {
  sites: Site[];
};

const WeatherCard: FC<WeatherCardProps> = ({ sites }) => {
  const representativeSite = sites[0];
  const { totalForecastedGeneration, totalClearskyGeneration } =
    useSiteAggregation(sites);
  const { currentTime, dusk, dawn } = useSiteTime(representativeSite);
  if (totalForecastedGeneration && totalClearskyGeneration) {
    const [firstTotal, firstClearskyCapacity, firstDay] =
      GetExpectedOutputOverDay(
        dusk,
        dawn,
        0,
        totalForecastedGeneration,
        totalClearskyGeneration
      );

    const firstDayOrToday = firstDay === currentTime.day() ? 'Today' : firstDay;

    const [secondTotal, secondClearskyCapacity, secondDay] =
      GetExpectedOutputOverDay(
        dusk,
        dawn,
        1,
        totalForecastedGeneration,
        totalClearskyGeneration
      );

    const [thirdTotal, thirdClearskyCapacity, thirdDay] =
      GetExpectedOutputOverDay(
        dusk,
        dawn,
        2,
        totalForecastedGeneration,
        totalClearskyGeneration
      );

    return (
      <div className="flex flex-row justify-evenly rounded-2xl bg-ocf-black-500">
        {getWeatherDisplay(firstClearskyCapacity, firstTotal, firstDayOrToday)}
        {getWeatherDisplay(secondClearskyCapacity, secondTotal, secondDay)}
        {thirdTotal != 0 &&
          getWeatherDisplay(thirdClearskyCapacity, thirdTotal, thirdDay)}
      </div>
    );
  }

  return (
    <div className="flex flex-row justify-around rounded-2xl bg-ocf-black-500 px-5">
      {new Array(3).fill(null).map((_, i) => (
        <div className="w-1/4 flex-col" key={i}>
          <div className="align-center flex h-[91px] w-full flex-col justify-center gap-1 py-2 text-center">
            <p className={`text-xs ${skeleton}`}>Loading...</p>
            <div className={skeleton}>
              <div className="h-[20px]"></div>
            </div>
            <p className={`text-xs ${skeleton}`}>Loading...</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WeatherCard;
