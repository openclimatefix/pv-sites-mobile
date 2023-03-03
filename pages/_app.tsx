import { UserProvider } from '@auth0/nextjs-auth0';
import { AppProps } from 'next/app';
import Head from 'next/head';

import { SidebarProvider } from '~/lib/context/sidebar_context';
import { FormProvider } from '~/lib/context/form_context';

import { FC } from 'react';
import { SWRConfig } from 'swr';
import Layout from '~/components/Layout';
import { fetcher } from '~/lib/swr';
import '~/styles/globals.css';

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <UserProvider>
      <SWRConfig value={{ fetcher }}>
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
      </SWRConfig>
    </UserProvider>
  );
};

export default App;
