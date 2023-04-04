import {
  getAccessToken,
  GetAccessTokenResult,
  withPageAuthRequired,
} from '@auth0/nextjs-auth0';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { getCurrentTimeGenerationIndex } from './graphs';
import { GenerationDataPoint, SiteList } from './types';
import { start } from 'repl';

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

interface MinMaxInterface {
  type: 'min' | 'max' | 'constant';
  index: number;
}

/**
 * Determines the next local minimum or maximum value in a generation array
 * @param array Array to search for a local minimum or maximum value
 * @param key The key that represents the values being compared in array
 * @param startIndex The index to start the search at
 * @returns The index of the next minimum or maximum value
 */
export const getArrayMaxOrMinAfterIndex = (
  array: GenerationDataPoint[],
  startIndex: number
): MinMaxInterface | null => {
  if (startIndex === array.length - 1) {
    return {
      type: 'min',
      index: startIndex,
    };
  }

  const first = array[startIndex].generation_kw;
  const second = array[startIndex + 1].generation_kw;

  const firstDifference = second - first;
  const firstSlopeSign = Math.sign(firstDifference);

  startIndex += 1;

  while (startIndex < array.length - 1) {
    const prev = array[startIndex - 1].generation_kw;
    const curr = array[startIndex].generation_kw;

    const currentDifference = curr - prev;
    const currentSlopeSign = Math.sign(currentDifference);

    if (firstSlopeSign !== currentSlopeSign && currentSlopeSign !== 0) {
      // Slope was constant until current index
      if (firstSlopeSign === 0) {
        return { type: 'constant', index: startIndex };
      }

      // Slope was negative or positive until current index
      return {
        type: firstSlopeSign < currentSlopeSign ? 'min' : 'max',
        index: startIndex,
      };
    }

    startIndex += 1;
  }

  return {
    type: firstSlopeSign < 0 ? 'min' : 'max',
    index: startIndex,
  };
};

export const getCurrentTimeGeneration = (
  generationData: GenerationDataPoint[]
) =>
  generationData[getCurrentTimeGenerationIndex(generationData)].generation_kw;

interface NextThreshold {
  aboveThreshold: boolean;
  index: number;
}

/**
 * Determines the hour difference between the current time and the next time we are above or below
 * the sunny threshold
 * @param generationData expected generation data (kilowatts) at specific times
 * @param threshold sunny threshold in kilowatts
 * @returns Object containing hour difference between the next date and
 * if this date is above or below the threshold
 */
export const getNextThresholdIndex = (
  generationData: GenerationDataPoint[],
  threshold: number
): NextThreshold | null => {
  const startIndex = getCurrentTimeGenerationIndex(generationData);

  const currentAboveThreshold =
    generationData[startIndex].generation_kw >= threshold;

  for (let i = startIndex; i < generationData.length; i++) {
    const futureAboveThreshold = generationData[i].generation_kw >= threshold;
    // If this future point's "aboveThreshold" state is different than current
    if (futureAboveThreshold !== currentAboveThreshold) {
      return {
        aboveThreshold: futureAboveThreshold,
        index: i,
      };
    }
  }

  return null;
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
      let accessToken: GetAccessTokenResult;
      try {
        accessToken = await getAccessToken(ctx.req, ctx.res);
      } catch {
        return {
          redirect: {
            destination: '/api/auth/login',
          },
        };
      }

      const siteList = (await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL_GET}/sites`,
        {
          headers: {
            Authorization: `Bearer ${accessToken.accessToken}`,
          },
        }
      ).then((res) => res.json())) as SiteList;

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
export const zoomLevelThreshold = 14;
