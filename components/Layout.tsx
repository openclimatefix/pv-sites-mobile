import { FC, PropsWithChildren } from 'react';
import SideBar from './navigation/SideBar';
import NavBar from './navigation/NavBar';
import BottomNavBar from './navigation/BottomNavBar';
import { useUser } from '@auth0/nextjs-auth0';

const Layout: FC<PropsWithChildren> = ({ children }) => {
  const { user } = useUser();

  return (
    <>
      {user && <NavBar />}
      <SideBar />
      <main className="bg-white dark:bg-ocf-black flex flex-col items-center justify-start w-full">
        {children}
        {user && <BottomNavBar />}
      </main>
    </>
  );
};

export default Layout;
