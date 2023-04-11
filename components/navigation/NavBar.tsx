import { useUser } from '@auth0/nextjs-auth0';
import { FC, MouseEventHandler } from 'react';
import useSWR from 'swr';
import { useSideBarContext } from '~/lib/context/sidebar';
import { SiteList } from '~/lib/types';
import { MenuLogo, NowcastingLogo } from '../icons/NavbarIcons';

const NavBar: FC = () => {
  const { isSideBarOpen, openSideBar } = useSideBarContext();
  const { data } = useSWR<SiteList>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL_GET}/sites`
  );
  const { user } = useUser();

  const handleOpenSidebar: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    openSideBar();
  };

  return (
    <div
      className={`bg-ocf-black w-full pt-2 pb-2 h-[var(--nav-height)] flex ${
        user ? 'justify-between' : 'justify-center'
      } px-5`}
    >
      {user && (
        <button
          onClick={handleOpenSidebar}
          className={`${
            isSideBarOpen || data?.site_list.length === 0
              ? 'opacity-0 pointer-events-none'
              : 'opacity-100'
          } text-gray-600 flex justify-center invisible md:visible`}
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
