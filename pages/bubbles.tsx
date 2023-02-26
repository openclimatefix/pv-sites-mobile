import react, { useEffect } from 'react'
import { useUser, handleLogout } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router';
import { NowcastingLogo } from '~/components/icons/nowcasting-logo';

const returnTo = 'http://localhost:3000/logout';

const Logout = () => {
  const { user } = useUser();
  const router = useRouter(); 

  useEffect(() => {
    if (user) {
      console.log(`/api/auth/logout?returnTo=${returnTo}`);
        router.push(
          `/api/auth/logout?returnTo=${returnTo}`
        );
    }
  }, [user, router])

  return (
    <div className="h-screen w-screen bg-ocf-black">
      <div className="flex flex-col justify-start items-center h-screen">
        <div className="flex flex-row justify-center w-screen">
          <NowcastingLogo width="300px" height="150px" />
        </div>
        <h1 className="font-bold text-4xl mt-20 text-center text-ocf-gray w-2/4">
          See you next time!
        </h1>
      </div>
    </div>
  );
};

export default Logout