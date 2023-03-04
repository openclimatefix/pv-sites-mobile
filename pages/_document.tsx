import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en" className="dark">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v5.0.0/mapbox-gl-geocoder.css"
          type="text/css"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Source+Code+Pro:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#14120E" />
      </Head>
      <body className="bg-white dark:bg-ocf-black">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
