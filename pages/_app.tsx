import '~/styles/globals.css';
import type { AppProps } from 'next/app';
import { UserProvider } from '@auth0/nextjs-auth0/';
import Head from 'next/head';

import { SidebarProvider } from '~/lib/context/sidebar_context';
import { FormProvider } from '~/lib/context/form_context';

import Layout from '~/components/Layout';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <FormProvider>
        <SidebarProvider>
          <Head>
            <title>Open Climate Fix</title>
            <meta name="description" content="pv-sites-mobile" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </SidebarProvider>
      </FormProvider>
    </UserProvider>
  );
}
