import { FC, PropsWithChildren } from 'react';
import SideBar from './navigation/SideBar';
import NavBar from './navigation/NavBar';
import BottomNavBar from './navigation/BottomNavBar';
import { useUser } from '@auth0/nextjs-auth0';
import Transition from './navigation/Transition';

const Layout: FC<PropsWithChildren> = ({ children }) => {
  const { user } = useUser();

  return (
    <>
      {user && <NavBar />}
      <SideBar />
      <Transition>
        <main className="bg-white dark:bg-ocf-black flex flex-col items-center justify-start w-full">
          {children}
        </main>
      </Transition>
      {user && <BottomNavBar />}
    </>
  );
};

export default Layout;
