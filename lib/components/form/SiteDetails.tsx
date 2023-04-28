import { useRouter } from 'next/router';
import { FC, useState } from 'react';
import Location from '~/lib/components/form/Location';
import { useSites } from '../../sites';
import { Site } from '../../types';
import Details from './Details';
import { NavbarLink } from '../navigation/NavBar';
import BackNav from '../navigation/BackNav';
import { useIsMobile } from '~/lib/utils';

export enum Page {
  Details = 'Details',
  Location = 'Location',
}

interface SiteDetailsProps {
  site?: Site;
}

const SiteDetails: FC<SiteDetailsProps> = ({ site }) => {
  const [page, setPage] = useState<Page>(site ? Page.Details : Page.Location);
  const isMobile = useIsMobile();
  const backUrl = isMobile ? '/sites' : '/dashboard';
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

  const editModeLastPageCallback = () => {
    if (page === Page.Location) {
      setPage(Page.Details);
    } else {
      router.push(backUrl);
    }
  };

  const nextPageCallback = (site?: Site) => {
    if (page === Page.Details) {
      router.push(mobile ? '/sites' : `/dashboard/${site?.site_uuid}`);
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
        lastPageCallback={!site ? lastPageCallback : editModeLastPageCallback}
      />
      {site && page == Page.Details && (
        <div className="flex w-full justify-center">
          <div className="mb-2 flex w-4/5 md:w-8/12">
            <NavbarLink
              title="Details"
              href={`/site-details/${site?.site_uuid}`}
            />
            <NavbarLink
              title="Inverters"
              href={`/inverters/edit/${site?.site_uuid}`}
            />
          </div>
        </div>
      )}
      {generateFormPage()}
    </div>
  );
};

export default SiteDetails;
