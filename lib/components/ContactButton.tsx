import { useUser } from '@auth0/nextjs-auth0';
import Link from 'next/link';
import { useState } from 'react';
import { LogoutIcon } from './icons';

const ContactButton = () => {
  const { user } = useUser();
  const firstName = user && user.given_name ? user.given_name.toString() : '';
  const lastName = user && user.family_name ? user.family_name.toString() : '';
  const userEmail = user && user.email ? user.email.toString() : '';

  const [displayPopup, setDisplayPopup] = useState(false);

  return (
    <div className="relative mr-[15px]">
      <button
        className="h-[31px] w-[31px] rounded-full bg-ocf-gray-800 text-[12px] text-white"
        onClick={() =>
          displayPopup ? setDisplayPopup(false) : setDisplayPopup(true)
        }
      >
        {firstName.substring(0, 1) + lastName.substring(0, 1)}
      </button>

      {displayPopup && (
        <div className="absolute right-0 z-10 mt-[10px] h-[103px] w-[191px] rounded-lg border-[.5px] border-ocf-gray-300 bg-ocf-black-900">
          <div className="flex justify-evenly">
            <div className="mt-[10px] flex h-[31px] w-[31px]  items-center justify-center rounded-full bg-ocf-gray-800 text-[12px] text-white">
              {firstName.substring(0, 1) + lastName.substring(0, 1)}
            </div>
            <div className="flex-col justify-center">
              <div className="mt-[7px] text-[12px] text-white">
                {firstName + ' ' + lastName}
              </div>
              <div className="mt-[2px] text-[10px] text-white">{userEmail}</div>
            </div>
          </div>
          <div className="mt-[10px] w-full border-[.5px] border-ocf-gray-800"></div>
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
