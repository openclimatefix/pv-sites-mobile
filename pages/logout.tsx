import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { withSites } from '~/lib/sites';
import Image from 'next/image';
import { useUser } from '@auth0/nextjs-auth0';

const Logout = () => {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push(
        `/api/auth/logout?returnTo=${process.env.NEXT_PUBLIC_AUTH0_LOGOUT_REDIRECT}`
      );
    }
  }, [user, router]);

  return (
    <div className="h-screen w-screen bg-ocf-black">
      <div className="flex h-1/2 flex-col items-center justify-between">
        <div className="mt-24 flex w-screen flex-row justify-center">
          <a
            href="https://www.openclimatefix.org/"
            target="_blank"
            rel="noreferrer"
          >
            <Image
              src="/nowcasting-secondary.svg"
              alt="Nowcasting logo"
              width={300}
              height={120}
            />
          </a>
        </div>
        <h1 className="mt-20 w-[200px] text-center text-4xl font-bold text-ocf-gray">
          See you next time!
        </h1>
      </div>
      <div className="flex h-1/2 w-full flex-col items-center justify-end pb-28">
        <Link
          href="/"
          className="flex h-14 w-72 items-center justify-center rounded-md bg-ocf-yellow text-center text-xl font-bold shadow dark:bg-ocf-yellow"
        >
          Back to login
        </Link>
      </div>
    </div>
  );
};

export default Logout;
