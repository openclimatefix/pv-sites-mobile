import { FC, PropsWithChildren } from 'react';


const BackButton: FC = () => {
  return (
    <button
      className="bg-ocf-yellow disabled:bg-ocf-gray disabled:dark:bg-ocf-gray transition-all duration-500 shadow h-14 w-full max-w-sm text-center rounded-md font-bold text-xl uppercase"
    >
      <p>hi</p>
    </button>
  );
};

export default BackButton;
