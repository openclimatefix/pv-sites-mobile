import { FC, PropsWithChildren } from 'react';
import { useUser } from '@auth0/nextjs-auth0';

const ContactButton = () => {
  const { user } = useUser();
  console.log(user);
  const firstName = user && user.given_name ? user.given_name.toString() : '';
  const lastName = user && user.family_name ? user.family_name.toString() : '';

  return (
    <button className="w-[50px] h-[50px] float-right bg-gray-300 rounded-full">
      {firstName.substring(0, 1) + lastName.substring(0, 1)}
    </button>
  );
};

export default ContactButton;
