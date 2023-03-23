import Details from '~/components/form/Details';
import Location from '~/components/form/Location';
import { useRouter } from 'next/router';

import { FC, useState } from 'react';
import { withSites } from '../lib/utils';

enum Page {
  Details = 'Details',
  Location = 'Location',
}

interface Props {
  page: Page;
  setPage: (page: Page) => void;
}

const SiteDetailsDesktop: FC<Props> = ({ page, setPage }) => {
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

const SiteDetailsMobile: FC<Props> = ({ page, setPage }) => {
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
  const [page, setPage] = useState<Page>(Page.Location);
  return (
    <>
      <div className="md:hidden block">
        <SiteDetailsMobile page={page} setPage={setPage} />
      </div>
      <div className="md:block hidden w-full">
        <SiteDetailsDesktop page={page} setPage={setPage} />
      </div>
    </>
  );
};

export default SiteDetails;
export const getServerSideProps = withSites();
