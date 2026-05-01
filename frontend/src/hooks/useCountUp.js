import { useState, useEffect } from 'react';

export const useCountUp = (target, duration = 1500) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16); // Approx 60fps
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16); // ~60fps

    return () => clearInterval(timer);
  }, [target, duration]);

  return count;
};