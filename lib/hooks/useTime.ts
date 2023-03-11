import { useEffect, useState } from 'react';
import { formatter } from '../utils';

const useTime = () => {
  const SunCalc = require('suncalc');
  const [currentTime, setCurrentTime] = useState(formatter.format(Date.now()));
  const [currentTimeNoFilter, setCurrentTimeNoFilter] = useState(Date.now());
  const [isDaytime, setIsDaytime] = useState(false);
  // get sunrise/sunset info for london
  const times = SunCalc.getTimes(Date.now(), 51.5, -0.1);
  const sunriseTime = times.sunrise;
  const sunsetTime = times.sunset;

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(formatter.format(Date.now()));
      setCurrentTimeNoFilter(Date.now());
      if (
        currentTimeNoFilter < sunriseTime ||
        currentTimeNoFilter > sunsetTime
      ) {
        setIsDaytime(false);
      } else {
        setIsDaytime(true);
      }
    }, 1000);

    // clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId);
  });

  return [currentTime, isDaytime];
};

export default useTime;
