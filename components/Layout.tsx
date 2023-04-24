import { FC, PropsWithChildren } from 'react';
import SideBar from './navigation/SideBar';
import NavBar from './navigation/NavBar';
import BottomNavBar from './navigation/BottomNavBar';
import { useUser } from '@auth0/nextjs-auth0';
import Transition from './navigation/Transition';
import { useRouter } from 'next/router';

const Layout: FC<PropsWithChildren> = ({ children }) => {
  const { user } = useUser();

  const PageTransitionWrapper = user ? Transition : 'div';
  const { asPath: path } = useRouter();
  const showNav = !!user && !path.startsWith('/site-details');

  return (
    <>
      <PageTransitionWrapper className="overflow-x-clip overflow-y-auto flex-1 grid-in-content relative">
        {showNav && <NavBar />}
        {user && <SideBar />}
        <main className="bg-white dark:bg-ocf-black flex flex-col items-center justify-start w-full">
          {children}
        </main>
      </PageTransitionWrapper>
      {showNav && <BottomNavBar />}
    </>
  );
};

export default Layout;
