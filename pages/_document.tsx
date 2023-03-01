import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en" className="dark">
      <Head>
        {/*// @ts-ignore*/}
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Source+Code+Pro:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="bg-white dark:bg-ocf-black">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
