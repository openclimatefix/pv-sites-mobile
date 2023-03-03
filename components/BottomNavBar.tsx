import Link from 'next/link';
import DashboardIcon from './icons/DashboardIcon';
import SearchIcon from './icons/SearchIcon';
import SiteListIcon from './icons/SiteListIcon';
import { useRouter } from 'next/router';
import useSWR, { Fetcher } from 'swr';

interface SiteListProps {
  site_list: SiteProps[];
}

const fetcher: Fetcher<SiteListProps> = async (url: string) => {
  return await fetch(url).then((res) => res.json());
};

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
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sites/site_list`,
    fetcher
  );

  return (
    <div className="bg-ocf-gray-1000 w-screen h-[80px] bottom-0 fixed mt-px">
      <div className="flex justify-evenly mt-[15px]">
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
