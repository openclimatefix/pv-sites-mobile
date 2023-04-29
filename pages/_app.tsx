import { UserProfile, UserProvider } from '@auth0/nextjs-auth0';
import { AppType } from 'next/app';
import Head from 'next/head';
import { SWRConfig } from 'swr';
import Layout from '~/lib/components/Layout';
import { fetcher } from '~/lib/swr';
import '~/styles/globals.css';
import '~/styles/transition.css';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import duration from 'dayjs/plugin/duration';
import dayjs from 'dayjs';
import { Site } from '~/lib/types';
import { AppProvider } from '~/lib/provider';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

type AppProps = { sites?: Site[]; user?: UserProfile };

const App: AppType<AppProps> = ({ Component, pageProps }) => {
  const swrFallback = {
    [`${process.env.NEXT_PUBLIC_API_BASE_URL_GET}/sites`]:
      pageProps.sites ?? [],
  };

  return (
    <UserProvider user={pageProps.user}>
      <SWRConfig
        value={{
          fetcher,
          fallback: swrFallback,
          refreshInterval: 1000 * 60, // Every minute
          errorRetryCount: 3,
          keepPreviousData: true, // Enabled to support page transitions where a key changes
        }}
      >
        <AppProvider>
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
        </AppProvider>
      </SWRConfig>
    </UserProvider>
  );
};

export default App;
