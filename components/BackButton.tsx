import { FC } from 'react';
import { LeftChevron } from './icons';

interface Props {
  onClick: () => void;
}

const BackButton: FC<Props> = ({ onClick }) => {
  return (
    <div className="w-4/5 max-w-sm md:hidden flex flex-row flex-start">
      <button
        onClick={onClick}
        className="mr-10 flex flex-row justify-start content-center text-ocf-yellow disabled:bg-ocf-gray disabled:dark:bg-ocf-gray text-center"
      >
        <LeftChevron />
        <p className="ml-2 text-lg">Back</p>
      </button>
    </div>
  );
};

export default BackButton;
