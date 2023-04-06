import { useEffect, RefObject } from 'react';

/**
 * Determines if the user clicked outside the ref
 * @param ref reference to an HTML component
 * @param handle function to call after a click outside the ref is detected
 */
const useClickedOutside = (ref: RefObject<any>, handler: () => void) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target)) {
        handler();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [ref, handler]);
};

export default useClickedOutside;
