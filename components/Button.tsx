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
  const mobileInverterLinkClass =
    'h-[54px] w-[250px] text-ocf-yellow border-ocf-yellow border-[2px] rounded-md font-semibold mb-[20px]';

  const desktopInverterLinkClass =
    'h-[54px] w-[250px] text-ocf-yellow border-ocf-yellow border-[2px] rounded-md font-semibold hover:bg-ocf-yellow hover:text-black';

  const mobile = useMediaQuery('(max-width: 768px)');

  let className: string = '';

  if (variant == 'solid') {
    className =
      'inline-flex gap-[10px] items-center justify-center md:w-[200px] w-10/12 text-ocf-yellow disabled:bg-ocf-gray disabled:dark:bg-ocf-gray transition-all duration-500 shadow h-14 max-w-sm text-center rounded-md md:rounded-lg md:font-semibold font-bold text-[16px]';
  }
  if (variant == 'outlined') {
    className = mobile ? mobileInverterLinkClass : desktopInverterLinkClass;
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
