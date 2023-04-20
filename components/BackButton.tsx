import { FC } from 'react';
import { LeftChevron } from './icons';

interface Props {
  onClick: () => void;
}

const BackButton: FC<Props> = ({ onClick }) => {
  return (
    <div className="py-4 max-w-sm md:hidden flex flex-1 flex-row flex-start">
      <button
        onClick={onClick}
        className="mr-10 flex flex-row justify-start content-center text-ocf-yellow disabled:bg-ocf-gray disabled:dark:bg-ocf-gray text-center"
      >
        <LeftChevron />
        <p className="ml-2 mt-[2px] text-md">Back</p>
      </button>
    </div>
  );
};

export default BackButton;
