import { UserProfile, UserProvider } from '@auth0/nextjs-auth0';
import Head from 'next/head';
import { SWRConfig } from 'swr';
import { AppType } from 'next/app';
import Layout from '~/components/Layout';
import { FormProvider } from '~/lib/context/form_context';
import { SidebarProvider } from '~/lib/context/sidebar_context';
import { fetcher } from '~/lib/swr';
import { Site } from '~/lib/types';
import '~/styles/globals.css';

interface PageProps {
  user: UserProfile;
}

// @ts-ignore
const SitesApp: AppType<PageProps> = ({ Component, pageProps, siteList }) => {
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

// @ts-ignore
SitesApp.getInitialProps = async ({ ctx }) => {
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

export default SitesApp;
