import useSWR from 'swr';
import { ClearSkyData } from '../types';
import useSites from './useSites';
import {
  actualsFetcher,
  clearSkyFetcher,
  forecastFetcher,
  invertersFetcher,
} from './utils';

/**
 * Gets forecasted and solar panel data for a single site
 * @param siteUUID UUID corresponding to a single site
 * @returns forecasted and site data
 */
const useSiteData = (siteUUID: string) => {
  const { sites: siteListData, error: siteListError } = useSites();

  const { data: forecastData, error: forecastError } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL_GET}/sites/${siteUUID}/pv_forecast`,
    forecastFetcher
  );

  const { data: clearskyData, error: clearskyError } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL_GET}/sites/${siteUUID}/clearsky_estimate`,
    clearSkyFetcher
  );

  const { data: actualData, error: actualError } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL_GET}/sites/${siteUUID}/pv_actual`,
    actualsFetcher
  );

  const { data: inverterData, error: inverterError } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL_GET}/sites/${siteUUID}/inverters`,
    invertersFetcher
  );

  const error = AggregateError([
    forecastError,
    siteListError,
    clearskyError,
    actualError,
  ]);
  const isLoading = !siteListData || !forecastData || !clearskyData;

  const siteData = siteListData?.find((site) => site.site_uuid === siteUUID);

  return {
    forecastData,
    clearskyData,
    actualData,
    ...siteData,
    siteData,
    inverterData,
    error,
    isLoading,
  };
};

export default useSiteData;
