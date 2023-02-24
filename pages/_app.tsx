import '~/styles/globals.css';
import type { AppProps } from 'next/app';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import Head from 'next/head';

import { Inter } from '@next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Head>
        <title>Open Climate Fix</title>
        <meta name="description" content="pv-sites-mobile" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className={`${inter.className} bg-white dark:bg-black flex flex-col items-center justify-start min-h-screen"`}
      >
        <Component {...pageProps} />
      </main>
    </UserProvider>
  );
}
