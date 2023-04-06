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
  const dates = ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'];
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
    getTotalExpectedOutput(forecastData).toFixed(2),
    getTotalExpectedOutput(forecastData) / getTotalExpectedOutput(clearSkyData),
    dates[newDuskTime.getDay() - 1],
  ];
};

export const cloudyThreshold = 0.3;
export const sunnyThreshold = 0.7;

const WeatherCard: FC<WeatherProps> = ({ siteUUID }) => {
  const { forecastData, clearskyData, latitude, longitude } =
    useSiteData(siteUUID);
  const { duskTime, dawnTime } = useTime(latitude, longitude);
  if (forecastData && clearskyData && latitude && longitude) {
    const [total1, diff1] = GetExpectedOutputOverDay(
      duskTime,
      dawnTime,
      0,
      forecastData.forecast_values,
      clearskyData.clearsky_estimate
    );

    const [total2, diff2, date2] = GetExpectedOutputOverDay(
      duskTime,
      dawnTime,
      24,
      forecastData.forecast_values,
      clearskyData.clearsky_estimate
    );

    const [total3, diff3, date3] = GetExpectedOutputOverDay(
      duskTime,
      dawnTime,
      48,
      forecastData.forecast_values,
      clearskyData.clearsky_estimate
    );

    // const diff4 = GetExpectedOutputOverDay(
    //   longitude,
    //   latitude,
    //   72,
    //   forecastData.forecast_values,
    //   clearskyData.clearsky_estimate
    // );

    return (
      <div className="bg-ocf-black-500 flex flex-row rounded-2xl px-5">
        <div className="flex-1 flex-col">
          <div className="w-full flex flex-col justify-center align-center text-center py-5 gap-1">
            <p className="flex-1 text-xs text-ocf-yellow-50">Today</p>
            <div className="flex-1 self-center margin-0">
              {diff1 < cloudyThreshold ? (
                <CloudyIcon />
              ) : diff1 > sunnyThreshold ? (
                <SunnyIcon />
              ) : (
                <PartlyCloudyIcon />
              )}
            </div>
            <p className="flex-1 text-xs text-ocf-yellow-500">{total1} kWh</p>
          </div>
        </div>
        <div className="flex-1 flex-col">
          <div className="w-full flex flex-col justify-center align-center text-center py-5 gap-1">
            <p className="flex-1 text-xs text-ocf-yellow-50">{date2}</p>
            <div className="flex-1 self-center margin-0">
              {diff2 < cloudyThreshold ? (
                <CloudyIcon />
              ) : diff2 > sunnyThreshold ? (
                <SunnyIcon />
              ) : (
                <PartlyCloudyIcon />
              )}
            </div>
            <p className="flex-1 text-xs text-ocf-yellow-500">{total2} kWh</p>
          </div>
        </div>
        <div className="flex-1 flex-col">
          <div className="w-full flex flex-col justify-center align-center text-center py-5 gap-1">
            <p className="flex-1 text-xs text-ocf-yellow-50">{date3}</p>
            <div className="flex-1 self-center margin-0">
              {diff3 < cloudyThreshold ? (
                <CloudyIcon />
              ) : diff3 > sunnyThreshold ? (
                <SunnyIcon />
              ) : (
                <PartlyCloudyIcon />
              )}
            </div>
            <p className="flex-1 text-xs text-ocf-yellow-500">{total3} kWh</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default WeatherCard;
