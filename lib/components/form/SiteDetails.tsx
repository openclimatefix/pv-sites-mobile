import { useRouter } from 'next/router';
import { FC, useState } from 'react';
import Location from '~/lib/components/form/Location';
import { useSites } from '../../sites';
import { Site } from '../../types';
import { useIsMobile } from '../../utils';
import { NowcastingLogo } from '../icons/NavbarIcons';
import BackButton from './BackButton';
import Details from './Details';

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

  const nextPageCallback = () => {
    if (page === Page.Details) {
      router.push(mobile ? '/sites' : '/dashboard');
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
      <div
        className={`flex h-[var(--nav-height)] w-full flex-row justify-between bg-ocf-black px-5 md:justify-center md:py-2`}
      >
        <div className="md:hidden">
          {!(page === Page.Location && sites.length === 0) && (
            <BackButton onClick={lastPageCallback} />
          )}
        </div>
        <NowcastingLogo />
        {sites?.length && <div className="h-10 w-10 flex-1 md:hidden" />}
      </div>
      {generateFormPage()}
    </div>
  );
};

export default SiteDetails;
