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
      className="flex items-center justify-center fixed inset-0 h-full w-full bg-ocf-black bg-opacity-50"
      onClick={() => setShow(false)}
    >
      <div
        className="w-72 h-auto bg-ocf-gray-1000 text-white opacity-100 px-8 py-6 rounded-lg"
        onClick={(e: React.MouseEvent<HTMLInputElement>) => e.stopPropagation()}
      >
        <h1 className="font-semibold text-2xl">How to measure: </h1>

        <div className="w-full px-4">
          <ol className="my-3 list-decimal">
            <li>Open your compass app</li>

            <li>
              Point your phone in the direction your solar panel is facing.
            </li>
          </ol>
        </div>

        <div className="flex w-100 h-auto justify-end items-center">
          <button
            className="bg-ocf-yellow text-ocf-black shadow h-8 w-20 text-center rounded-md font-bold text-xs block transition duration-150"
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
