import { FC, PropsWithChildren } from 'react';
import Sidebar from './SideBar';
import NavBar from './NavBar';

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <NavBar />
      <Sidebar />
      <main className="bg-white dark:bg-ocf-black flex flex-col items-center justify-start px-10">
        {children}
      </main>
    </>
  );
};

export default Layout;
