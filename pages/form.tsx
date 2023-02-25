import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import OCFButton from '~/components/ocf_button';

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

const inputClassName =
  'mt-3 text-lg text-center bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block h-14 p-2.5 hover:ring-ocf-yellow hover:border-ocf-yellow  dark:bg-ocf-gray-800 dark:border-ocf-gray-800 dark:placeholder-ocf-gray-900 dark:text-ocf-gray';
const h2ClassName = 'font-medium text-lg dark:text-ocf-gray';
const pClassName = 'text-ocf-gray-900 text-xs mt-1 dark:text-ocf-gray-800';

const Form = () => {
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          const formData = new FormData(e.currentTarget);

          const solarPanelData: PanelFormDataBody = {
            solarPanelDirection: parseFloat(
              formData.get('solarPanelDirection') as string
            ),
            solarPanelAngleTilt: parseFloat(
              formData.get('solarPanelAngleTilt') as string
            ),
            solarPanelCapacity: parseFloat(
              formData.get('solarPanelCapacity') as string
            ),
          };
        } catch (e) {
          console.error(`onSubmit(): ${e}`);
        }
      }}
    >
      <div>
        <h1 className="font-bold text-4xl mt-20 dark:text-ocf-gray">
          Panel Details
        </h1>
      </div>
      <div className="my-8">
        <h2 className={h2ClassName}>Solar panel direction</h2>
        <p className={pClassName}>
          (0º = North, 90º = East, 180º = South, 270º = West)
        </p>
        <input
          required
          name="solarPanelDirection"
          type="number"
          placeholder="170º"
          onKeyDown={preventMinus}
          min="0"
          max="360"
          className={`${inputClassName} w-20`}
        />
        <p className={`${pClassName} underline`}>I don&apos;t know</p>
      </div>

      <div className="my-8">
        <h2 className={h2ClassName}>Solar panel angle tilt</h2>
        <p className={pClassName}>(Degrees above the horizontal)</p>
        <input
          required
          name="solarPanelAngleTilt"
          type="number"
          placeholder="30º"
          min="0"
          max="360"
          onKeyDown={preventMinus}
          className={`${inputClassName} w-20`}
        />
      </div>

      <div className="my-8">
        <div className="flex flex-row justify-start items-center w-full">
          <h2 className={h2ClassName}>Solar panel capacity</h2>
          <p className={pClassName}>(optional)</p>
        </div>
        <input
          name="solarPanelCapacity"
          type="number"
          placeholder="3000 W"
          min="0"
          onKeyDown={preventMinus}
          className={`${inputClassName} w-28`}
        />
      </div>

      <div className="flex justify-center items-center w-full mt-24">
        <OCFButton>
          Next
        </OCFButton>
      </div>
    </form>
  );
};

export default Form;

export const getServerSideProps = withPageAuthRequired();
