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
import { Dayjs } from 'dayjs';

const cloudyThreshold = 0.3;
const sunnyThreshold = 0.7;
const daysOfForecast = 3;

/**
 * Creates a list of "day" objects to render, with a corresponding date,
 * aggregate forecasted generation, and aggregate clearsky generation
 * @param currentTime the current time
 * @param site the site, to get location
 * @param aggregateForecastedGeneration the aggregate forecast generation data
 * @param aggregateClearskyGeneration the aggregate clearsky generation data
 * @returns the list of day objects with necessary data for UI
 */
const createDays = (
  currentTime: Dayjs,
  site: Site,
  aggregateForecastedGeneration: GenerationDataPoint[] | undefined,
  aggregateClearskyGeneration: GenerationDataPoint[] | undefined
) => {
  const days = [];
  for (let i = 0; i < daysOfForecast; i++) {
    const day = currentTime.add(i, 'days');

    const { sunrise, sunset } = SunCalc.getTimes(
      day.toDate(),
      site.latitude,
      site.longitude
    );

    if (!aggregateForecastedGeneration || !aggregateClearskyGeneration) {
      days.push(undefined);
      continue;
    }

    days.push({
      date: day,
      aggregateForecastedGeneration: getTotalExpectedOutput(
        generationDataOverDateRange(
          aggregateForecastedGeneration,
          sunrise,
          sunset
        )
      ),
      aggregateClearskyGeneration: getTotalExpectedOutput(
        generationDataOverDateRange(
          aggregateClearskyGeneration,
          sunrise,
          sunset
        )
      ),
    });
  }

  return days;
};

type WeatherCardProps = {
  sites: Site[];
};

const WeatherCard: FC<WeatherCardProps> = ({ sites }) => {
  const representativeSite = sites[0];

  const { aggregateForecastedGeneration, aggregateClearskyGeneration } =
    useSiteAggregation(sites);
  const { currentTime } = useSiteTime(representativeSite);

  const renderDay = (
    day: NonNullable<ReturnType<typeof createDays>[number]>,
    index: number
  ) => {
    const generationPercentOfClearsky =
      day.aggregateForecastedGeneration / day.aggregateClearskyGeneration;

    let icon = <CloudyIcon />;
    if (generationPercentOfClearsky > cloudyThreshold) {
      icon = <PartlyCloudyIcon />;
    }
    if (generationPercentOfClearsky > sunnyThreshold) {
      icon = <SunnyIcon />;
    }

    return (
      <div className="fade-in flex-1 flex-col" key={index}>
        <div className="align-center flex w-full flex-col justify-center gap-1 py-2 text-center">
          <p className="flex-1 text-xs text-amber-50">
            {index === 0 ? 'Today' : day.date.format('ddd')}
          </p>
          <div className="margin-0 flex-1 self-center">{icon}</div>
          <p className="flex-1 text-xs text-amber">
            {day.aggregateForecastedGeneration.toFixed(2)} kWh
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

  const days = createDays(
    currentTime,
    representativeSite,
    aggregateForecastedGeneration,
    aggregateClearskyGeneration
  );

  return (
    <div className="flex flex-row justify-around rounded-lg bg-ocf-black-500">
      {days.map((day, i) => (day ? renderDay(day, i) : renderSkeletonDay(i)))}
    </div>
  );
};

export default WeatherCard;
