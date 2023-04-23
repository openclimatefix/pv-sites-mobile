import { useUser } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router';
import { FC, PropsWithChildren } from 'react';
import BottomNavBar from './navigation/BottomNavBar';
import NavBar from './navigation/NavBar';
import Transition from './navigation/Transition';
import { useIsMobile } from '../utils';

const Layout: FC<PropsWithChildren> = ({ children }) => {
  const { user } = useUser();

  const mobile = useIsMobile();
  const PageTransitionWrapper = mobile && user ? Transition : 'div';
  const { asPath: path } = useRouter();
  // TODO: Improve this
  const showNav = !!user && !path.startsWith('/site-details');

  return (
    <>
      <PageTransitionWrapper className="grid-in-content relative flex-1 overflow-y-auto overflow-x-clip">
        {showNav && <NavBar />}
        <main className="flex w-full flex-col items-center justify-start bg-white dark:bg-ocf-black">
          {children}
        </main>
      </PageTransitionWrapper>
      {showNav && <BottomNavBar />}
    </>
  );
};

export default Layout;
