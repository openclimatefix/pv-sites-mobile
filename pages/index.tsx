import { withSites } from '~/lib/sites';

export default function Index() {
  return null;
}

export const getServerSideProps = withSites({
  async getServerSideProps({ sites }) {
    const destination = sites.length === 0 ? '/site-details' : '/dashboard';

    return {
      redirect: {
        permanent: false,
        destination,
      },
    };
  },
});
