import { FC } from 'react';
import useSWR from 'swr';
import { useSidebarContext } from '~/lib/context/sidebar_context';
import { Site } from '~/lib/types';
import { MenuLogo, NowcastingLogo } from './icons/navbar_icons';
import { InstallPWAButton } from './InstallPWAButton';

const NavBar: FC = () => {
  const { isSidebarOpen, openSidebar } = useSidebarContext();
  const { data, isLoading } = useSWR<{ site_list: Site[] }>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sites/site_list`
  );

  return (
    <nav className="flex items-center justify-between bg-ocf-black px-6 py-4">
      <div className="flex items-center">
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
      </div>

      <div className="flex items-center justify-center">
        <NowcastingLogo />
      </div>
      <div className="flex items-center justify-center w-10" />
      <InstallPWAButton />
    </nav>
  );
};

export default NavBar;
