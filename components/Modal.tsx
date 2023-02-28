import { FC, useState, useEffect } from 'react';
import Sidebar from './SideBar';
import NavBar from './NavBar';

const Modal: FC = () => {
  const [show, setShow] = useState<boolean>(true);

  if (!show) {
    return null;
  }

  const closeOnEscape = (e: MouseEventHandler<HTMLDivElement>') => {
    if ((e.charCode || e.keyCode) === 27) {
      setShow(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center fixed inset-0 h-full w-full bg-ocf-black bg-opacity-50"
      onClick={() => setShow(false)}
    >
      <div
        className="w-80 h-auto bg-ocf-gray-1000 text-white opacity-100 px-8 py-6 rounded-lg"
        onClick={(e: React.KeyboardEvent<HTMLInputElement>) =>
          e.stopPropagation()
        }
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
