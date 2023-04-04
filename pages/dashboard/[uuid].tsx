import { useRouter } from 'next/router';
import { withSites } from '~/lib/utils';
import Dashboard from '~/components/Dashboard';
import { useSiteData } from '~/lib/hooks';
import { Site } from '~/lib/types';

const SiteDashboard = () => {
  const router = useRouter();
  const { uuid } = router.query;
  const { siteData } = useSiteData(uuid as string);
  const siteUUIDs = { site_list: [siteData as Site] };
  return <Dashboard siteUUIDs={siteUUIDs} />;
};

export default SiteDashboard;
export const getServerSideProps = withSites();
