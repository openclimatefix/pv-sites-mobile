import { useEffect, useState } from 'react';
import { formatter } from '../utils';

const SunCalc = require('suncalc');

const useTime = (latitude: number, longitude: number) => {
  const [currentTimeNoFilter, setCurrentTimeNoFilter] = useState(Date.now());

  // get sunrise/sunset info for london
  const times = SunCalc.getTimes(Date.now(), latitude, longitude);
  const sunriseTime = times.sunrise;
  const sunsetTime = times.sunset;
  console.log(sunriseTime);
  console.log(currentTimeNoFilter);
  console.log(sunsetTime);

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
