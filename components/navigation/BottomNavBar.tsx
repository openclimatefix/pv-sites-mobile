import Link from 'next/link';

import { DashboardIcon, SearchIcon, SiteListIcon } from '../icons';

import { useRouter } from 'next/router';
import useSWR from 'swr';
import useSites from '~/lib/hooks/useSites';

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
  const { sites } = useSites();

  return (
    <div
      className={`${
        sites?.length ?? 0 === 0
          ? 'opacity-0 pointer-events-none hidden'
          : 'opacity-100'
      }
    bg-ocf-gray-1000 w-screen h-[var(--bottom-nav-height)] bottom-0 fixed visible md:invisible pb-2 z-50`}
    >
      <div className="flex justify-evenly items-center h-full">
        {icons.map((val, i) => {
          return (
            <Link key={i} href={val.link}>
              <a
                className={`text-xs items-center flex flex-col justify-evenly ${
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
