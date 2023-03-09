import { getSession } from '@auth0/nextjs-auth0';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { withPageAuthRequired } from '~/lib/auth';
import { Site } from '~/lib/types';

export default function Home(this: any) {
  const router = useRouter();

  useEffect(() => {
    router.push('/form/location');
  }, [router]);

  return (
    <>
      <Head>
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
