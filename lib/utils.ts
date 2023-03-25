import { getAccessToken, withPageAuthRequired } from '@auth0/nextjs-auth0';
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  GetServerSideProps,
} from 'next';
import { ForecastDataPoint, SiteList } from './types';
import { getCurrentTimeForecastIndex } from './graphs';

/**
 * Turn a HTML element ID string (an-element-id) into camel case (anElementId)
 * @param id the HTML element id
 * @returns the id in camel case
 */
export function camelCaseID(id: string) {
  const [first, ...rest] = id.split('-');
  const capitalize = (part: string) =>
    part[0].toUpperCase() + part.substring(1);
  return [first, ...rest.map(capitalize)].join('');
}

export enum Value {
  Min = 'Minimum',
  Max = 'Maximum',
}
interface MinMaxInterface {
  type: Value;
  number: number;
}

/**
 * Determines the next local minimum or maximum value in an array given a start index
 * @param array Array to search for a local minimum or maximum value
 * @param key The key that represents the values being compared in array
 * @param startIndex The index to start the search at
 * @returns The index of the next minimum or maximum value
 */
export const getArrayMaxOrMinAfterIndex = (
  array: Record<string, any>,
  key: string,
  startIndex: number
): MinMaxInterface | null => {
  if (startIndex === array.length - 1) {
    return {
      type: Value.Min,
      number: startIndex,
    };
  }

  startIndex += 1;

  while (startIndex < array.length) {
    const currentExpectedGenerationKW = array[startIndex][key];
    const previousExpectedGenerationKW = array[startIndex - 1][key];

    if (startIndex === array.length - 1) {
      if (currentExpectedGenerationKW > previousExpectedGenerationKW) {
        return {
          type: Value.Max,
          number: startIndex,
        };
      } else if (currentExpectedGenerationKW < previousExpectedGenerationKW) {
        return {
          type: Value.Min,
          number: startIndex,
        };
      }
    } else {
      const nextExpectedGenerationKW = array[startIndex + 1][key];

      if (
        currentExpectedGenerationKW > previousExpectedGenerationKW &&
        currentExpectedGenerationKW > nextExpectedGenerationKW
      ) {
        return {
          type: Value.Max,
          number: startIndex,
        };
      } else if (
        currentExpectedGenerationKW < previousExpectedGenerationKW &&
        currentExpectedGenerationKW < nextExpectedGenerationKW
      ) {
        return {
          type: Value.Min,
          number: startIndex,
        };
      }
    }
    startIndex += 1;
  }
  return null;
};

export const getCurrentTimeForecast = (forecast_values: ForecastDataPoint[]) =>
  forecast_values[getCurrentTimeForecastIndex(forecast_values)]
    .expected_generation_kw;

/** Returns the difference in hours between two epoch times */
const findHourDifference = (date1: number, date2: number): number =>
  Math.abs(new Date(date1).getTime() - new Date(date2).getTime()) / 36e5;

interface NextThresholdInterface {
  aboveThreshold: boolean;
  number: number;
}

/**
 * Determines the hour difference between the current time and the next time we are above or below
 * the sunny threshold
 * @param forecast_values expected generated forecast values (kilowatts) at specific times
 * @param threshold sunny threshold in kilowatts
 * @returns Object containing hour difference between the next date and
 * if this date is above or below the threshold
 */
export const getNextThresholdIndex = (
  forecast_values: ForecastDataPoint[],
  threshold: number
): NextThresholdInterface => {
  let startIndex = getCurrentTimeForecastIndex(forecast_values);
  let currentIndex =
    startIndex + 1 < forecast_values.length ? startIndex + 1 : startIndex;

  const operator =
    forecast_values[currentIndex].expected_generation_kw >= threshold ? -1 : 1;

  const aboveThreshold =
    forecast_values[currentIndex].expected_generation_kw < threshold
      ? true
      : false;

  while (currentIndex < forecast_values.length) {
    const thresholdDifference =
      forecast_values[currentIndex].expected_generation_kw - threshold;
    if (operator * thresholdDifference > 0) {
      return {
        aboveThreshold,
        number: findHourDifference(
          forecast_values[currentIndex].target_datetime_utc,
          forecast_values[startIndex].target_datetime_utc
        ),
      };
    }
    currentIndex += 1;
  }
  return {
    aboveThreshold,
    number: findHourDifference(
      forecast_values[currentIndex - 1].target_datetime_utc,
      forecast_values[startIndex].target_datetime_utc
    ),
  };
};

/* Represents the threshold for the graph */
export const graphThreshold = 0.7;

/* Latitude/longitude for London, England */
export const originalLat = 51.5072;
export const originalLng = 0.1276;

type WithSitesOptions = {
  getServerSideProps?: (
    ctx: GetServerSidePropsContext & { siteList: SiteList }
  ) => Promise<GetServerSidePropsResult<{ siteList: SiteList }>>;
};
export function withSites({ getServerSideProps }: WithSitesOptions = {}) {
  return withPageAuthRequired({
    async getServerSideProps(ctx) {
      const accessToken = getAccessToken(ctx.req, ctx.res);

      const siteList = (await fetch(`${process.env.AUTH0_BASE_URL}/api/sites`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }).then((res) => res.json())) as SiteList;

      const otherProps: any = await getServerSideProps?.({
        ...ctx,
        siteList,
      });
      if (otherProps?.props instanceof Promise) {
        return {
          ...otherProps,
          props: otherProps.props.then((props: any) => ({
            ...props,
            siteList,
          })),
        };
      }
      return { ...otherProps, props: { ...otherProps?.props, siteList } };
    },
  });
}

/*
  Represents the zoom threshold for the Site map. 
  We will track solar sites when the map is zoomed in less than this value.
*/
export const zoomLevelThreshold = 10;
