import { useEffect, useState } from 'react';
import useSiteData from './useSiteData';

/**
 * Gets the current timezone code based on a user's site location
 * @param long the longitude value of the user's site (north positive)
 * @param lat the latitude value of the user's site (east positive)
 * @returns the users timezone based on mapbox's API, this returns GMT otherwise
 */

const fetchTimeZone = async (long: number, lat: number) => {
  const query = await fetch(
    `https://api.mapbox.com/v4/examples.4ze9z6tv/tilequery/${long},${lat}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_PUBLIC}`,
    { method: 'GET' }
  );
  const data = await query.json();
  // get the timezone from the resulting GeoJSON FeatureCollection
  // temporary fix - Europe/London is a default timezone for if the user's site location was not matched
  const userTimezone = data?.features[0]?.properties?.TZID ?? 'Europe/London';
  return userTimezone;
};

const useDateFormatter = (siteUUID: string) => {
  const { longitude, latitude } = useSiteData(siteUUID);
  const [timezone, setTimezone] = useState(undefined);

  useEffect(() => {
    const wrapper = async () => {
      if (longitude != undefined && latitude != undefined) {
        setTimezone(await fetchTimeZone(longitude, latitude));
      }
    };
    wrapper();
  }, [longitude, latitude]);

  const timeFormatter = new Intl.DateTimeFormat(['en-US', 'en-GB'], {
    hour: 'numeric',
    minute: 'numeric',
    timeZone: timezone,
  });

  const weekdayFormatter = new Intl.DateTimeFormat(['en-US', 'en-GB'], {
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    timeZone: timezone,
  });

  return { timezone, timeFormatter, weekdayFormatter };
};

export default useDateFormatter;
