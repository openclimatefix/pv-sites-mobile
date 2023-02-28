import Input from '~/components/Input';
import { withPageAuthRequired } from '~/lib/auth';
import Modal from 'components/Modal';

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
      <Modal />
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
          placeholder: '135º',
          min: '0',
          max: '360',
          step: 'any',
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
          placeholder: '40º',
          min: '0',
          max: '360',
          step: 'any',
          required: true,
          onKeyDown: preventMinus,
        }}
      />

      <Input
        label={
          <>
            Solar panel capacity
            <span className="text-xs font-normal"> (optional)</span>
          </>
        }
        id="solar-panel-capacity"
        inputProps={{
          type: 'number',
          placeholder: '2800 kW',
          min: '0',
          step: 'any',
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
