import { useUser } from '@auth0/nextjs-auth0';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, MouseEventHandler, useState } from 'react';
import { useSites } from '~/lib/sites';
import ContactButton from '../ContactButton';
import { MenuLogo, NowcastingLogo } from '../icons/NavbarIcons';
import SideBar from './SideBar';
import { useAppContext } from '~/lib/provider';

type NavbarLinkProps = {
  title: string;
  href: string;
};

export const NavbarLink: FC<NavbarLinkProps> = ({ title, href }) => {
  const { asPath: path } = useRouter();
  const isActive = path.startsWith(href);
  const textColor = isActive ? 'text-amber' : 'text-white';
  return (
    <Link href={href} passHref>
      <a
        className={`${textColor} mr-6 text-lg font-medium ${
          isActive && 'underline decoration-2 underline-offset-8'
        }`}
      >
        {title}
      </a>
    </Link>
  );
};

const NavBar: FC = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const { sites } = useSites();
  const { user } = useUser();

  const { prevDashboardUUID } = useAppContext();

  const handleOpenSidebar: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    setIsSideBarOpen(true);
  };

  return (
    <>
      <SideBar open={isSideBarOpen} onClose={() => setIsSideBarOpen(false)} />
      <div
        className={`mx-auto flex h-[var(--nav-height)] w-screen bg-ocf-black ${
          user ? 'justify-between' : 'justify-center'
        } px-5 md:my-2`}
      >
        {user && (
          <button
            onClick={handleOpenSidebar}
            className={`${
              isSideBarOpen || sites.length === 0
                ? 'pointer-events-none opacity-0'
                : 'opacity-100'
            } invisible flex flex-col justify-center text-gray-600 transition-all md:visible`}
          >
            <MenuLogo />
          </button>
        )}
        <NowcastingLogo />
        <div className="invisible hidden flex-row items-center justify-center  md:visible md:flex">
          <NavbarLink
            title="Dashboard"
            href={
              prevDashboardUUID === ''
                ? `/dashboard`
                : `/dashboard/${prevDashboardUUID}`
            }
          />
          <NavbarLink title="Help Center" href="/help" />
          <div className="hidden md:block">
            <ContactButton />
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
