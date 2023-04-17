import useSWR from 'swr';
import { manyClearskyDataFetcher, manyForecastDataFetcher } from './utils';
import {
  ClearSkyData,
  ForecastData,
  GenerationDataPoint,
  SiteList,
} from '../types';

const expectedGenerationSum = (
  manyForecastData: ForecastData[] | undefined
) => {
  let totalExpectedGeneration: GenerationDataPoint[] | undefined = undefined;

  if (manyForecastData) {
    const forecastMap = new Map<number, number>();

    for (let siteIdx = 0; siteIdx < manyForecastData.length; siteIdx++) {
      const siteForecastValues = manyForecastData[siteIdx].forecast_values;

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
  }

  return totalExpectedGeneration;
};

const expectedClearskySum = (manyClearskyData: ClearSkyData[] | undefined) => {
  let totalExpectedGeneration: GenerationDataPoint[] | undefined = undefined;

  if (manyClearskyData) {
    const forecastMap = new Map<number, number>();

    for (let siteIdx = 0; siteIdx < manyClearskyData.length; siteIdx++) {
      const siteClearskyValues = manyClearskyData[siteIdx].clearsky_estimate;

      for (
        let forecastIdx = 0;
        forecastIdx < siteClearskyValues.length;
        forecastIdx++
      ) {
        const { datetime_utc, generation_kw } = siteClearskyValues[forecastIdx];

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
    }/sites/pv_clearsky?site_uuids=${siteUUIDs.join(',')}`,
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
  const totalInstalledCapacityKw = siteListData
    ? siteListData.site_list
        .filter((site) => siteUUIDs.includes(site.site_uuid))
        .reduce(
          (prevTotalSiteCapacity, newSite) =>
            prevTotalSiteCapacity + newSite.installed_capacity_kw,
          0
        )
    : undefined;

  let totalExpectedGeneration = expectedGenerationSum(manyForecastData);
  let totalClearskyData = expectedClearskySum(manyClearskyData);

  return {
    totalInstalledCapacityKw,
    totalExpectedGeneration,
    totalClearskyData,
    error: aggregateError,
    isLoading,
  };
};
export default useSiteAggregation;
