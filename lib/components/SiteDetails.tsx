import { useRouter } from 'next/router';
import { FC, useState } from 'react';
import Location from '~/lib/components/form/Location';
import Details from './form/Details';
import { NowcastingLogo } from './icons/NavbarIcons';
import BackButton from './BackButton';
import { useSiteData, useSites } from '../sites';
import { Site } from '../types';

enum Page {
  Details = 'Details',
  Location = 'Location',
}

interface SiteDetailsProps {
  site?: Site;
}

const SiteDetails: FC<SiteDetailsProps> = ({ site }) => {
  const [page, setPage] = useState<Page>(Page.Location);

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
      router.push('sites');
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
        {sites?.length && <BackButton onClick={lastPageCallback} />}
        <NowcastingLogo />
        {sites?.length && <div className="h-10 w-10 flex-1 md:hidden" />}
      </div>
      {generateFormPage()}
    </div>
  );
};

export default SiteDetails;
