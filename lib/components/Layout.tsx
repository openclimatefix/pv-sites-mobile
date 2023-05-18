import { useUser } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router';
import { FC, PropsWithChildren } from 'react';
import BottomNavBar from './navigation/BottomNavBar';
import NavBar from './navigation/NavBar';
import Transition from './navigation/Transition';

const Layout: FC<PropsWithChildren> = ({ children }) => {
  const { user } = useUser();
  const { asPath: path } = useRouter();
  // TODO: Improve this
  const showNav =
    !!user &&
    !path.startsWith('/site-details') &&
    !path.startsWith('/inverters') &&
    !path.startsWith('/link');

  return (
    <>
      <Transition className="grid-in-content relative flex-1 overflow-y-auto overflow-x-clip">
        {showNav && <NavBar />}
        <main className="flex w-full flex-col items-center justify-start bg-white dark:bg-ocf-black">
          {children}
        </main>
      </Transition>
      {showNav && <BottomNavBar />}
    </>
  );
};

export default Layout;
