import Link from 'next/link';

import { DashboardIcon, SearchIcon, SiteListIcon } from '../icons';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';
import useSites from '~/lib/hooks/useSites';
import { useIsSitePage } from '~/lib/hooks/useIsSitePage';
import { motion, AnimatePresence } from 'framer-motion';

const defaultIcons = [
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

const sitePageIcons = [
  {
    title: 'Back',
    icon: ChevronLeftIcon,
    link: '/sites',
  },
];

const BottomNavBar = () => {
  const { asPath } = useRouter();
  const { sites } = useSites();
  const isSitePage = useIsSitePage();

  const icons = isSitePage ? sitePageIcons : defaultIcons;

  const transition = { duration: 0.1 };

  return (
    <div
      className={`${
        (sites?.length ?? 0) === 0
          ? 'opacity-0 pointer-events-none hidden'
          : 'opacity-100'
      }
    bg-ocf-gray-1000 w-screen h-[var(--bottom-nav-height)] visible md:invisible relative z-50`}
    >
      <div className="flex justify-evenly items-center h-full">
        <AnimatePresence mode="wait">
          {icons.map((val, i) => {
            return (
              <Link key={val.title} href={val.link} legacyBehavior passHref>
                <motion.a
                  className={`text-xs items-center flex flex-col justify-evenly ${
                    asPath == val.link ? 'text-ocf-yellow' : 'text-white'
                  } ${isSitePage ? 'mr-auto ml-10' : ''}`}
                  initial={{
                    opacity: 0,
                    x: isSitePage ? '50%' : '-50%',
                  }}
                  animate={{ opacity: 1, x: 0, transition }}
                  exit={{
                    opacity: 0,
                    x: isSitePage ? '50%' : '-50%',
                    transition,
                  }}
                >
                  <val.icon key={i} color="white" width="24" height="24" />
                  <p className="mt-0.5">{val.title}</p>
                </motion.a>
              </Link>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BottomNavBar;
