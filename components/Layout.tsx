import { FC, PropsWithChildren } from 'react';
import SideBar from './navigation/SideBar';
import NavBar from './navigation/NavBar';
import BottomNavBar from './navigation/BottomNavBar';
import { useUser } from '@auth0/nextjs-auth0';
import Transition from './navigation/Transition';

const Layout: FC<PropsWithChildren> = ({ children }) => {
  const { user } = useUser();

  const PageTransitionWrapper = user ? Transition : 'div';

  return (
    <div className="flex flex-col h-screen overflow-hidden relative">
      <PageTransitionWrapper className="overflow-x-clip overflow-y-auto flex-1">
        {user && <NavBar />}
        <SideBar />
        <main className="bg-white dark:bg-ocf-black flex flex-col items-center justify-start w-full">
          {children}
        </main>
      </PageTransitionWrapper>
      {user && <BottomNavBar />}
    </div>
  );
};

export default Layout;
