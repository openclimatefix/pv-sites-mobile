import { FC, PropsWithChildren } from 'react';
import { overrideTailwindClasses } from 'tailwind-override';

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
  const buttonClass = `inline-flex gap-[10px] items-center justify-center text-center h-[50px] h-[50px] w-[200px] md:text-base text-xl transition-all duration-300 rounded-md md:font-semibold font-bold `;
  const outlinedButton = `text-ocf-yellow border-ocf-yellow border-[2px] hover:bg-ocf-yellow hover:text-black`;
  const solidButton = `bg-ocf-yellow text-black disabled:bg-ocf-gray disabled:text-ocf-black-600`;

  return (
    <button
      suppressHydrationWarning
      form={form}
      onClick={onClick}
      disabled={disabled}
      className={overrideTailwindClasses(
        `${buttonClass} ${
          variant === 'solid' ? solidButton : outlinedButton
        }  ${className}  ${hidden && `${hidden}:hidden`}`
      )}
    >
      {children}
    </button>
  );
};

export default Button;
