import { FC, PropsWithChildren } from 'react';
import Sidebar from './SideBar';

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <main className="bg-white dark:bg-black flex flex-col items-center justify-start px-10 min-h-screen">
      <Sidebar />
      {children}
    </main>
  );
};

export default Layout;
