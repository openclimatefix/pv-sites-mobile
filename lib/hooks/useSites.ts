import { SiteList } from '../types';
import useSWR from 'swr';

export default function useSites() {
  const {
    data: sites,
    error,
    isLoading,
  } = useSWR<SiteList>(`${process.env.NEXT_PUBLIC_API_BASE_URL_GET}/sites`);

  return { sites, error, isLoading };
}
