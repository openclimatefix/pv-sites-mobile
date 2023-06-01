import { useRouter } from 'next/router';
import LinkInverters from '~/lib/components/form/LinkInverters';
import { withSites } from '~/lib/sites';

const InverterLink = () => {
  const router = useRouter();
  const { uuid } = router.query;
  return <LinkInverters siteUUID={uuid! as string} />;
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

export default InverterLink;

InverterLink.hideNav = true;
