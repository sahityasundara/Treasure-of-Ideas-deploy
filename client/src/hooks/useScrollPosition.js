import { useState, useEffect } from 'react';

// This custom hook tracks the vertical scroll position of the page.
export const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    // This function updates the state with the current scroll position
    const updatePosition = () => {
      setScrollPosition(window.pageYOffset);
    };

    // Add an event listener when the component mounts
    window.addEventListener('scroll', updatePosition);

    // Call it once to set the initial position
    updatePosition();

    // Cleanup function: remove the event listener when the component unmounts
    return () => window.removeEventListener('scroll', updatePosition);
  }, []); // The empty array ensures this effect only runs on mount and unmount

  return scrollPosition;
};


