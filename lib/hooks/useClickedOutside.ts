import { useEffect, RefObject } from 'react';

/**
 * Determines if the user clicked outside the ref
 * @param ref reference to an HTML component
 * @param handle function to call after a click outside the ref is detected
 */
const useClickedOutside = (ref: RefObject<any>, handler: () => void) => {
  useEffect(() => {
    /**
     * Call handler() if clicked on outside of element
     */
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        handler();
      }
    };
    // Bind the event listener
    document.addEventListener('click', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('click', handleClickOutside);
    };
  }, [ref, handler]);
};

export default useClickedOutside;
