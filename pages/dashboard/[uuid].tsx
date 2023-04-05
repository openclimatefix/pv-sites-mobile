import { useRouter } from 'next/router';
import { withSites } from '~/lib/utils';
import Dashboard from '~/components/Dashboard';

const SiteDashboard = () => {
  const router = useRouter();
  const { uuid } = router.query;
  return <Dashboard siteUUID={uuid as string} />;
};

export default SiteDashboard;
export const getServerSideProps = withSites();
