import { getSession } from '@auth0/nextjs-auth0';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Sidebar from '~/components/SideBar';
import { withPageAuthRequired } from '~/lib/auth';
import { Site } from '~/lib/types';
import PowerInfoCard from './../components/PowerInfoCard';

export default function Home(this: any) {
  const router = useRouter();

  useEffect(() => {
    router.push('/location');
  }, [router]);

  return (
    <>
      <Head>
        <PowerInfoCard />
        <title>Open Climate Fix</title>
        <meta name="description" content="Open Climate Fix" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </>
  );
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

    const destination =
      site_list.length === 0 ? '/form/location' : '/dashboard';

    return {
      redirect: {
        permanent: false,
        destination,
      },
      props: {},
    };
  },
});
