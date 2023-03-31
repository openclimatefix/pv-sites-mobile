import { FC, PropsWithChildren } from 'react';
import Sidebar from './nav/SideBar';
import NavBar from './nav/NavBar';
import BottomNavBar from './nav/BottomNavBar';
import { useUser } from '@auth0/nextjs-auth0';

const Layout: FC<PropsWithChildren> = ({ children }) => {
  const { user } = useUser();

  return (
    <>
      {user && <NavBar />}
      <Sidebar />
      <main className="bg-white dark:bg-ocf-black flex flex-col items-center justify-start w-full">
        {children}
        {user && <BottomNavBar />}
      </main>
    </>
  );
};

export default Layout;
