import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  enabled: boolean;
}

export default function Button({ children, enabled }: Props) {
  if (enabled) {
    return (
      <button className="bg-ocf-yellow dark:bg-ocf-yellow shadow h-full w-full text-center rounded-md font-bold text-xl uppercase p-4">
        {children}
      </button>
    );
  } else {
    return (
      <button
        disabled
        className="bg-ocf-gray dark:bg-ocf-gray shadow h-full w-full text-center rounded-md font-bold text-xl uppercase"
      >
        {children}
      </button>
    );
  }
}
