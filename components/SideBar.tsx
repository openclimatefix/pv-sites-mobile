import React, { SVGProps, useEffect } from 'react';
import { useSidebarContext } from './context';
import Link from 'next/link';
import {
  LogoutIcon,
  EditIcon,
  LocationIcon,
  DashboardIcon,
  ExitIcon,
} from './icons/sidebar_icons';
import { LinkProps } from 'next/link';
import { useRouter } from 'next/router';

type MenuLinkProps = {
  linkProps: LinkProps;
  label: string;
  svg: SVGProps<SVGElement>;
  textColor: string;
};

const MenuLink: React.FC<MenuLinkProps> = ({
  linkProps,
  label,
  svg,
  textColor,
}) => {
  return (
    <Link {...linkProps}>
      <a>
        <div className="px-4 py-2 flex items-center rounded-md text-gray-600 hover:text-gray-700 hover:bg-ocf-gray-1000 transition-colors transform">
          <>{svg}</>
          <span className={`mx-4 font-medium flex-1 align-center ${textColor}`}>
            {label}
          </span>
        </div>
      </a>
    </Link>
  );
};

const Sidebar = () => {
  const { isSidebarOpen, closeSidebar } = useSidebarContext();
  const router = useRouter();
  useEffect(() => router.events.on('routeChangeComplete', closeSidebar));

  return (
    <div
      className={`transition-all  duration-250  fixed top-0 ${
        isSidebarOpen ? 'left-0' : '-left-64'
      }`}
    >
      <div className="flex h-screen overflow-y-auto flex-col bg-ocf-black w-64 px-4 py-8 min-h-screen relative">
        <button
          onClick={closeSidebar}
          className="absolute top-1 right-1 text-white w-8 h-8 rounded-full flex items-center justify-center focus:outline-none ml-6"
        >
          <ExitIcon />
        </button>
        <div className="text-xs	flex flex-col mt-6 justify-between flex-1">
          <MenuLink
            linkProps={{ href: '/dashboard' }}
            label="Dashboard"
            svg={<DashboardIcon />}
            textColor="text-amber"
          />
          <div className="text-xs flex flex-col gap-3">
            <MenuLink
              linkProps={{ href: '/form' }}
              label="Add a Location"
              svg={<LocationIcon />}
              textColor="text-white"
            />
            <MenuLink
              linkProps={{ href: '/form' }}
              label="Edit Site Details"
              svg={<EditIcon />}
              textColor="text-white"
            />
            <MenuLink
              linkProps={{
                href: `/api/auth/logout?returnTo=${process.env.NEXT_PUBLIC_AUTH0_LOGOUT_REDIRECT}`,
              }}
              label="Logout"
              svg={<LogoutIcon />}
              textColor="text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
