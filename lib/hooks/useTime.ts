import { useEffect, useState } from 'react';
import { formatter } from '../utils';

const useTime = () => {
  const [currentTime, setCurrentTime] = useState(formatter.format(Date.now()));

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(formatter.format(Date.now()));
    }, 1000);

    // clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId);
  });

  return currentTime;
};

export default useTime;
