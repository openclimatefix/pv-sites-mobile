const siteUUID = 'b97f68cd-50e0-49bb-a850-108d4a9f7b7e';
import useSWR from 'swr';
import { forecastFetcher } from '../utils';

const useFutureGraphData = () =>
  useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sites/pv_forecast/${siteUUID}`,
    forecastFetcher
  );

export default useFutureGraphData;
