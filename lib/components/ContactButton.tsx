import { UserProfile, useUser } from '@auth0/nextjs-auth0';
import Link from 'next/link';
import { FC, useRef, useState } from 'react';
import { useClickedOutside } from '../utils';
import { LogoutIcon } from './icons';

interface ProfilePictureProps {
  user: UserProfile | undefined;
  onClick?: () => void;
}

const ProfilePicture: FC<ProfilePictureProps> = ({ user, onClick }) => {
  return (
    <button
      className="h-[31px] w-[31px] rounded-full bg-ocf-gray-800 text-[12px] text-white"
      onClick={onClick}
    >
      {user?.name
        ?.split(' ')
        .map((name) => name.charAt(0))
        .join('')}
    </button>
  );
};

const ContactButton = () => {
  const { user } = useUser();
  const wrapperRef = useRef(null);
  const [displayPopup, setDisplayPopup] = useState(false);
  useClickedOutside(wrapperRef, () => setDisplayPopup(false));

  return (
    <div className="relative mr-[15px]" ref={wrapperRef}>
      <ProfilePicture
        user={user}
        onClick={() =>
          displayPopup ? setDisplayPopup(false) : setDisplayPopup(true)
        }
      />

      <div
        className={`absolute right-0 z-10 mt-[10px] w-[191px] origin-top-right overflow-hidden rounded-lg border-[.5px] border-ocf-gray-300 bg-ocf-black-900 transition-all ${
          displayPopup
            ? 'pointer-events-auto scale-100 opacity-100'
            : 'pointer-events-none scale-50 opacity-0'
        }`}
      >
        <div className="flex items-center justify-evenly border-b-[.5px] border-ocf-gray-800 py-4">
          <ProfilePicture user={user} />
          <div className="flex-col justify-center gap-3">
            <div className="text-[12px] text-white">{user?.name}</div>
            <div className="text-[10px] text-white">{user?.email}</div>
          </div>
        </div>
        <Link
          href={`/api/auth/logout?returnTo=${process.env.NEXT_PUBLIC_AUTH0_LOGOUT_REDIRECT}`}
        >
          <a
            className={`flex items-center justify-center gap-5 px-4 py-3 text-white transition-all hover:bg-ocf-gray-1000`}
          >
            <div className="h-6 w-6">
              <LogoutIcon />
            </div>
            Sign Out
          </a>
        </Link>
      </div>
    </div>
  );
};

export default ContactButton;
