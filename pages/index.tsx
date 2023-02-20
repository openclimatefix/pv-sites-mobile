import Head from 'next/head';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useState } from 'react';

export default function Home() {
  const { user, error, isLoading } = useUser();

  return (
    <>
      {console.log(user, isLoading)}
      <Head>
        <Link href="/api/auth/login">Login</Link>
        <Link href="/api/auth/logout">Logout</Link>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>pv-sites-mobile</h1>
      </main>
    </>
  );
}
