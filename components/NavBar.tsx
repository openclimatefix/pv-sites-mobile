import { useUser } from '@auth0/nextjs-auth0';
import { FC } from 'react';
import useSWR from 'swr';
import { useSidebarContext } from '~/lib/context/sidebar_context';
import { Site } from '~/lib/types';

import { MenuLogo, NowcastingLogo } from './icons/navbar_icons';

const NavBar: FC = () => {
  const { isSidebarOpen, openSidebar } = useSidebarContext();
  const { data, isLoading } = useSWR<{ site_list: Site[] }>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sites`
  );
  const { user } = useUser();

  return (
    <div
      className={`bg-ocf-black w-full pt-2 pb-2 h-[var(--nav-height)] flex ${
        user ? 'justify-between' : 'justify-center'
      } px-5`}
    >
      {user && (
        <button
          onClick={openSidebar}
          className={`${
            isSidebarOpen || isLoading || data?.site_list.length === 0
              ? 'opacity-0 pointer-events-none'
              : 'opacity-100'
          } transition-opacity ease-linear duration-100 text-gray-600 flex justify-center invisible md:visible`}
        >
          <MenuLogo />
        </button>
      )}
      <NowcastingLogo />
      <div className="w-10 h-10" />
    </div>
  );
};

export default NavBar;
