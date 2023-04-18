import useSWR from 'swr';
import { manyClearskyDataFetcher, manyForecastDataFetcher } from './utils';
import {
  ClearSkyData,
  ForecastData,
  GenerationDataPoint,
  SiteList,
} from '../types';

const sumGenerationData = (
  data: GenerationDataPoint[][] | undefined
): GenerationDataPoint[] | undefined => {
  let totalExpectedGeneration: GenerationDataPoint[] | undefined = undefined;

  if (data) {
    const forecastMap = new Map<number, number>();

    for (let siteIdx = 0; siteIdx < data.length; siteIdx++) {
      const siteValues = data[siteIdx];

      for (
        let forecastIdx = 0;
        forecastIdx < siteValues.length;
        forecastIdx++
      ) {
        const { datetime_utc, generation_kw } = siteValues[forecastIdx];

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
  }

  return totalExpectedGeneration;
};

/**
 * Sums the capacity and forecasts of multiple solar sites across
 * all dates reported by the pv-sites API.
 * @param siteUUIDs A list of UUIDs corresponding to multiple solar sites
 * @return Aggregated predictions sorted by datetime
 */
const useSiteAggregation = (siteUUIDs: string[]) => {
  const {
    data: siteListData,
    error: siteListError,
    isLoading: isSiteListLoading,
  } = useSWR<SiteList>(`${process.env.NEXT_PUBLIC_API_BASE_URL_GET}/sites`);

  const sites = siteListData?.site_list?.filter((site) =>
    siteUUIDs.includes(site.site_uuid)
  );

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

  const aggregateError = AggregateError([
    manyForecastError,
    siteListError,
    manyClearskyError,
  ]);
  const isLoading =
    isSiteListLoading || isManyForecastLoading || isManyClearskyLoading;

  // Sum the installed capacity at all of the sites
  const totalInstalledCapacityKw = sites
    ? sites.reduce(
        (prevTotalSiteCapacity, newSite) =>
          prevTotalSiteCapacity + newSite.installed_capacity_kw,
        0
      )
    : undefined;

  let totalExpectedGeneration = sumGenerationData(
    manyForecastData?.map((f) => f.forecast_values)
  );
  let totalClearskyData = sumGenerationData(
    manyClearskyData?.map((c) => c.clearsky_estimate)
  );

  return {
    totalInstalledCapacityKw,
    totalExpectedGeneration,
    totalClearskyData,
    error: aggregateError,
    isLoading,
  };
};

export default useSiteAggregation;
