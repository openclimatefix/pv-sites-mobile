import { useRouter } from 'next/router';
import { FC, useState } from 'react';
import Location from '~/lib/components/form/Location';
import { useSites } from '../../sites';
import { Site } from '../../types';
import Details from './Details';
import BackNav from '../navigation/BackNav';
import { useIsMobile } from '~/lib/utils';

enum Page {
  Details = 'Details',
  Location = 'Location',
}

interface SiteDetailsProps {
  site?: Site;
}

const SiteDetails: FC<SiteDetailsProps> = ({ site }) => {
  const [page, setPage] = useState<Page>(Page.Location);
  const mobile = useIsMobile();
  const router = useRouter();
  const { sites } = useSites();

  const lastPageCallback = () => {
    if (page === Page.Details) {
      setPage(Page.Location);
    } else {
      router.back();
    }
  };

  const nextPageCallback = (site?: Site) => {
    if (page === Page.Details) {
      // @TODO: redirect to error page if site not created
      router.push(`/link/${site?.site_uuid}`);
    } else {
      setPage(Page.Details);
    }
  };

  const generateFormPage = () => {
    switch (page) {
      case Page.Details:
        return (
          <Details
            lastPageCallback={lastPageCallback}
            nextPageCallback={nextPageCallback}
            site={site}
          />
        );
      case Page.Location:
        return (
          <Location
            nextPageCallback={nextPageCallback}
            lastPageCallback={lastPageCallback}
            latitude={site?.latitude}
            longitude={site?.longitude}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full md:flex-col md:justify-center">
      <BackNav
        backButton={!(page === Page.Location && sites.length === 0)}
        lastPageCallback={lastPageCallback}
      />
      {generateFormPage()}
    </div>
  );
};

export default SiteDetails;
