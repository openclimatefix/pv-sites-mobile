import { useEffect, RefObject } from 'react';

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
