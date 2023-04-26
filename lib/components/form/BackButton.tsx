import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import { FC } from 'react';

interface Props {
  onClick?: () => void;
}

const BackButton: FC<Props> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center text-lg font-medium text-ocf-yellow disabled:bg-ocf-gray disabled:dark:bg-ocf-gray"
    >
      <ChevronLeftIcon height="24" width="24" className="ocf-yellow" />
      Back
    </button>
  );
};

export default BackButton;
