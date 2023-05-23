import { useRouter } from 'next/router';
import { useState } from 'react';
import ViewInverters from '~/lib/components/form/ViewInverters';
import BackNav from '~/lib/components/navigation/BackNav';
import { withSites } from '~/lib/sites';
import { useIsMobile } from '~/lib/utils';

enum Page {
  View = 'View',
  Select = 'Select',
}

const Inverters = () => {
  const [page, setPage] = useState<Page>(Page.Select);
  const router = useRouter();
  const { uuid } = router.query;

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

  const isMobile = useIsMobile();
  const backUrl = isMobile ? '/sites' : '/dashboard';
  const editModeLastPageCallback = () => {
    router.push(backUrl);
  };

  return (
    <div className="flex h-full w-full flex-col items-center ">
      <BackNav backButton={true} lastPageCallback={editModeLastPageCallback} />
      <ViewInverters
        siteUUID={uuid as string}
        backButton={page === Page.Select}
        isSelectMode={page === Page.Select}
        isEditMode={true}
        nextPageCallback={nextPageCallback}
        lastPageCallback={editModeLastPageCallback}
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

Inverters.hideNav = true;
