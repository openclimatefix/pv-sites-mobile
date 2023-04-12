import { useRouter } from 'next/router';
import useSites from './useSites';

export function useIsSitePage() {
  const { asPath } = useRouter();
  const { sites } = useSites();

  const isSitePage =
    (sites?.length ?? 0) > 1 && asPath.match(/\/dashboard\/.+/);

  return isSitePage;
}
