import { FC } from 'react';
import { LeftChevron } from './icons';

interface Props {
  callback: () => void;
}

const BackButton: FC<Props> = ({callback}) => {
  return (
    <div className="w-4/5 max-w-sm flex flex-row flex-start">
      <button
        onClick={callback}
        className="mr-10 md:invisible flex flex-row justify-start content-center text-ocf-yellow disabled:bg-ocf-gray disabled:dark:bg-ocf-gray text-center"
      >
        <LeftChevron />
        <p className="ml-2 text-lg">Back</p>
      </button>
    </div>
  );
};

export default BackButton;
