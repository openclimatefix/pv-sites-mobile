import { ReactNode, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import { LogoutIcon } from './icons';
import router from 'next/router';
import Link, { LinkProps } from 'next/link';

const ContactButton = () => {
  const { user } = useUser();
  const firstName = user && user.given_name ? user.given_name.toString() : '';
  const lastName = user && user.family_name ? user.family_name.toString() : '';
  const userEmail = user && user.email ? user.email.toString() : '';

  const [displayPopup, setDisplayPopup] = useState(false);

  return (
    <div className="relative mr-[15px]">
      <button
        className="w-[31px] h-[31px] bg-ocf-gray-800 rounded-full text-white text-[12px]"
        onClick={() =>
          displayPopup ? setDisplayPopup(false) : setDisplayPopup(true)
        }
      >
        {firstName.substring(0, 1) + lastName.substring(0, 1)}
      </button>

      {displayPopup && (
        <div className="w-[191px] h-[103px] absolute rounded-lg border-ocf-gray-300 border-[.5px] bg-ocf-black-900 right-0 mt-[10px]">
          <div className="flex justify-evenly">
            <div className="mt-[10px] w-[31px] h-[31px] bg-ocf-gray-800  rounded-full text-white flex items-center justify-center text-[12px]">
              {firstName.substring(0, 1) + lastName.substring(0, 1)}
            </div>
            <div className="flex-col justify-center">
              <div className="text-white mt-[7px] text-[12px]">
                {firstName + ' ' + lastName}
              </div>
              <div className="text-white mt-[2px] text-[10px]">{userEmail}</div>
            </div>
          </div>
          <div className="w-full border-ocf-gray-800 border-[.5px] mt-[10px]"></div>
          <div className="flex flex-col gap-3">
            <Link
              href={`/api/auth/logout?returnTo=${process.env.NEXT_PUBLIC_AUTH0_LOGOUT_REDIRECT}`}
            >
              <a>
                <div
                  className={`px-4 py-2 flex items-center rounded-md text-gray-600 hover:text-gray-700 hover:bg-ocf-gray-1000 transition-colors transform`}
                >
                  <div className="w-[20px] h-[18px]">
                    <LogoutIcon />
                  </div>
                  <span
                    className={`ml-[40px] font-medium flex-1 align-center text-white text-[12px] mt-[6px]`}
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
