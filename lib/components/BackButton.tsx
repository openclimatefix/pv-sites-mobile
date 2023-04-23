import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import { FC } from 'react';

interface Props {
  onClick: () => void;
}

const BackButton: FC<Props> = ({ onClick }) => {
  return (
    <div className="flex-start flex max-w-sm flex-1 flex-row py-4 md:hidden">
      <button
        onClick={onClick}
        className="mr-10 flex flex-row content-center justify-start text-center text-ocf-yellow disabled:bg-ocf-gray disabled:dark:bg-ocf-gray"
      >
        <ChevronLeftIcon height="24" width="24" color="white" />
        <p className="text-md ml-2 mt-[2px]">Back</p>
      </button>
    </div>
  );
};

export default BackButton;
