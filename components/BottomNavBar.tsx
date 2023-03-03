import Link from 'next/link';
import DashboardIcon from './icons/DashboardIcon';
import SearchIcon from './icons/SearchIcon';
import SiteListIcon from './icons/SiteListIcon';

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
  return (
    <div className="bg-ocf-gray-1000 w-screen h-[80px] bottom-0 fixed mt-px">
      <div className="flex justify-evenly mt-[15px]">
        {icons.map((val, i) => {
          return (
            <Link key={i} href={val.link}>
              <a className="text-white text-xs items-center mt-[10px] flex flex-col justify-evenly">
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
