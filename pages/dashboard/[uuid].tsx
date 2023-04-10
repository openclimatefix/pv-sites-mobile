import { useRouter } from 'next/router';
import { withSites } from '~/lib/utils';
import Dashboard from '~/components/Dashboard';
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

  return <Dashboard siteUUID={persistedUUID as string} />;
};

export default SiteDashboard;
export const getServerSideProps = withSites();
