import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, PropsWithChildren } from 'react';
import Image from 'next/image';
import { useGlobalContext } from './context';

const NavBar: FC = () => {
  const router = useRouter();
  const logo = require('./../public/nowcasting.svg') as string;
  const menu = require('./../public/menu.svg') as string;

  const { isSidebarOpen, openSidebar } = useGlobalContext();

  return (
    <div className="ocf-black w-full pt-8 pb-2 h-24 flex justify-between mt-5">
      <button
        onClick={openSidebar}
        className={`${
          isSidebarOpen ? '-translate-x-[10rem]' : 'translate-x-0'
        } transition transform ease-linear duration-500 text-gray-600 flex justify-center self-center`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          color="#FFD053"
          className="w-10 h-10"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>
      <Image src={logo} alt="logo" className="self-center justify-center" />
      <div className="w-10 h-10"></div>
    </div>
  );
};

export default NavBar;
