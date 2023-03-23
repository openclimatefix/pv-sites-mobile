import { FC, PropsWithChildren } from 'react';

interface Props {
  enabled: boolean;
  onClick?: () => void;
}

const Button: FC<PropsWithChildren<Props>> = ({
  children,
  enabled,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={!enabled}
      className="md:w-36 w-10/12 md:mr-36 bg-ocf-yellow disabled:bg-ocf-gray disabled:dark:bg-ocf-gray transition-all duration-500 shadow h-14 max-w-sm text-center rounded-md md:rounded-lg md:font-semibold font-bold text-xl"
    >
      {children}
    </button>
  );
};

export default Button;
