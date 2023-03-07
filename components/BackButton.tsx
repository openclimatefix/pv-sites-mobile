import { FC } from 'react';
import { LeftChevron } from './icons/sidebar_icons';
import { useRouter } from 'next/router';

const BackButton: FC = () => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push('/form/location')}
      className="mr-10 md:invisible flex flex-row justify-start content-center text-ocf-yellow disabled:bg-ocf-gray disabled:dark:bg-ocf-gray text-center"
    >
      <LeftChevron />
      <p className="ml-2 text-lg">Back</p>
    </div>
  );
};

export default BackButton;
