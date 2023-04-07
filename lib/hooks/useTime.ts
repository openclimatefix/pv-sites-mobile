import { useEffect, useState, useMemo } from 'react';
const SunCalc = require('suncalc');

type UseTimeOptions = {
  updateEnabled: boolean;
};

const defaultUseTimeOptions = {
  updateEnabled: true,
};
/**
 * Creates a hook more accessesing specific values like the current time, whether it is daytime
 * @param latitude, the latitude float value that is passed in
 * @param longitude, the longitude number value that is passed in
 * @returns currentTimes, version of the current time (right now) that a user can format
 * @returns isDayTime, boolean value indicating whether it is daytime or not based on current time zone.
 * @returns duskTime, date representing the dusk time at latitude, longitude
 * @returns dawnTime, date representing the dawn time at latitude, longitude
 */
const useTime = (
  latitude?: number,
  longitude?: number,
  { updateEnabled = false }: UseTimeOptions = defaultUseTimeOptions
) => {
  const [currentTime, setCurrentTime] = useState(Date.now());

  /**
   * @returns 12:00 AM GMT-05 of the next day
   */
  const getNextDay = () => {
    const nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 1);
    nextDay.setHours(0, 0, 0, 0);
    return nextDay;
  };

  const times = useMemo(() => {
    if (!(latitude && longitude)) {
      return null;
    }

    let calculatedTimes = SunCalc.getTimes(new Date(), latitude, longitude);

    // If we are past dusk, then set the dusk and dawn time to the next day
    if (Date.now() >= calculatedTimes.dusk) {
      calculatedTimes = SunCalc.getTimes(getNextDay(), latitude, longitude);
    }

    return {
      duskTime: calculatedTimes.dusk,
      dawnTime: calculatedTimes.dawn,
    };
  }, [latitude, longitude]);

  const isDayTime = useMemo(
    () =>
      times !== null &&
      currentTime >= times.dawnTime.getTime() &&
      currentTime <= times.duskTime.getTime(),

    [currentTime, times]
  );

  useEffect(() => {
    if (updateEnabled) {
      const intervalId = setInterval(() => {
        setCurrentTime(Date.now());
      }, 1000);

      // clear interval on re-render to avoid memory leaks
      return () => clearInterval(intervalId);
    }
  }, [updateEnabled]);

  return { currentTime, isDayTime, ...times };
};

export default useTime;
