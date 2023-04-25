import { FC } from 'react';
import Dashboard from '~/lib/components/Dashboard';
import { withSites } from '~/lib/sites';
import { Site } from '~/lib/types';

interface AggregateDashboardProps {
  sites: Site[];
}

const AggregateDashboard: FC<AggregateDashboardProps> = ({ sites }) => {
  return <Dashboard sites={sites} />;
};

export default AggregateDashboard;
export const getServerSideProps = withSites({
  async getServerSideProps({ sites }) {
    if (sites.length === 1) {
      return {
        redirect: {
          permanent: false,
          destination: `/dashboard/${sites[0].site_uuid}`,
        },
      };
    }
  },
});
