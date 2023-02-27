import React, { SVGProps } from 'react';
import { useGlobalContext } from './context';
import Link from 'next/link';
import {
  LogoutIcon,
  EditIcon,
  LocationIcon,
  DashboardIcon,
  ExitIcon,
} from './icons/sidebar_icons';

const Sidebar = () => {
  const { isSidebarOpen, closeSidebar } = useGlobalContext();

  return (
    <div
      className={`transition-all  duration-500  fixed top-0 ${
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
          <Button
            href="/dashboard"
            name="Dashboard"
            svg={<DashboardIcon />}
            className="mx-4 font-medium flex-1 align-center text-amber"
          />
          <div className="text-xs">
            <Button
              href="/form"
              name="Add a Location"
              svg={<LocationIcon />}
              className="mx-4 font-medium flex-1 align-center text-white"
            ></Button>
            <Button
              href="/form"
              name="Edit Site Details"
              svg={<EditIcon />}
              className="mx-4 font-medium flex-1 align-center text-white"
            ></Button>
            <Button
              href="/api/auth/logout"
              name="Logout"
              svg={<LogoutIcon />}
              className="mx-4 font-medium flex-1 align-center text-white"
            ></Button>
          </div>
        </div>
      </div>
    </div>
  );
};

type SideBarButtonProps = {
  href: string;
  name: string;
  svg: SVGProps<SVGElement>;
  className: string;
};

const Button: React.FC<SideBarButtonProps> = ({
  href,
  name,
  svg,
  className,
}) => {
  return (
    <>
      <Link href={href}>
        <div className="mb-5 px-4 py-2 flex items-center rounded-md text-gray-600 hover:text-gray-700 hover:bg-ocf-gray-1000 transition-colors transform">
          <>{svg}</>
          <span className={className}>{name}</span>
        </div>
      </Link>
    </>
  );
};

export default Sidebar;
