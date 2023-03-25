import useSWR from 'swr';
import { Site, SiteList } from '../types';
import { forecastFetcher } from './utils';

/**
 * Gets forecasted and solar panel data for a single site
 * @param siteUUID UUID corresponding to a single site
 * @returns forecasted and site data
 */
const useSiteData = (siteUUID: string) => {
  const {
    data: forecastData,
    error: forecastError,
    isLoading: isForecastLoading,
  } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL_GET}/sites/${siteUUID}/pv_forecast`,
    forecastFetcher
  );

  const {
    data: siteListData,
    error: siteListError,
    isLoading: isSiteListLoading,
  } = useSWR<SiteList>(`${process.env.NEXT_PUBLIC_API_BASE_URL_GET}/sites`);

  const error = AggregateError([forecastError, siteListError]);
  const isLoading = isSiteListLoading || isForecastLoading;

  const siteData: Site | undefined = siteListData
    ? siteListData.site_list.find((site) => site.site_uuid === siteUUID)
    : undefined;

  return { forecastData, ...siteData, error, isLoading };
};

export default useSiteData;
