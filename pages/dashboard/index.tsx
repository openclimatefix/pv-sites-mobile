import { FC } from 'react';
import Dashboard from '~/components/Dashboard';
import { SiteList } from '~/lib/types';
import { withSites } from '~/lib/utils';

// This is the aggreagate dashboards

interface AggregateDashboardProps {
  siteList: SiteList;
}

const AggregateDashboard: FC<AggregateDashboardProps> = ({ siteList }) => {
  // const testUUID = '725a8670-d012-474d-b901-1179f43e7182';

  return <Dashboard siteUUIDs={siteList as string[]} />;
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
