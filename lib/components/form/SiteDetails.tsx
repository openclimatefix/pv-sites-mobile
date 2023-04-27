import { useRouter } from 'next/router';
import { FC, useState } from 'react';
import Location from '~/lib/components/form/Location';
import { useSites } from '../../sites';
import { Site } from '../../types';
import { useIsMobile } from '../../utils';
import { NowcastingLogo } from '../icons/NavbarIcons';
import BackButton from './BackButton';
import Details from './Details';
import { NavbarLink } from '../navigation/NavBar';

export enum Page {
  Details = 'Details',
  Location = 'Location',
}

interface SiteDetailsProps {
  site?: Site;
  isEditing?: boolean;
}

const SiteDetails: FC<SiteDetailsProps> = ({ site, isEditing = false }) => {
  const [page, setPage] = useState<Page>(
    isEditing ? Page.Details : Page.Location
  );
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
            isEditing={isEditing}
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
    <div className="w-full flex-col md:justify-center">
      <div className="flex h-[var(--nav-height)] w-full flex-row items-center justify-between bg-ocf-black px-5 md:justify-center md:py-2">
        <div className="md:hidden">
          {!(page === Page.Location && sites.length === 0) && (
            <BackButton onClick={lastPageCallback} />
          )}
        </div>
        <NowcastingLogo />
      </div>
      {isEditing && (
        <div className="flex w-full justify-center">
          <div className="mb-2 flex w-4/5 md:w-9/12 md:px-8">
            <NavbarLink
              title="Details"
              href={`/site-details/${site?.site_uuid}`}
            />
            <NavbarLink title="Inverters" href="/more-info" />
          </div>
        </div>
      )}
      {generateFormPage()}
    </div>
  );
};

export default SiteDetails;
