import { FC } from 'react';
import { useSidebarContext } from './context';
import { NowcastingLogo, MenuLogo } from './icons/navbar_icons';

const NavBar: FC = () => {
  const { isSidebarOpen, openSidebar } = useSidebarContext();

  return (
    <div className="ocf-black w-full pt-8 pb-2 h-24 flex justify-between mt-5">
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
