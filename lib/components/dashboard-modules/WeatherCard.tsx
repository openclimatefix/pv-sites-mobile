import { FC } from 'react';
import SunCalc from 'suncalc';
import {
  generationDataOverDateRange,
  getTotalExpectedOutput,
} from '~/lib/generation';
import { useSiteAggregation } from '~/lib/sites';
import { skeleton } from '~/lib/skeleton';
import { useSiteTime } from '~/lib/time';
import { GenerationDataPoint, Site } from '~/lib/types';
import { CloudyIcon, PartlyCloudyIcon, SunnyIcon } from '../icons';

const cloudyThreshold = 0.3;
const sunnyThreshold = 0.7;
const daysOfForecast = 3;

type WeatherCardProps = {
  sites: Site[];
};

const WeatherCard: FC<WeatherCardProps> = ({ sites }) => {
  const representativeSite = sites[0];

  const { totalForecastedGeneration, totalClearskyGeneration } =
    useSiteAggregation(sites);
  const { currentTime } = useSiteTime(representativeSite);

  const createDays = (
    totalForecastedGeneration: GenerationDataPoint[] | undefined,
    totalClearskyGeneration: GenerationDataPoint[] | undefined
  ) => {
    const days = [];
    for (let i = 0; i < daysOfForecast; i++) {
      const day = currentTime.add(i, 'days');

      const { sunrise, sunset } = SunCalc.getTimes(
        day.toDate(),
        representativeSite.latitude,
        representativeSite.longitude
      );

      if (!totalForecastedGeneration || !totalClearskyGeneration) {
        days.push(undefined);
        continue;
      }

      days.push({
        date: day,
        totalForecastedGeneration: getTotalExpectedOutput(
          generationDataOverDateRange(
            totalForecastedGeneration,
            sunrise,
            sunset
          )
        ),
        totalClearskyGeneration: getTotalExpectedOutput(
          generationDataOverDateRange(totalClearskyGeneration, sunrise, sunset)
        ),
      });
    }

    return days;
  };

  const renderDay = (
    day: NonNullable<ReturnType<typeof createDays>[number]>,
    index: number
  ) => {
    const generationPercentOfClearsky =
      day.totalForecastedGeneration / day.totalClearskyGeneration;

    let icon = <CloudyIcon />;
    if (generationPercentOfClearsky > cloudyThreshold) {
      icon = <PartlyCloudyIcon />;
    }
    if (generationPercentOfClearsky > sunnyThreshold) {
      icon = <SunnyIcon />;
    }

    return (
      <div className="flex-1 flex-col" key={index}>
        <div className="align-center flex w-full flex-col justify-center gap-1 py-2 text-center">
          <p className="flex-1 text-xs text-amber-50">
            {index === 0 ? 'Today' : day.date.format('ddd')}
          </p>
          <div className="margin-0 flex-1 self-center">{icon}</div>
          <p className="flex-1 text-xs text-amber">
            {day.totalForecastedGeneration.toFixed(2)} kWh
          </p>
        </div>
      </div>
    );
  };

  const renderSkeletonDay = (index: number) => (
    <div className="w-1/4 flex-col" key={index}>
      <div className="align-center flex h-[91px] w-full flex-col justify-center gap-1 py-2 text-center">
        <p className={`text-xs ${skeleton}`}>Loading...</p>
        <div className={skeleton}>
          <div className="h-[20px]"></div>
        </div>
        <p className={`text-xs ${skeleton}`}>Loading...</p>
      </div>
    </div>
  );

  const days = createDays(totalForecastedGeneration, totalClearskyGeneration);

  return (
    <div className="flex flex-row justify-around rounded-2xl bg-ocf-black-500">
      {days.map((day, i) => (day ? renderDay(day, i) : renderSkeletonDay(i)))}
    </div>
  );
};

export default WeatherCard;
