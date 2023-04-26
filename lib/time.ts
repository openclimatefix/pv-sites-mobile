import { useEffect, useState, useMemo } from 'react';
import SunCalc from 'suncalc';
import { Site } from './types';
import useSWR from 'swr';
import dayjs from 'dayjs';

type UseTimeOptions = {
  updateEnabled: boolean;
};

const defaultUseTimeOptions: UseTimeOptions = {
  updateEnabled: false,
};

/**
 * Gets time and sun position related information for a specific site.
 * Also, optionally creates an interval to update the current time.
 * @param site The site
 * @param updateEnabled Whether or not to create an interval to update the current time
 * @returns Time (in site timezone) and sun position related information
 */
export const useSiteTime = (
  site: Site,
  { updateEnabled = false } = defaultUseTimeOptions
) => {
  const { latitude, longitude } = site;
  const { data: timezone } = useSWR<string>(
    latitude && longitude ? ['/timezone', longitude, latitude] : null,
    () => fetchTimeZone(latitude, longitude)
  );
  const [currentTime, setCurrentTime] = useState(dayjs().tz(timezone));

  useEffect(() => setCurrentTime(dayjs().tz(timezone)), [timezone]);

  useEffect(() => {
    if (updateEnabled) {
      const interval = setInterval(
        () => setCurrentTime(dayjs().tz(timezone)),
        1000
      );

      return () => clearInterval(interval);
    }
  }, [updateEnabled, timezone]);

  const times = useMemo(
    () => SunCalc.getTimes(currentTime.toDate(), latitude, longitude),
    [currentTime, latitude, longitude]
  );

  const isDayTime = useMemo(
    () =>
      currentTime.isAfter(dayjs(times.sunrise)) &&
      currentTime.isBefore(dayjs(times.sunset)),
    [currentTime, times]
  );

  function timeFormat(date: dayjs.Dayjs | Date) {
    return dayjs(date).tz(timezone).format('h:mm A');
  }

  function dayFormat(date: dayjs.Dayjs | Date) {
    return dayjs(date).tz(timezone).format('M/DD');
  }

  function weekdayFormat(date: dayjs.Dayjs | Date) {
    return dayjs(date).tz(timezone).format('ddd h:mm A');
  }

  return {
    currentTime,
    isDayTime,
    timeFormat,
    dayFormat,
    weekdayFormat,
    timezone,
    ...times,
  };
};

/**
 * Gets the current timezone code based on a user's site location
 * @param lat the latitude value of the user's site (east positive)
 * @param long the longitude value of the user's site (north positive)
 * @returns the users timezone based on mapbox's API, this returns GMT otherwise
 */
const fetchTimeZone = async (latitude: number, longitude: number) => {
  const data = await fetch(
    `https://api.mapbox.com/v4/examples.4ze9z6tv/tilequery/${longitude},${latitude}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_PUBLIC}`
  ).then((res) => res.json());
  // Get the timezone from the resulting GeoJSON FeatureCollection
  // Europe/London is a default timezone for if the user's site location was not matched
  const userTimezone = data?.features[0]?.properties?.TZID ?? 'Europe/London';
  return userTimezone;
};
