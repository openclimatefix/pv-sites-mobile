import { FC } from 'react';
import SiteDetails from '../../lib/components/form/SiteDetails';
import { useRouter } from 'next/router';
import { withSites } from '~/lib/sites';
import { Site } from '~/lib/types';

interface NewSiteDetailsProps {
  sites: Site[];
}

const NewSiteDetails: FC<NewSiteDetailsProps> = ({ sites }) => {
  const router = useRouter();
  const { uuid } = router.query;
  return <SiteDetails site={sites.find((site) => site.site_uuid === uuid)!} />;
};

export const getServerSideProps = withSites({
  async getServerSideProps(ctx) {
    const { sites, query } = ctx;
    if (!sites.map((site) => site.site_uuid).includes(query.uuid as string)) {
      return {
        notFound: true,
      };
    }
  },
});

export default NewSiteDetails;
