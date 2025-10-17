// client/src/hooks/useScrollPosition.js
import { useState, useEffect } from 'react';

// This is a custom hook that tracks the user's vertical scroll position.
export const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    // Function to update the state with the window's scroll position
    const handleScroll = () => {
      setScrollPosition(window.pageYOffset);
    };

    // Add a 'scroll' event listener to the window when the component mounts
    window.addEventListener('scroll', handleScroll);

    // This is a "cleanup" function. React runs this when the component
    // unmounts to prevent memory leaks.
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // The empty array means this effect only runs once

  return scrollPosition;
};