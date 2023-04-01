import { UserProfile, UserProvider } from '@auth0/nextjs-auth0';
import { AppType } from 'next/app';
import Head from 'next/head';
import { SWRConfig } from 'swr';
import Layout from '~/components/Layout';
import { FormProvider } from '~/lib/context/form_context';
import { SideBarProvider } from '~/lib/context/sidebar_context';
import { fetcher } from '~/lib/swr';
import { SiteList } from '~/lib/types';
import '~/styles/globals.css';

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
          refreshInterval: 10000,
        }}
      >
        <FormProvider>
          <SideBarProvider>
            <Head>
              <title>Sites | Nowcasting</title>
              <link rel="icon" href="/favicon.ico" />
              <meta name="description" content="pv-sites-mobile" />
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
