import { FC } from 'react';

type ModalProps = {
  show: boolean;
  setShow: SetShowFunction;
};

type SetShowFunction = (show: boolean) => void;

const Modal: FC<ModalProps> = ({ show, setShow }) => {
  if (!show) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 flex h-full w-full items-center justify-center bg-ocf-black bg-opacity-50"
      onClick={() => setShow(false)}
    >
      <div
        className="h-auto w-72 rounded-lg bg-ocf-gray-1000 px-8 py-6 text-white opacity-100 md:w-1/3"
        onClick={(e: React.MouseEvent<HTMLInputElement>) => e.stopPropagation()}
      >
        <h1 className="text-2xl font-semibold">How to measure: </h1>

        <div className="w-full px-4">
          <ol className="my-3 list-decimal">
            <li>Open your compass app</li>

            <li>
              Point your phone in the direction your solar panel is facing.
            </li>
          </ol>
        </div>

        <div className="w-100 flex h-auto items-center justify-end">
          <button
            className="block h-8 w-20 rounded-md bg-ocf-yellow text-center text-xs font-bold text-ocf-black shadow transition duration-150"
            onClick={() => setShow(false)}
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
