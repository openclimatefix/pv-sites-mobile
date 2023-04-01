import { FC, PropsWithChildren } from 'react';

interface Props {
  form?: string;
  disabled: boolean;
  onClick?: () => void;
}

const Button: FC<PropsWithChildren<Props>> = ({
  form,
  children,
  disabled,
  onClick,
}) => {
  return (
    <button
      form={form}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center md:w-36 w-10/12 bg-ocf-yellow disabled:bg-ocf-gray disabled:dark:bg-ocf-gray transition-all duration-500 shadow h-14 max-w-sm text-center rounded-md md:rounded-lg md:font-semibold font-bold text-xl"
    >
      {children}
    </button>
  );
};

export default Button;
