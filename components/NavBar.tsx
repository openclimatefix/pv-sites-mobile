import { FC } from 'react';
import { useSidebarContext } from './context';
import { NowcastingLogo, MenuLogo } from './icons/navbar_icons';
import useSWR, { Fetcher } from 'swr';

interface SiteProps {
  site_uuid: string;
  client_name: string;
  client_site_id: string;
  client_site_name: string;
  region?: string;
  dno?: string;
  gsp?: string;
  orientation?: number;
  tilt?: number;
  latitude: number;
  longitude: number;
  installed_capacity_kw: number;
  created_utc: string;
  updated_utc: string;
}

interface SiteListProps {
  site_list: SiteProps[];
}

const fetcher: Fetcher<SiteListProps> = async (url: string) => {
  return await fetch(url).then((res) => res.json());
};

const NavBar: FC = () => {
  const { isSidebarOpen, openSidebar } = useSidebarContext();
  const { data, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sites/site_list`,
    fetcher
  );

  return (
    <div className="bg-ocf-black w-full pt-2 pb-2 h-20 flex justify-between px-5">
      <button
        onClick={openSidebar}
        className={`${
          isSidebarOpen || isLoading || data?.site_list.length === 0
            ? 'opacity-0 pointer-events-none'
            : 'opacity-100'
        } transition-opacity ease-linear duration-100 text-gray-600 flex justify-center self-center invisible md:visible`}
      >
        <MenuLogo />
      </button>
      <NowcastingLogo />
      <div className="w-10 h-10" />
    </div>
  );
};

export default NavBar;
