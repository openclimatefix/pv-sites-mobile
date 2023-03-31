import Details from '~/components/form/Details';
import Location from '~/components/form/Location';
import { useRouter } from 'next/router';

import { FC, useState } from 'react';
import { withSites } from '../../lib/utils';

enum Page {
  Details = 'Details',
  Location = 'Location',
}

const SiteDetails: FC = () => {
  const [page, setPage] = useState<Page>(Page.Location);
  const router = useRouter();

  const generateFormPage = () => {
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

  return (
    <div className="md:w-full md:justify-center md:flex-col">
      {generateFormPage()}
    </div>
  );
};

export default SiteDetails;
export const getServerSideProps = withSites();
