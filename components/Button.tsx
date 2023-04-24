import { FC, PropsWithChildren } from 'react';
import useMediaQuery from '~/lib/hooks/useMediaQuery';

interface Props {
  form?: string;
  disabled?: boolean;
  variant: 'solid' | 'outlined';
  onClick?: () => void;
}

const Button: FC<PropsWithChildren<Props>> = ({
  form,
  children,
  disabled = false,
  variant = 'solid',
  onClick,
}) => {
  const outlinedButton =
    'h-[54px] w-[250px] text-ocf-yellow border-ocf-yellow border-[2px] rounded-md font-semibold hover:bg-ocf-yellow hover:text-black transition-colors duration-300';

  const solidButton =
    'inline-flex gap-[10px] items-center justify-center md:w-[200px] w-10/12 bg-ocf-yellow text-black disabled:bg-ocf-gray disabled:text-ocf-black-600 transition-all duration-500 shadow h-14 max-w-sm text-center rounded-md md:rounded-lg md:font-semibold font-bold text-[16px]';

  return (
    <button
      suppressHydrationWarning
      form={form}
      onClick={onClick}
      disabled={disabled}
      className={variant === 'solid' ? solidButton : outlinedButton}
    >
      {children}
    </button>
  );
};

export default Button;
