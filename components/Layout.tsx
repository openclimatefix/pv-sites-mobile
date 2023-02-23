import { FC, PropsWithChildren } from 'react';

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <main className="bg-white dark:bg-black flex flex-col items-center justify-start px-10 min-h-screen">
      {children}
    </main>
  );
};

export default Layout;
