import { FC, PropsWithChildren } from 'react';

interface Props {
  enabled: boolean;
}

const Button: FC<PropsWithChildren<Props>> = ({ children, enabled }) => {
  return (
    <button
      disabled={!enabled}
      className="bg-ocf-yellow disabled:bg-ocf-gray disabled:dark:bg-ocf-gray shadow h-14 w-full max-w-sm text-center rounded-md font-bold text-xl uppercase"
    >
      {children}
    </button>
  );
};

export default Button;
