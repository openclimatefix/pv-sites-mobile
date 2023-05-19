import { FC } from 'react';

export const skeleton = `flex-1 text-transparent bg-ocf-gray-1000 w-[100%] rounded-lg animate-pulse select-none`;

export const SkeletonBox: FC = () => (
  <div
    className="
      align-center
      flex
      h-full
      flex-1
      justify-center
      rounded-lg
      bg-ocf-black-500
      p-4
      text-center"
  >
    <div className={skeleton}></div>
  </div>
);
