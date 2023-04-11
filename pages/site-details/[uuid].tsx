import { FC } from 'react';
import { withSites } from '../../lib/utils';
import SiteDetails from '../../components/SiteDetails';
import { useRouter } from 'next/router';

const NewSiteDetails: FC = () => {
  const router = useRouter();
  const { uuid } = router.query;
  return <SiteDetails uuid={uuid as string} />;
};

export default NewSiteDetails;
export const getServerSideProps = withSites();
