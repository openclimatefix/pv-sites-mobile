import { FC, PropsWithChildren } from 'react';
import Sidebar from './SideBar';
import NavBar from './NavBar';
import { useUser } from '@auth0/nextjs-auth0';

const Layout: FC<PropsWithChildren> = ({ children }) => {
  const { user } = useUser();

  return (
    <>
      <NavBar />
      {user && <Sidebar />}
      <main className="bg-white dark:bg-ocf-black flex flex-col items-center justify-start px-10">
        {children}
      </main>
    </>
  );
};

export default Layout;
