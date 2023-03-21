import Details from '~/components/form/Details';
import Location from '~/components/form/Location';
import { useRouter } from 'next/router';

import { FC, useState } from 'react';
import { withSites } from '../lib/utils';

enum Page {
  Details = 'Details',
  Location = 'Location',
}

const SiteDetailsDesktop: FC = () => {
  const [page, setPage] = useState<Page>(Page.Location);
  const router = useRouter();

  switch (page) {
    case Page.Details:
      return (
        <Details
          lastPageCallback={() => setPage(Page.Location)}
          nextPageCallback={() => router.push('sites')}
        />
      );
    case Page.Location:
      return <Location nextPageCallback={() => setPage(Page.Details)} />;
    default:
      return null;
  }
};

const SiteDetailsMobile: FC = () => {
  const [page, setPage] = useState<Page>(Page.Location);
  const router = useRouter();

  switch (page) {
    case Page.Details:
      return (
        <Details
          lastPageCallback={() => setPage(Page.Location)}
          nextPageCallback={() => router.push('sites')}
        />
      );
    case Page.Location:
      return <Location nextPageCallback={() => setPage(Page.Details)} />;
    default:
      return null;
  }
};

const SiteDetails: FC = () => {
  return (
    <>
      <div className="md:hidden block">
        <SiteDetailsMobile />
      </div>
      <div className="md:block hidden">
        <SiteDetailsDesktop />
      </div>
    </>
  );
};

export default SiteDetails;
export const getServerSideProps = withSites();
