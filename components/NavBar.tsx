import { FC } from 'react';
import { useSidebarContext } from './context';
import { NowcastingLogo, MenuLogo } from './icons/navbar_icons';

const NavBar: FC = () => {
  const { isSidebarOpen, openSidebar } = useSidebarContext();

  return (
    <div className="bg-ocf-black w-full pt-2 pb-2 h-20 flex justify-between px-5">
      <button
        onClick={openSidebar}
        className={`${
          isSidebarOpen ? '-translate-x-[10rem]' : 'translate-x-0'
        } transition transform ease-linear duration-500 text-gray-600 flex justify-center self-center`}
      >
        <MenuLogo />
      </button>
      <NowcastingLogo />
      <div className="w-10 h-10"></div>
    </div>
  );
};

export default NavBar;
