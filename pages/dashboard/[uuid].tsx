import { useRouter } from 'next/router';
import { withSites } from '~/lib/utils';
import Dashboard from '~/components/Dashboard';
import { useSiteData } from '~/lib/hooks';
import { Site } from '~/lib/types';
import useNoScroll from '~/lib/hooks/useNoScroll';
import { useEffect, useState } from 'react';

const SiteDashboard = () => {
  const { query } = useRouter();
  const [persistedUUID, setPersistedUUID] = useState(query.uuid);

  useEffect(() => {
    if (query.uuid) {
      setPersistedUUID(query.uuid);
    }
  }, [query.uuid]);

  useNoScroll();
  
  const { siteData } = useSiteData(persistedUUID as string);
  const siteUUIDs = { site_list: [siteData as Site] };

  return <Dashboard siteUUIDs={siteUUIDs} />;
};

export default SiteDashboard;
export const getServerSideProps = withSites();
