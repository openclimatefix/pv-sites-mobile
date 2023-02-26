import { useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router';
import { NowcastingLogo } from '~/components/icons/nowcasting-logo';

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
      <div className="flex flex-col justify-between items-center h-1/2">
        <div className="flex flex-row justify-center w-screen mt-24">
          <NowcastingLogo width="300px" height="120px" />
        </div>
        <h1 className="font-bold text-4xl mt-20 text-center text-ocf-gray w-[200px]">
          See you next time!
        </h1>
      </div>
      <div className="flex flex-col items-center justify-end h-1/2 w-full pb-28">
        <button
          className="bg-ocf-yellow dark:bg-ocf-yellow shadow h-14 w-72 text-center rounded-md font-bold text-xl"
          onClick={() => router.push('/')}
        >
          Back to login
        </button>
      </div>
    </div>
  );
};

export default Logout;
