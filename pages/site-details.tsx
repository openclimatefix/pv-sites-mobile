import Details from '~/components/form/Details';
import Location from '~/components/form/Location';
import { useRouter } from 'next/router';
import Button from '~/components/Button';

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
        <>
          <Details
            lastPageCallback={() => setPage(Page.Location)}
            nextPageCallback={() => router.push('sites')}
          />
          <div className="absolute flex flex-row justify-between bottom-12 left-1/2 -translate-x-1/2 w-3/4 h-14">
            <Button enabled={true} onClick={() => setPage(Page.Location)}>
              Back
            </Button>
            <Button enabled={true} onClick={() => router.push('sites')}>
            Finish
            </Button>
          </div>
        </>
      );
    case Page.Location:
      return (
        <>
          <Location nextPageCallback={() => setPage(Page.Details)} />
          <div className="absolute flex flex-row justify-end bottom-12 left-1/2 -translate-x-1/2 w-3/4 h-14">
            <Button enabled={true} onClick={() => setPage(Page.Details)}>
              Next
            </Button>
          </div>
        </>
      );
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
      <div className="md:block hidden w-full justify-center flex-col">
        <SiteDetailsDesktop page={page} setPage={setPage} />
      </div>
    </>
  );
};

export default SiteDetails;
export const getServerSideProps = withSites();
