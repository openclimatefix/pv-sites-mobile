import { useState } from 'react';
import { useRouter } from 'next/router';

import Input from '~/components/Input';
import { withPageAuthRequired } from '~/lib/auth';
import Modal from 'components/Modal';

import { useFormContext } from '~/lib/context/form_context';
import BackButton from 'components/BackButton';

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
  const router = useRouter();
  const { setFormData } = useFormContext();
  const [show, setShow] = useState<boolean>(false);
  const [direction, setDirection] = useState('');
  const [tilt, setTilt] = useState('');
  const [capacity, setCapacity] = useState('');

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // TODO: Add schema validation with zod

    setFormData(parseInt(direction), parseInt(tilt), parseInt(capacity));
    router.push('/dashboard');
  };

  return (
    <>
      <BackButton />
      <form onSubmit={onSubmit}>
        <h1 className="font-bold text-4xl mt-2 dark:text-ocf-gray mb-5">
          Site Details
        </h1>

        <Input
          id="solar-panel-direction"
          label="Solar panel direction"
          description="(0º = North, 90º = East, 180º = South, 270º = West)"
          value={direction}
          help="I don't know"
          onHelpClick={() => setShow(true)}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setDirection(e.currentTarget.value)
          }
          inputProps={{
            type: 'number',
            placeholder: '135º',
            min: '0',
            max: '360',
            step: 'any',
            required: true,
            onKeyDown: preventMinus,
            pattern: '[0-9]*',
            inputMode: 'numeric',
          }}
        />

        <Input
          id="solar-panel-tilt"
          label="Solar panel tilt"
          description="(Degrees above the horizontal)"
          value={tilt}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTilt(e.currentTarget.value)
          }
          inputProps={{
            type: 'number',
            placeholder: '40º',
            min: '0',
            max: '360',
            step: 'any',
            required: true,
            onKeyDown: preventMinus,
            pattern: '[0-9]*',
            inputMode: 'numeric',
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
          value={capacity}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setCapacity(e.currentTarget.value)
          }
          inputProps={{
            type: 'number',
            placeholder: '2800 kW',
            min: '0',
            step: 'any',
            onKeyDown: preventMinus,
            pattern: '[0-9]*',
            inputMode: 'numeric',
          }}
        />

        <button className="bg-ocf-yellow dark:bg-ocf-yellow shadow h-14 w-full text-center rounded-md font-bold text-xl uppercase block mt-8 peer-invalid:bg-ocf-gray-300 transition duration-150">
          Next
        </button>
        <Modal show={show} setShow={setShow} />
      </form>
    </>
  );
};

export default Form;

export const getServerSideProps = withPageAuthRequired();
