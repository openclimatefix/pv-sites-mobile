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

  const times = useMemo(() => {
    // TODO: Maybe make this depend on `currentTime` to have it update
    // at a slower interval though...
    const calculatedTimes =
      latitude && longitude
        ? SunCalc.getTimes(new Date(), latitude, longitude)
        : null;

    if (calculatedTimes !== null) {
      return {
        duskTime: calculatedTimes.dusk,
        dawnTime: calculatedTimes.dawn,
      };
    }
    return null;
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
