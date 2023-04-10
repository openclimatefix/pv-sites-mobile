import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function useNoScroll() {
  const router = useRouter();
  useEffect(() => {
    window.history.scrollRestoration = 'manual';

    router.beforePopState((state) => {
      state.options.scroll = false;
      return true;
    });
  }, [router]);
}
