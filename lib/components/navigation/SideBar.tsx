import Link from 'next/link';
import React, { FC, ReactNode, useEffect, useRef } from 'react';

import { LogoutIcon } from '../icons';

import { LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import { useClickedOutside } from '~/lib/utils';
import {
  ChartBarIcon,
  ListBulletIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';

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
          <div className={textColor}>{svg}</div>
          <span className={`mx-4 font-medium flex-1 align-center ${textColor}`}>
            {label}
          </span>
        </div>
      </a>
    </Link>
  );
};

interface SideBarProps {
  open: boolean;
  onClose: () => void;
}

const SideBar: FC<SideBarProps> = ({ open, onClose }) => {
  const router = useRouter();
  useEffect(() => {
    router.events.on('routeChangeComplete', onClose);
    return () => router.events.off('routeChangeComplete', onClose);
  }, [onClose, router]);

  const wrapperRef = useRef(null);
  useClickedOutside(wrapperRef, () => {
    if (open) {
      onClose();
    }
  });

  return (
    <div
      className={`z-50 transition-all duration-500 h-full fixed top-0 ${
        open ? 'translate-x-0 shadow-lg shadow-ocf-black' : '-translate-x-64'
      }`}
      // @ts-ignore
      inert={!open ? '' : null}
      ref={wrapperRef}
    >
      <div className="flex h-full overflow-y-auto flex-col bg-ocf-black-500 w-64 px-4 py-8 relative">
        <button
          onClick={onClose}
          className="absolute top-1 right-1 text-white w-8 h-8 rounded-full flex items-center justify-center ml-6"
        >
          <XMarkIcon width="24" height="24" />
        </button>
        <div className="text-xs	flex flex-col mt-6 justify-between flex-1">
          <div className="flex flex-col gap-3">
            <MenuLink
              linkProps={{ href: '/dashboard' }}
              label="Dashboard"
              svg={<ChartBarIcon width="24" height="24" />}
              currentPath={router.asPath}
            />
            <MenuLink
              linkProps={{ href: '/sites' }}
              label="My Sites"
              svg={<ListBulletIcon width="24" height="24" />}
              currentPath={router.asPath}
            />
            <MenuLink
              linkProps={{ href: '/more-info' }}
              label="More Info"
              svg={<MagnifyingGlassIcon width="24" height="24" />}
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
