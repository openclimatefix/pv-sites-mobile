import { FC } from 'react';
import { withPageAuthRequired } from '~/lib/auth';
import { camelCaseID } from '~/lib/utils';

interface PanelFormDataBody {
  solarPanelDirection: number;
  solarPanelAngleTilt: number;
  solarPanelCapacity: number;
}

/**
 * Prevent users from entering negative numbers into input fields
 * @param e React.KeyboardEvent<HTMLInputElement> Represents a single interaction between the user and a key
 * @returns True if the character is valid
 */
const preventMinus = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.code === 'Minus') {
    e.preventDefault();
  }
};

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

const Form = () => {
  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // TODO: Add schema validation with zod
    const siteDetailsData = Object.entries(
      formData
    ) as unknown as PanelFormDataBody;
  };

  return (
    <form onSubmit={onSubmit}>
      <h1 className="font-bold text-4xl mt-20 dark:text-ocf-gray mb-5">
        Site Details
      </h1>

      <Input
        id="solar-panel-direction"
        label="Solar panel direction"
        description="(0º = North, 90º = East, 180º = South, 270º = West)"
        help="I don't know"
        inputProps={{
          type: 'number',
          placeholder: '170º',
          min: '0',
          max: '360',
          required: true,
          onKeyDown: preventMinus,
        }}
      />

      <Input
        id="solar-panel-tilt"
        label="Solar panel tilt"
        description="(Degrees above the horizontal)"
        inputProps={{
          type: 'number',
          placeholder: '30º',
          min: '0',
          max: '360',
          required: true,
          onKeyDown: preventMinus,
        }}
      />

      <Input
        label={
          <>
            Solar panel capacity
            <span className="text-xs font-normal">(optional)</span>
          </>
        }
        id="solar-panel-capacity"
        inputProps={{
          type: 'number',
          placeholder: '30º',
          min: '0',
          max: '360',
          onKeyDown: preventMinus,
        }}
      />

      <button className="bg-ocf-yellow dark:bg-ocf-yellow shadow h-14 w-full text-center rounded-md font-bold text-xl uppercase block mt-8 peer-invalid:bg-ocf-gray-300 transition duration-150">
        Next
      </button>
    </form>
  );
};

export default Form;

export const getServerSideProps = withPageAuthRequired();
