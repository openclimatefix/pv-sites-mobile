import { useUser } from '@auth0/nextjs-auth0';
import { FC, MouseEventHandler } from 'react';
import useSWR from 'swr';
import { useSideBarContext } from '~/lib/context/sidebar';
import { SiteList } from '~/lib/types';
import { MenuLogo, NowcastingLogo } from '../icons/NavbarIcons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ContactButton from '../ContactButton';

type NavbarLinkProps = {
  title: string;
  href: string;
  currentPath: string;
};

const NavbarLink: React.FC<NavbarLinkProps> = ({
  title,
  href,
  currentPath,
}) => {
  const isActive = href === currentPath;
  const textColor = isActive ? 'text-amber' : 'text-white';
  return (
    <Link href={href} passHref>
      <a
        className={`${textColor} text-lg font-medium mr-6 hidden md:block  ${
          isActive && 'underline underline-offset-8 decoration-2'
        }`}
      >
        {title}
      </a>
    </Link>
  );
};

const NavBar: FC = () => {
  const { isSideBarOpen, openSideBar } = useSideBarContext();
  const { data } = useSWR<SiteList>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL_GET}/sites`
  );
  const { user } = useUser();
  const router = useRouter();

  const handleOpenSidebar: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    openSideBar();
  };

  return (
    <div
      className={`bg-ocf-black max-w-screen-xl w-screen h-[var(--nav-height)] mx-auto flex ${
        user ? 'justify-between' : 'justify-center'
      } px-5 md:my-2`}
    >
      {user && (
        <button
          onClick={handleOpenSidebar}
          className={`${
            isSideBarOpen || data?.site_list.length === 0
              ? 'opacity-0 pointer-events-none'
              : 'opacity-100'
          } text-gray-600 flex flex-col justify-center invisible md:visible`}
        >
          <MenuLogo />
        </button>
      )}
      <NowcastingLogo />
      <div className="flex flex-row justify-center items-center">
        <NavbarLink
          title="Dashboard"
          currentPath={router.asPath}
          href="/dashboard"
        />
        <NavbarLink
          title="More Info"
          currentPath={router.asPath}
          href="/more-info"
        />

        <ContactButton/>
      </div>
    </div>
  );
};

export default NavBar;
