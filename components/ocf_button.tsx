import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function OCFButton({ children }: Props) {
  return (
    <button className="bg-ocf-yellow dark:bg-ocf-yellow shadow h-14 w-40 text-center rounded-md font-bold text-xl uppercase">
      {children}
    </button>
  );
}