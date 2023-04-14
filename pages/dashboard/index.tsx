import { FC } from 'react';
import Dashboard from '~/components/Dashboard';
import { SiteList } from '~/lib/types';
import { withSites } from '~/lib/utils';

interface AggregateDashboardProps {
  siteList: SiteList;
}

const AggregateDashboard: FC<AggregateDashboardProps> = ({ siteList }) => {
  return <Dashboard siteUUIDs={siteList} />;
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
