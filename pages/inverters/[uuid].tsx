import { useRouter } from 'next/router';
import { useState } from 'react';
import ViewInverters from '~/lib/components/form/ViewInverters';
import BackNav from '~/lib/components/navigation/BackNav';
import { withSites } from '~/lib/sites';

enum Page {
  View = 'View',
  Select = 'Select',
}

const Inverters = () => {
  const [page, setPage] = useState<Page>(Page.View);
  const router = useRouter();
  const { uuid, success } = router.query;

  const nextPageCallback = () => {
    switch (page) {
      case Page.View:
        setPage(Page.Select);
        return;
      case Page.Select:
        router.push('/dashboard');
        return;
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center ">
      <BackNav
        backButton={page === Page.Select}
        lastPageCallback={() => setPage(Page.View)}
      />
      <ViewInverters
        siteUUID={uuid as string} //@TODO fix this lmao
        backButton={page === Page.Select}
        isSelectMode={page === Page.Select}
        nextPageCallback={nextPageCallback}
        lastPageCallback={() => setPage(Page.View)}
        linkSuccess={success as string | undefined}
      />
    </div>
  );
};

export const getServerSideProps = withSites({
  async getServerSideProps(ctx) {
    const { sites, query } = ctx;
    if (!sites.find((site) => site.site_uuid === (query.uuid as string))) {
      return {
        notFound: true,
      };
    }
  },
});

export default Inverters;

(Inverters as any).hideNav = true;
