import useSWR from 'swr';
import { manyForecastDataFetcher } from './utils';
import { GenerationDataPoint, SiteList } from '../types';

/**
 * Sums the capacity and forecasts of multiple solar sites across
 * all dates reported by the pv-sites API.
 * @param allSiteUUID A list of UUIDs corresponding to multiple solar sites
 * @return Aggregated predictions sorted by datetime
 */
const useSiteAggregation = (allSiteUUID: string[]) => {
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
    }/sites/pv_forecast?site_uuids=${allSiteUUID.join(',')}`,
    manyForecastDataFetcher
  );

  const error = AggregateError([manyForecastError, siteListError]);
  const isLoading = isSiteListLoading || isManyForecastLoading;

  // Sum the installed capacity at all of the sites
  const totalInstalledCapacityKw = siteListData
    ? siteListData.site_list.reduce(
        (prevTotalSiteCapacity, newSite) =>
          prevTotalSiteCapacity + newSite.installed_capacity_kw,
        0
      )
    : undefined;

  let totalExpectedGeneration: GenerationDataPoint[] | undefined = undefined;
  console.log(manyForecastData);
  // Sum the expected generation for each date returned in all of the site forecasts
  if (manyForecastData) {
    console.log('entered');
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
      ([datetime_utc, generation_kw]) => ({
        datetime_utc: new Date(datetime_utc),
        generation_kw,
      })
    ).sort((a, b) => a.datetime_utc.getTime() - b.datetime_utc.getTime());
  }

  return {
    totalInstalledCapacityKw,
    totalExpectedGeneration,
    error,
    isLoading,
  };
};

export default useSiteAggregation;
