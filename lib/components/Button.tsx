import { FC, PropsWithChildren } from 'react';

interface Props {
  form?: string;
  disabled?: boolean;
  hidden?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  variant: 'solid' | 'outlined';
  onClick?: () => void;
}

const Button: FC<PropsWithChildren<Props>> = ({
  form,
  children,
  disabled = false,
  hidden,
  className = '',
  variant = 'solid',
  onClick,
}) => {
  const outlinedButton =
    'h-[54px] w-[200px] text-xl text-ocf-yellow border-ocf-yellow border-[2px] rounded-md font-semibold hover:bg-ocf-yellow hover:text-black transition-all duration-300';

  const solidButton =
    'inline-flex gap-[10px] items-center justify-center md:w-[200px] bg-ocf-yellow text-black disabled:bg-ocf-gray disabled:text-ocf-black-600 transition-all duration-300 shadow h-14 max-w-sm text-center rounded-md md:rounded-lg md:font-semibold font-bold text-xl';

  return (
    <button
      suppressHydrationWarning
      form={form}
      onClick={onClick}
      disabled={disabled}
      className={`${variant === 'solid' ? solidButton : outlinedButton} ${
        hidden && `${hidden}:hidden`
      } ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
