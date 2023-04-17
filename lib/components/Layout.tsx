import { useUser } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router';
import { FC, PropsWithChildren } from 'react';
import BottomNavBar from './navigation/BottomNavBar';
import NavBar from './navigation/NavBar';
import Transition from './navigation/Transition';

const Layout: FC<PropsWithChildren> = ({ children }) => {
  const { user } = useUser();
  const { asPath: path } = useRouter();

  const PageTransitionWrapper = user ? Transition : 'div';
  const showNav = Boolean(user) && path != '/site-details';

  return (
    <>
      <PageTransitionWrapper className="overflow-x-clip overflow-y-auto flex-1 grid-in-content relative">
        {showNav && <NavBar />}
        <main className="bg-white dark:bg-ocf-black flex flex-col items-center justify-start w-full">
          {children}
        </main>
      </PageTransitionWrapper>
      {showNav && <BottomNavBar />}
    </>
  );
};

export default Layout;
