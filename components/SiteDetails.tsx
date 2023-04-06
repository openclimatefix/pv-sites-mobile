import { useRouter } from 'next/router';
import { FC, useState } from 'react';
import Location from '~/components/form/Location';
import Details from './form/Details';

enum Page {
  Details = 'Details',
  Location = 'Location',
}

interface SiteDetailsProps {
  uuid?: string | undefined;
}

const SiteDetails: FC<SiteDetailsProps> = ({ uuid }) => {
  const [page, setPage] = useState<Page>(Page.Location);
  const router = useRouter();
  console.log(uuid);
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
