import React, { ReactNode, useEffect, useRef } from 'react';
import { useSideBarContext } from '~/lib/context/sidebar_context';
import Link from 'next/link';

import {
  ExitIcon,
  DashboardIcon,
  LogoutIcon,
  SiteListIcon,
  SearchIcon,
} from '../icons';

import { LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import { useClickedOutside } from '../../lib/hooks';

type MenuLinkProps = {
  linkProps: LinkProps;
  label: string;
  svg: ReactNode;
  currentPath: string;
};

const MenuLink: React.FC<MenuLinkProps> = ({
  linkProps,
  label,
  svg,
  currentPath,
}) => {
  const textColor =
    linkProps.href === currentPath ? 'text-amber' : 'text-white';
  return (
    <Link {...linkProps}>
      <a>
        <div
          className={`px-4 py-2 flex items-center rounded-md text-gray-600 hover:text-gray-700 hover:bg-ocf-gray-1000 transition-colors transform`}
        >
          <g className={textColor}>{svg}</g>
          <span className={`mx-4 font-medium flex-1 align-center ${textColor}`}>
            {label}
          </span>
        </div>
      </a>
    </Link>
  );
};

const SideBar = () => {
  const { isSideBarOpen, closeSideBar } = useSideBarContext();
  const router = useRouter();
  useEffect(() => router.events.on('routeChangeComplete', closeSideBar));
  const wrapperRef = useRef(null);

  const clickOutsideSideBarHandler = () => {
    if (isSideBarOpen) {
      closeSideBar();
    }
  };

  useClickedOutside(wrapperRef, clickOutsideSideBarHandler);

  return (
    <div
      className={`z-50 transition-all duration-500 h-full fixed top-0 ${
        isSideBarOpen
          ? 'translate-x-0 shadow-lg shadow-ocf-black'
          : '-translate-x-64'
      }`}
      // @ts-ignore
      inert={!isSideBarOpen ? '' : null}
      ref={wrapperRef}
    >
      <div className="flex h-full overflow-y-auto flex-col bg-ocf-black-500 w-64 px-4 py-8 relative">
        <button
          onClick={closeSideBar}
          className="absolute top-1 right-1 text-white w-8 h-8 rounded-full flex items-center justify-center ml-6"
        >
          <ExitIcon />
        </button>
        <div className="text-xs	flex flex-col mt-6 justify-between flex-1">
          <div className="flex flex-col gap-3">
            <MenuLink
              linkProps={{ href: '/dashboard' }}
              label="Dashboard"
              svg={<DashboardIcon />}
              currentPath={router.asPath}
            />
            <MenuLink
              linkProps={{ href: '/sites' }}
              label="My Sites"
              svg={<SiteListIcon color={'white'} />}
              currentPath={router.asPath}
            />
            <MenuLink
              linkProps={{ href: '/more-info' }}
              label="More Info"
              svg={<SearchIcon color={'white'} />}
              currentPath={router.asPath}
            />
          </div>
          <div className="flex flex-col gap-3">
            <MenuLink
              linkProps={{
                href: `/api/auth/logout?returnTo=${process.env.NEXT_PUBLIC_AUTH0_LOGOUT_REDIRECT}`,
              }}
              label="Logout"
              svg={<LogoutIcon />}
              currentPath={router.asPath}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
