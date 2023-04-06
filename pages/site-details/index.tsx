import { FC } from 'react';
import { withSites } from '../../lib/utils';
import SiteDetails from '~/components/SiteDetails';

enum Page {
  Details = 'Details',
  Location = 'Location',
}

const NewSiteDetails: FC = () => {
  console.log('NewSiteDetails');
  return <SiteDetails />;
};

export default NewSiteDetails;
export const getServerSideProps = withSites();
