import { withSites } from '~/lib/utils';

export default function Index() {
  return null;
}

export const getServerSideProps = withSites({
  async getServerSideProps({ siteList }) {
    const destination =
      siteList.site_list.length === 0 ? '/form/location' : '/dashboard';

    return {
      redirect: {
        permanent: false,
        destination,
      },
    };
  },
});
