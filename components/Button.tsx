import { FC, PropsWithChildren } from 'react';

interface Props {
  enabled: boolean;
}

const Button: FC<PropsWithChildren<Props>> = ({ children, enabled }) => {
  return (
    <button
      disabled={!enabled}
      className="bg-ocf-yellow disabled:bg-ocf-gray disabled:dark:bg-ocf-gray shadow h-full w-full text-center rounded-md font-bold text-xl uppercase"
    >
      {children}
    </button>
  );
};

export default Button;
