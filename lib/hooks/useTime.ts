import { useEffect, useState } from 'react';
import { formatter } from '../utils';

const SunCalc = require('suncalc');

/**
 * Creates a hook more accessesing specific values like the current time, whether it is daytime
 * @param latitude, the latitude float value that is passed in
 * @param longitude, the longitude number value that is passed in
 * @returns currentTimes, unfiltered version of the current time (right now) that a user can format
 * @returns isDaytime, boolean value indicating whether it is daytime or not based on current time zone.
 */
const useTime = (latitude: number, longitude: number) => {
  const [currentTime, setCurrentTime] = useState(Date.now());

  // get sunrise/sunset time for passed in location
  const times = SunCalc.getTimes(Date.now(), latitude, longitude);
  const sunriseTime = times.sunrise;
  const sunsetTime = times.sunset;

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    // clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId);
  });

  const isDaytime = currentTime >= sunriseTime && currentTime <= sunsetTime;

  return { currentTime, isDaytime };
};

export default useTime;
