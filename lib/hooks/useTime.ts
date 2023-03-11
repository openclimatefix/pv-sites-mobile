import { useEffect, useState } from 'react';
import { formatter } from '../utils';

const SunCalc = require('suncalc');

/**
 * Creates a hook more accessesing specific values like the current time, whether it is daytime
 * @param latitude, the latitude float value that is passed in
 * @param longitude, the longitude number value that is passed in
 * @returns currentTimeNoFilter, unfiltered version of the current time (right now) that a user can format
 * @returns isDaytime, boolean value indicating whether it is daytime or not based on current time zone.
 */
const useTime = (latitude: number, longitude: number) => {
  const [currentTimeNoFilter, setCurrentTimeNoFilter] = useState(Date.now());

  // get sunrise/sunset time fors passed in location
  const times = SunCalc.getTimes(Date.now(), latitude, longitude);
  const sunriseTime = times.sunrise;
  const sunsetTime = times.sunset;

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTimeNoFilter(Date.now());
    }, 1000);

    // clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId);
  });

  const isDaytime =
    currentTimeNoFilter >= sunriseTime && currentTimeNoFilter <= sunsetTime;

  return { currentTimeNoFilter, isDaytime };
};

export default useTime;
