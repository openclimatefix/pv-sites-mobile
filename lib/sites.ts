import useSWR from 'swr';
import {
  actualsFetcher,
  clearSkyFetcher,
  forecastFetcher,
  manyActualsFetcher,
  manyClearskyDataFetcher,
  manyForecastDataFetcher,
} from './api';
import {
  ClearSkyData,
  ForecastData,
  GenerationDataPoint,
  Site,
  Inverters,
} from './types';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import {
  GetAccessTokenResult,
  getAccessToken,
  withPageAuthRequired,
} from '@auth0/nextjs-auth0';

export function useSites() {
  const {
    data: sites,
    error,
    isLoading,
  } = useSWR<{ site_list: Site[] }>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL_GET}/sites`
  );

  // TODO: Paginate this globally somehow. Right now there is too much site data being fetched on the aggregate dashboard
  return { sites: sites?.site_list?.slice(0, 5) ?? [], error, isLoading };
}

/**
 * Gets forecasted and solar panel data for a single site
 * @param siteUUID UUID corresponding to a single site
 * @returns forecasted and site data
 */
export function useSiteData(siteUUID: string) {
  const { sites, error: siteListError } = useSites();

  const { data: forecastData, error: forecastError } = useSWR<ForecastData>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL_GET}/sites/${siteUUID}/pv_forecast`,
    forecastFetcher
  );

  const { data: clearskyData, error: clearskyError } = useSWR<ClearSkyData>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL_GET}/sites/${siteUUID}/clearsky_estimate`,
    clearSkyFetcher
  );

  const { data: actualData, error: actualError } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL_GET}/sites/${siteUUID}/pv_actual`,
    actualsFetcher
  );

  const error = AggregateError([
    forecastError,
    siteListError,
    clearskyError,
    actualError,
  ]);

  const isLoading = !sites || !forecastData || !clearskyData || !actualData;

  const site = sites.find((siteData) => siteData.site_uuid === siteUUID);

  return {
    forecastData,
    clearskyData,
    actualData,
    site,
    error,
    isLoading,
  };
}

/**
 * Sums the capacity and forecasts of multiple solar sites across
 * all dates reported by the pv-sites API.
 * @param sites A list of sites
 * @return Aggregated predictions sorted by datetime
 */
export function useSiteAggregation(sites: Site[]) {
  const siteUUIDs = sites.map((site) => site.site_uuid);

  const {
    data: manyForecastData,
    error: manyForecastError,
    isLoading: isManyForecastLoading,
  } = useSWR(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL_GET
    }/sites/pv_forecast?site_uuids=${siteUUIDs.join(',')}`,
    manyForecastDataFetcher
  );

  const {
    data: manyClearskyData,
    error: manyClearskyError,
    isLoading: isManyClearskyLoading,
  } = useSWR(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL_GET
    }/sites/clearsky_estimate?site_uuids=${siteUUIDs.join(',')}`,
    manyClearskyDataFetcher
  );

  const {
    data: manyActualData,
    error: manyActualError,
    isLoading: isManyActualLoading,
  } = useSWR(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL_GET
    }/sites/pv_actual?site_uuids=${siteUUIDs.join(',')}`,
    manyActualsFetcher
  );

  const aggregateError = AggregateError([
    manyForecastError,
    manyActualError,
    manyClearskyError,
  ]);
  const isLoading =
    isManyForecastLoading || isManyClearskyLoading || isManyActualLoading;

  const totalInstalledCapacityKw = sites.reduce(
    (total, site) => total + (site.inverter_capacity_kw ?? 0),
    0
  );

  const aggregateForecastedGeneration =
    manyForecastData &&
    sumGenerationData(
      manyForecastData.map((forecastData) => forecastData.forecast_values)
    );
  const aggregateClearskyGeneration =
    manyClearskyData &&
    sumGenerationData(
      manyClearskyData.map((clearskyData) => clearskyData.clearsky_estimate)
    );
  const aggregateActualGeneration =
    manyActualData &&
    sumGenerationData(
      manyActualData.map((actualsData) => actualsData.pv_actual_values)
    );

  return {
    totalInstalledCapacityKw,
    aggregateForecastedGeneration,
    aggregateActualGeneration,
    aggregateClearskyGeneration,
    error: aggregateError,
    isLoading,
  };
}

function sumGenerationData(generations: GenerationDataPoint[][]) {
  let totalExpectedGeneration: GenerationDataPoint[] | undefined = undefined;

  const forecastMap = new Map<number, number>();

  for (let siteIdx = 0; siteIdx < generations.length; siteIdx++) {
    const siteForecastValues = generations[siteIdx];

    for (
      let forecastIdx = 0;
      forecastIdx < siteForecastValues.length;
      forecastIdx++
    ) {
      const { datetime_utc, generation_kw } = siteForecastValues[forecastIdx];

      const currentAggregatedGeneration =
        forecastMap.get(datetime_utc.getTime()) ?? 0;

      forecastMap.set(
        datetime_utc.getTime(),
        currentAggregatedGeneration + generation_kw
      );
    }
  }

  // Sort the aggregated forecasts based on datetime
  totalExpectedGeneration = Array.from(
    forecastMap,
    ([datetime_utc, generation_kw]) => {
      return {
        datetime_utc: new Date(datetime_utc),
        generation_kw,
      };
    }
  ).sort((a, b) => a.datetime_utc.getTime() - b.datetime_utc.getTime());

  return totalExpectedGeneration;
}

type WithSitesOptions = {
  getServerSideProps?: (
    ctx: GetServerSidePropsContext & { sites: Site[] }
  ) => Promise<GetServerSidePropsResult<any> | void>;
};

/**
 * This is a getServerSideProps wrapper that ensures that a user's sites are known server side.
 * We opted for this because knowing sites before hydration lets us prevent UI flashing,
 * which is prominent since large elements depend on sites being either 1 or more.
 */
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

      const { site_list: allSites } = (await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL_GET}/sites`,
        {
          headers: {
            Authorization: `Bearer ${accessToken.accessToken}`,
          },
          credentials: 'include',
        }
      ).then((res) => res.json())) as { site_list: Site[] };

      // TODO: Paginate this globally somehow. Right now there is too much site data being fetched on the aggregate dashboard
      const sites = allSites.slice(0, 5);

      const otherProps: any = await getServerSideProps?.({
        ...ctx,
        sites,
      });
      if (otherProps?.props instanceof Promise) {
        return {
          ...otherProps,
          props: otherProps.props.then((props: any) => ({
            ...props,
            sites,
          })),
        };
      }
      return { ...otherProps, props: { ...otherProps?.props, sites } };
    },
  });
}
