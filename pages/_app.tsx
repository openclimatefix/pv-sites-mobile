import '~/styles/globals.css';
import type { AppProps } from 'next/app';
import { UserProvider } from '@auth0/nextjs-auth0';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Head>
        <title>Open Climate Fix</title>
        <meta name="description" content="pv-sites-mobile" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=" bg-white dark:bg-black flex flex-col items-center justify-start px-10 min-h-screen">
        <Component {...pageProps} />
      </main>
    </UserProvider>
  );
}
