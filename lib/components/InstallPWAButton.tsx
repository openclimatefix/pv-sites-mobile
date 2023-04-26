import { FC } from 'react';
import { usePWAInstall } from '../pwa';

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
      className="absolute right-6 top-7 hidden h-10 w-auto max-w-xs rounded bg-ocf-yellow px-4 py-2 font-bold text-black shadow disabled:bg-ocf-gray md:block"
    >
      Install
    </button>
  );
};
