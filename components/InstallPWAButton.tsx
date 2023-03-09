import { FC } from 'react';
import { usePWAInstall } from '../lib/usePWA';

export const InstallPWAButton: FC = () => {
  const [showInstallPrompt, installPWA] = usePWAInstall({
    cookieName: 'pwaInstallDismissed',
  });

  if (!showInstallPrompt) {
    return null;
  }

  return (
    <button
      onClick={installPWA}
      className="bg-ocf-yellow disabled:bg-ocf-gray text-black font-bold py-2 px-4 rounded shadow h-10 w-auto max-w-xs absolute top-7 right-6 md:block hidden"
    >
      Install
    </button>
  );
};
