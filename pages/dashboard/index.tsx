import Dashboard from '~/components/Dashboard';
import { withSites } from '~/lib/utils';

// This will be temporary, just a temporary solution for now

const AggregateDashboard = () => {
  const testUUID = '725a8670-d012-474d-b901-1179f43e7182';
  return <Dashboard siteUUID={testUUID} />;
};

export default AggregateDashboard;
export const getServerSideProps = withSites({
  async getServerSideProps({ siteList }) {
    if (siteList.site_list.length === 1) {
      return {
        redirect: {
          permanent: false,
          destination: `/dashboard/${siteList.site_list[0].site_uuid}`,
        },
      };
    }
    return { props: { siteList } };
  },
});
