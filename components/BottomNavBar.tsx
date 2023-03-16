import Link from 'next/link';

import { DashboardIcon, SearchIcon, SiteListIcon } from './icons';

import { useRouter } from 'next/router';
import useSWR from 'swr';

const icons = [
  {
    title: 'Dashboard',
    icon: DashboardIcon,
    link: '/dashboard',
  },
  {
    title: 'My Sites',
    icon: SiteListIcon,
    link: '/sites',
  },
  {
    title: 'More Info',
    icon: SearchIcon,
    link: '/more-info',
  },
];

const BottomNavBar = () => {
  const { asPath } = useRouter();

  const { data, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sites`
  );

  return (
    <div
      className={`${
        data?.site_list.length === 0
          ? 'opacity-0 pointer-events-none hidden'
          : 'opacity-100'
      }
    bg-ocf-gray-1000 w-screen h-[60px] bottom-0 fixed visible md:invisible`}
    >
      <div className="flex justify-evenly mt-[3px]">
        {icons.map((val, i) => {
          return (
            <Link key={i} href={val.link}>
              <a
                className={`text-xs items-center mt-[10px] flex flex-col justify-evenly ${
                  asPath == val.link ? 'text-ocf-yellow' : 'text-white'
                }`}
              >
                <val.icon key={i} color="white"></val.icon>
                <p className="mt-[5px]">{val.title}</p>
              </a>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavBar;
