import Head from 'next/head';
import { withPageAuthRequired } from '~/lib/auth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Home(this: any) {
  const router = useRouter();

  useEffect(() => {
    router.push('/location');
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

export const getServerSideProps = withPageAuthRequired();
