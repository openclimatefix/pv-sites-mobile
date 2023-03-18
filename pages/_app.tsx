import { UserProfile, UserProvider } from '@auth0/nextjs-auth0';
import { NextComponentType } from 'next';
import { AppContext, AppProps } from 'next/app';
import Head from 'next/head';
import { SWRConfig } from 'swr';
import Layout from '~/components/Layout';
import { FormProvider } from '~/lib/context/form_context';
import { SidebarProvider } from '~/lib/context/sidebar_context';
import { fetcher } from '~/lib/swr';
import { Site, SiteList } from '~/lib/types';
import '~/styles/globals.css';

type InitialProps = { siteList?: SiteList };

type AppType = NextComponentType<
  AppContext,
  InitialProps,
  AppProps<{ user: UserProfile }> & InitialProps
>;

const App: AppType = ({ Component, pageProps, siteList }) => {
  const swrFallback = siteList
    ? {
        [`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sites`]: siteList,
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
          <SidebarProvider>
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
          </SidebarProvider>
        </FormProvider>
      </SWRConfig>
    </UserProvider>
  );
};

App.getInitialProps = async ({ ctx }) => {
  const { accessToken } = await fetch(
    `${process.env.AUTH0_BASE_URL}/api/get_token`,
    {
      credentials: 'include',
      headers: {
        cookie: ctx.req?.headers.cookie ?? '',
      },
    }
  ).then((res) => res.json());

  if (!accessToken) {
    return {};
  }

  const siteList = (await fetch(`${process.env.AUTH0_BASE_URL}/api/sites`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((res) => res.json())) as { site_list: Site[] };

  return {
    siteList,
  };
};

export default App;
