import Dashboard from '~/components/dashboard';
import { withSites } from '~/lib/utils';

const AggregateDashboard = () => {
  const testUUID = 'b97f68cd-50e0-49bb-a850-108d4a9f7b7e';
  return <Dashboard siteUUID={testUUID} />;
};

export default AggregateDashboard;
export const getServerSideProps = withSites();
