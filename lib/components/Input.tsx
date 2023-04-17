import { FC } from 'react';
import { camelCaseID } from '~/lib/utils';

interface InputProps {
  id: string;
  label: React.ReactNode;
  description?: string;
  help?: string;
  onHelpClick?: () => void;
  inputProps?: React.HTMLProps<HTMLInputElement>;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const Input: FC<InputProps> = ({
  id,
  label,
  description,
  help,
  onHelpClick,
  inputProps,
  value,
  onChange,
}) => {
  return (
    <>
      <label
        className="font-[600] text-lg dark:text-ocf-gray pb-1 block short:mt-4 mt-8"
        htmlFor={id}
      >
        {label}
        {description && (
          <span className="text-ocf-gray-900 text-xs pt-1 dark:text-ocf-gray-800 font-normal block">
            {description}
          </span>
        )}
      </label>
      <input
        name={camelCaseID(id)}
        id={id}
        value={value}
        onChange={onChange}
        {...inputProps}
        className="text-lg text-center md:text-left border bg-ocf-gray-50 text-ocf-gray-700 rounded-lg block h-14 p-2.5 outline-none focus:ring-1 ring-ocf-yellow dark:bg-ocf-black-500 dark:border-ocf-black-500  dark:placeholder-ocf-gray-800 dark:text-ocf-gray-600 w-full peer placeholder-shown:invalid:ring-ocf-yellow invalid:ring-ocf-orange-800"
      />
      {help && (
        <button
          type="button"
          className="text-ocf-gray-800 underline underline-offset-2 ml-auto text-xs mt-1 bg-transparent block"
          onClick={onHelpClick}
        >
          {help}
        </button>
      )}
    </>
  );
};

export default Input;
