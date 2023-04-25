import { withSites } from '~/lib/sites';

export default function Index() {
  return null;
}

export const getServerSideProps = withSites({
  async getServerSideProps({ sites }) {
    const destination = sites.length === 0 ? '/form/location' : '/dashboard';

    return {
      redirect: {
        permanent: false,
        destination,
      },
    };
  },
});
