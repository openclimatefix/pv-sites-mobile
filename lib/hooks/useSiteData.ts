import useSWR from 'swr';
import { ClearSkyData, Site } from '../types';
import useSites from './useSites';
import { clearSkyFetcher, forecastFetcher } from './utils';

/**
 * Gets forecasted and solar panel data for a single site
 * @param siteUUID UUID corresponding to a single site
 * @returns forecasted and site data
 */
const useSiteData = (siteUUID: string) => {
  const { data: forecastData, error: forecastError } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL_GET}/sites/${siteUUID}/pv_forecast`,
    forecastFetcher
  );

  const { sites: siteListData, error: siteListError } = useSites();

  const { data: clearskyData, error: clearskyError } = useSWR<ClearSkyData>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL_GET}/sites/${siteUUID}/clearsky_estimate`,
    clearSkyFetcher
  );

  const error = AggregateError([forecastError, siteListError, clearskyError]);
  const isLoading = !siteListData || !forecastData || !clearskyData;

  const siteData: Site | undefined = siteListData
    ? siteListData.site_list.find((site) => site.site_uuid === siteUUID)
    : undefined;

  return { forecastData, clearskyData, ...siteData, error, isLoading };
};

export default useSiteData;
