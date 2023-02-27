import '~/styles/globals.css';
import type { AppProps } from 'next/app';
import { UserProvider } from '@auth0/nextjs-auth0';
import Head from 'next/head';

import { AppProvider } from '~/components/context';

import Layout from '~/components/Layout';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <AppProvider>
        <Head>
          <title>Open Climate Fix</title>
          <meta name="description" content="pv-sites-mobile" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AppProvider>
    </UserProvider>
  );
}
