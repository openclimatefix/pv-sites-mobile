import { useEffect, useState } from 'react';

export default function useMediaQuery(query: string) {
  const matchMedia = (query: string) => {
    if (typeof window === 'undefined') {
      return { matches: false };
    }
    return window.matchMedia(query);
  };

  const [matches, setMatches] = useState(matchMedia(query).matches);

  useEffect(() => {
    const mediaQueryList = matchMedia(query);

    if (!('addEventListener' in mediaQueryList)) return;

    const onChange = (mediaQueryList: MediaQueryListEvent) => {
      setMatches(mediaQueryList.matches);
    };

    mediaQueryList.addEventListener('change', onChange);
    return () => mediaQueryList.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}
