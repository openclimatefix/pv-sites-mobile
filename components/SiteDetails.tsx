import { useRouter } from 'next/router';
import { FC, useState } from 'react';
import Location from '~/components/form/Location';
import Details from './form/Details';
import { Site } from '~/lib/types';
import { useSiteData } from '~/lib/hooks';
import { NowcastingLogo } from './icons/NavbarIcons';
import BackButton from './BackButton';
import { useUser } from '@auth0/nextjs-auth0';
import useSites from '~/lib/hooks/useSites';

enum Page {
  Details = 'Details',
  Location = 'Location',
}

interface SiteDetailsProps {
  uuid?: string;
}

const SiteDetails: FC<SiteDetailsProps> = ({ uuid }) => {
  const [page, setPage] = useState<Page>(Page.Location);
  const siteData = useSiteData(uuid!);
  const { longitude, latitude } = siteData || {};

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
            uuid={uuid}
          />
        );
      case Page.Location:
        return (
          <Location
            nextPageCallback={nextPageCallback}
            longitude={longitude}
            latitude={latitude}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full md:justify-center md:flex-col">
      <div
        className={`bg-ocf-black w-full h-[var(--nav-height)] flex flex-row justify-between md:justify-center px-5 md:py-2`}
      >
        {sites?.length && <BackButton onClick={lastPageCallback} />}
        <NowcastingLogo />
        {sites?.length && <div className="w-10 h-10 flex-1 md:hidden" />}
      </div>
      {generateFormPage()}
    </div>
  );
};

export default SiteDetails;
