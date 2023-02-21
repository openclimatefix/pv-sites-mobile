import '~/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import { Inter } from '@next/font/google';
import Layout from '~/components/Layout';

const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Open Climate Fix</title>
        <meta name="description" content="pv-sites-mobile" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
