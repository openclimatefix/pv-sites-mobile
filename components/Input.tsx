import { FC } from 'react';
import { camelCaseID } from '~/lib/utils';

interface InputProps {
  id: string;
  label: React.ReactNode;
  description?: string;
  help?: string;
  inputProps?: React.HTMLProps<HTMLInputElement>;
}
const Input: FC<InputProps> = ({
  id,
  label,
  description,
  help,
  inputProps,
}) => {
  return (
    <>
      <label
        className="font-[600] text-lg dark:text-ocf-gray pb-3 block mt-8"
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
        {...inputProps}
        className="text-lg text-center border bg-ocf-gray-50 text-ocf-gray-700 rounded-lg block h-14 p-2.5 outline-none focus:ring-1 ring-ocf-yellow dark:bg-ocf-gray-1000 dark:border-ocf-gray-1000  dark:placeholder-ocf-gray-800 dark:text-ocf-gray-600 w-full peer placeholder-shown:invalid:ring-ocf-yellow invalid:ring-ocf-orange-800"
      />
      {help && (
        <button
          type="button"
          className="text-ocf-gray-800 underline underline-offset-2 ml-auto text-xs mt-1 bg-transparent block"
        >
          {help}
        </button>
      )}
    </>
  );
};

export default Input;
