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
      className="inline-flex h-14 w-10/12 max-w-sm items-center justify-center rounded-md bg-ocf-yellow text-center text-xl font-bold shadow transition-all duration-500 disabled:bg-ocf-gray disabled:dark:bg-ocf-gray md:w-36 md:rounded-lg md:font-semibold"
    >
      {children}
    </button>
  );
};

export default Button;
