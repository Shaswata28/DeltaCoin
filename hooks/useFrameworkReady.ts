import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export function useFrameworkReady() {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    
    if (typeof window !== 'undefined' && window.frameworkReady) {
      window.frameworkReady();
    }

    return () => {
      isMounted.current = false;
    };
  }, []);

  return isMounted.current;
}