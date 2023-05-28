import { FC } from 'react';
import SiteDetails from '~/lib/components/form/SiteDetails';
import { withSites } from '~/lib/sites';

const NewSiteDetails = () => {
  return <SiteDetails />;
};

export default NewSiteDetails;
export const getServerSideProps = withSites();

NewSiteDetails.hideNav = true;
