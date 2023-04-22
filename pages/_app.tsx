import { UserProfile, UserProvider } from '@auth0/nextjs-auth0';
import { AppType } from 'next/app';
import Head from 'next/head';
import { SWRConfig } from 'swr';
import Layout from '~/components/Layout';
import { FormProvider } from '~/lib/context/form';
import { SideBarProvider } from '~/lib/context/sidebar';
import { fetcher } from '~/lib/swr';
import { SiteList } from '~/lib/types';
import '~/styles/globals.css';
import '~/styles/transition.css';

type AppProps = { siteList?: SiteList; user?: UserProfile };

const App: AppType<AppProps> = ({ Component, pageProps }) => {
  const swrFallback = pageProps.siteList
    ? {
        [`${process.env.NEXT_PUBLIC_API_BASE_URL_GET}/sites`]:
          pageProps.siteList,
      }
    : undefined;

  return (
    <UserProvider user={pageProps.user}>
      <SWRConfig
        value={{
          fetcher,
          fallback: swrFallback,
          refreshInterval: 1000 * 60, // Every minute
          keepPreviousData: true, // Enabled to support page transitions where a key changes
        }}
      >
        <FormProvider>
          <SideBarProvider>
            <Head>
              <title>Sites | Nowcasting</title>
              <link rel="icon" href="/favicon.ico" />
              <meta name="description" content="Nowcasting for solar sites" />
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1"
              />
              <meta name="theme-color" content="#14120E" />
            </Head>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </SideBarProvider>
        </FormProvider>
      </SWRConfig>
    </UserProvider>
  );
};

export default App;
