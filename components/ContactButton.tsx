import { FC, PropsWithChildren, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0';

const ContactButton = () => {
  const { user } = useUser();
  const firstName = user && user.given_name ? user.given_name.toString() : '';
  const lastName = user && user.family_name ? user.family_name.toString() : '';
  const imageURL = user && user.picture ? user.picture.toString() : '';
  const [displayPopup, setDisplayPopup] = useState(false);

  return (
    <div className="">
      <button
        className="w-[40px] h-[40px] float-right bg-[#909090] rounded-full relative text-white"
        onClick={() =>
          displayPopup ? setDisplayPopup(false) : setDisplayPopup(true)
        }
      >
        {firstName.substring(0, 1) + lastName.substring(0, 1)}
      </button>
      {displayPopup && (
        <div className="w-[200px] h-[100px] absolute rounded-lg border-[#909090] border-2 bg-ocf-black-900">
          <div className="ml-[10px] mt-[10px] w-[40px] h-[40px] bg-[#909090] rounded-full text-white items-center">
            {firstName.substring(0, 1) + lastName.substring(0, 1)}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactButton;
