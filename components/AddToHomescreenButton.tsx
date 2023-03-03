import { useState, useEffect, Fragment } from 'react';
import { useAddToHomescreenPrompt } from '../lib/useAddToHomescreenPrompt';

export const AddToHomescreenButton = () => {
  const [prompt, promptToInstall] = useAddToHomescreenPrompt();
  const [_, setVisibleState] = useState(false);

  useEffect(() => {
    if (prompt) {
      setVisibleState(true);
    }
  }, [prompt]);

  return (
    <button
      onClick={promptToInstall}
      className="bg-ocf-yellow disabled:bg-ocf-gray text-black font-bold py-2 px-4 rounded shadow h-10 w-auto max-w-xs absolute top-7 right-6 md:block hidden"
    >
      Add to Home Screen
    </button>
  );
};
