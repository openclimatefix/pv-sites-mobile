import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function Button({ children }: Props) {
  return (
    <button className="bg-ocf-yellow dark:bg-ocf-yellow shadow h-full w-full text-center rounded-md font-bold text-xl uppercase">
      {children}
    </button>
  );
}