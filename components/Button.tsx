import { FC, PropsWithChildren } from 'react';

interface Props {
  form?: string;
  disabled: boolean;
  variant: 'input-form' | 'next-hover-button';
  onClick?: () => void;
}

const Button: FC<PropsWithChildren<Props>> = ({
  form,
  children,
  disabled = false,
  variant = 'input-form',
  onClick,
}) => {
  let className: string = '';
  if (variant == 'input-form') {
    className =
      'inline-flex items-center justify-center md:w-36 w-10/12 bg-ocf-yellow disabled:bg-ocf-gray disabled:dark:bg-ocf-gray transition-all duration-500 shadow h-14 max-w-sm text-center rounded-md md:rounded-lg md:font-semibold font-bold text-xl';
  }
  if (variant == 'next-hover-button') {
    className =
      'inline-flex gap-[10px] items-center justify-center md:w-[200px] w-10/12 hover:border-ocf-yellow border-transparent border-[2px] text-ocf-yellow disabled:bg-ocf-gray disabled:dark:bg-ocf-gray transition-all duration-500 shadow h-14 max-w-sm text-center rounded-md md:rounded-lg md:font-semibold font-bold text-[16px]';
  }
  return (
    <button
      suppressHydrationWarning
      form={form}
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </button>
  );
};

export default Button;
