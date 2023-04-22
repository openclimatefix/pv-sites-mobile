import { FC } from 'react';
import { withSites } from '../../lib/utils';
import SiteDetails from '~/components/SiteDetails';

const NewSiteDetails: FC = () => {
  return <SiteDetails />;
};

export default NewSiteDetails;
export const getServerSideProps = withSites();
