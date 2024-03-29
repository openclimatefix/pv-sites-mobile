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
        className="text-md mt-4 block pb-1 font-[500] dark:text-ocf-gray"
        htmlFor={id}
      >
        {label}
        {description && (
          <span className="block pt-1 text-xs font-normal text-ocf-gray-900 dark:text-ocf-gray-800">
            {description}
          </span>
        )}
      </label>
      <input
        name={camelCaseID(id)}
        id={id}
        value={value ?? ''}
        onChange={onChange}
        {...inputProps}
        className="peer block h-14 w-full rounded-lg border bg-ocf-gray-50 p-2.5 text-center text-lg text-ocf-gray-700 outline-none invalid:ring-1 invalid:ring-ocf-orange-800 placeholder-shown:invalid:ring-0 focus:ring-1 focus:ring-ocf-yellow placeholder-shown:focus:ring-1 dark:border-ocf-black-500 dark:bg-ocf-black-500 dark:text-ocf-gray-600 dark:placeholder-ocf-gray-800 md:text-left"
      />
      {help && (
        <button
          type="button"
          className="-mb-4 ml-auto mt-1 block bg-transparent text-xs text-ocf-gray-800 underline underline-offset-2"
          onClick={onHelpClick}
        >
          {help}
        </button>
      )}
    </>
  );
};

export default Input;
