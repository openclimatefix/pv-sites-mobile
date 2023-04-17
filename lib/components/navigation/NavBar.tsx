import { useUser } from '@auth0/nextjs-auth0';
import { FC, useState } from 'react';
import { useSites } from '~/lib/sites';
import { MenuLogo, NowcastingLogo } from '../icons/NavbarIcons';
import SideBar from './SideBar';

const NavBar: FC = () => {
  const { sites } = useSites();
  const { user } = useUser();
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  return (
    <>
      <SideBar open={isSideBarOpen} onClose={() => setIsSideBarOpen(false)} />
      <div
        className={`bg-ocf-black w-full h-[var(--nav-height)] flex ${
          user ? 'justify-between' : 'justify-center'
        } px-5 md:my-2`}
      >
        {user && (
          <button
            onClick={() => setIsSideBarOpen(true)}
            className={`${
              isSideBarOpen || sites.length === 0
                ? 'opacity-0 pointer-events-none'
                : 'opacity-100'
            } text-gray-600 flex flex-col justify-center invisible md:visible`}
          >
            <MenuLogo />
          </button>
        )}
        <NowcastingLogo />
        <div className="w-10 h-10" />
      </div>
    </>
  );
};

export default NavBar;
