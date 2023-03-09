import Cookies from 'js-cookie';
import { useEffect, useRef, useState } from 'react';

declare global {
  /**
   * The BeforeInstallPromptEvent is fired at the Window.onbeforeinstallprompt handler
   * before a user is prompted to "install" a web site to a home screen on mobile.
   *
   */
  interface BeforeInstallPromptEvent extends Event {
    /**
     * Returns an array of DOMString items containing the platforms on which the event was dispatched.
     * This is provided for user agents that want to present a choice of versions to the user such as,
     * for example, "web" or "play" which would allow the user to chose between a web version or
     * an Android version.
     */
    readonly platforms: Array<string>;

    /**
     * Returns a Promise that resolves to a DOMString containing either "accepted" or "dismissed".
     */
    readonly userChoice: Promise<{
      outcome: 'accepted' | 'dismissed';
      platform: string;
    }>;

    /**
     * Allows a developer to show the install prompt at a time of their own choosing.
     * This method returns a Promise.
     */
    prompt(): Promise<void>;
  }
}

/**
 * Handle installing website as a PWA
 */
export function usePWAInstall({ cookieName }: { cookieName: string }) {
  const beforeInstallPromptEvent = useRef<
    BeforeInstallPromptEvent | undefined
  >();
  const userChoice = useRef<'dismissed' | 'accepted' | undefined>();
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  async function installPWA() {
    if (!beforeInstallPromptEvent.current) {
      throw new Error('must wait for before install prompt event');
    }

    beforeInstallPromptEvent.current.prompt();
    const { outcome } = await beforeInstallPromptEvent.current.userChoice;

    if (!mounted.current) return;

    hideInstallPrompt(outcome === 'accepted' ? true : false);

    beforeInstallPromptEvent.current = undefined;
  }

  function hideInstallPrompt(accepted: boolean) {
    setShowInstallPrompt(false);
    beforeInstallPromptEvent.current = undefined;
    if (!accepted) {
      Cookies.set(cookieName, '1', { expires: 1, sameSite: 'Strict' });
    } else {
      Cookies.remove(cookieName);
    }
  }

  useEffect(() => {
    function onAppInstalled() {
      //TODO - send to analytics
    }

    function onBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      // Stash the event so it can be triggered later.
      beforeInstallPromptEvent.current = e as BeforeInstallPromptEvent;

      //guard: sometimes this event fires when user clicks "cancel" in chrome ui (linux)
      if (!userChoice.current) {
        if (!Cookies.get(cookieName)) {
          setShowInstallPrompt(true);
        }
      }
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, [cookieName]);

  return [showInstallPrompt, installPWA] as const;
}
