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

      {displayPopup && (
        <div className="absolute right-0 z-10 mt-[10px] h-[103px] w-[191px] rounded-lg border-[.5px] border-ocf-gray-300 bg-ocf-black-900">
          <div className="flex items-center justify-evenly border-b-[.5px] border-ocf-gray-800 py-2">
            <ProfilePicture user={user} />
            <div className="flex-col justify-center gap-3">
              <div className="text-[12px] text-white">{user?.name}</div>
              <div className="text-[10px] text-white">{user?.email}</div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Link
              href={`/api/auth/logout?returnTo=${process.env.NEXT_PUBLIC_AUTH0_LOGOUT_REDIRECT}`}
            >
              <a>
                <div
                  className={`flex transform items-center rounded-md px-4 py-2 text-gray-600 transition-colors hover:bg-ocf-gray-1000 hover:text-gray-700`}
                >
                  <div className="h-[18px] w-[20px]">
                    <LogoutIcon />
                  </div>
                  <span
                    className={`align-center ml-[40px] mt-[6px] flex-1 text-[12px] font-medium text-white`}
                  >
                    Sign Out
                  </span>
                </div>
              </a>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactButton;
