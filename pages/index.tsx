import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { Site } from '~/lib/types';

export default function Index() {
  return null;
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const session = getSession(ctx.req, ctx.res);

    if (!session) {
      throw new Error('Session is undefined');
    }

    const { site_list } = (await fetch(
      `${process.env.AUTH0_BASE_URL}/api/sites/site_list`,
      {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }
    ).then((res) => res.json())) as { site_list: Site[] };

    let destination = '/dashboard';

    if (site_list) {
      destination = site_list.length === 0 ? '/form/location' : '/dashboard';
    }

    return {
      redirect: {
        permanent: false,
        destination,
      },
      props: {},
    };
  },
});
