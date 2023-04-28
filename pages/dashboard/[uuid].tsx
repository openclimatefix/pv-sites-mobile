import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Dashboard from '~/lib/components/Dashboard';
import { useSiteData, withSites } from '~/lib/sites';
import { useNoScroll } from '~/lib/utils';
import { useAppContext } from '~/lib/provider';

const SiteDashboard = () => {
  const { query } = useRouter();
  const [persistedUUID, setPersistedUUID] = useState(query.uuid);
  const { setPrevDashboardUUID } = useAppContext();

  // Handles this page's transition effect
  useEffect(() => {
    if (query.uuid) {
      setPersistedUUID(query.uuid);
      setPrevDashboardUUID(query.uuid as string);
    }
  }, [query.uuid, setPrevDashboardUUID]);

  useNoScroll();

  const { site } = useSiteData(persistedUUID as string);
  return <Dashboard sites={[site!]} />;
};

export const getServerSideProps = withSites({
  async getServerSideProps(ctx) {
    const { sites, query } = ctx;
    if (!sites.map((site) => site.site_uuid).includes(query.uuid as string)) {
      return {
        notFound: true,
      };
    }
  },
});

export default SiteDashboard;
