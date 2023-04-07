import { useRouter } from 'next/router';
import { FC, useState } from 'react';
import Location from '~/components/form/Location';
import Details from './form/Details';
import { Site } from '~/lib/types';
import { useSiteData } from '~/lib/hooks';

enum Page {
  Details = 'Details',
  Location = 'Location',
}

interface SiteDetailsProps {
  uuid?: string;
}

const SiteDetails: FC<SiteDetailsProps> = ({ uuid }) => {
  const [page, setPage] = useState<Page>(Page.Location);
  const siteData = uuid ? useSiteData(uuid) : undefined;
  const { longitude, latitude } = siteData || {};

  const router = useRouter();
  console.log(uuid);
  const generateFormPage = () => {
    switch (page) {
      case Page.Details:
        return (
          <Details
            lastPageCallback={() => setPage(Page.Location)}
            nextPageCallback={() => router.push('sites')}
            uuid={uuid}
          />
        );
      case Page.Location:
        return (
          <Location
            nextPageCallback={() => setPage(Page.Details)}
            longitude={longitude}
            latitude={latitude}
          />
        );
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
