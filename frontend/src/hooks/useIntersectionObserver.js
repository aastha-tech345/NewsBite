import { useEffect, useRef } from 'react';

const useIntersectionObserver = (callback, { threshold = 0.1, rootMargin = '0px' } = {}) => {
  const ref = useRef(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          callbackRef.current();
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);

    const fallbackTimer = setTimeout(() => {
      const rect = el.getBoundingClientRect();
      const inViewport =
        rect.top < window.innerHeight &&
        rect.bottom > 0 &&
        rect.width > 0 &&
        rect.height > 0;
      if (inViewport) {
        callbackRef.current();
        observer.disconnect();
      }
    }, 200);

    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, [threshold, rootMargin]);

  return ref;
};

export default useIntersectionObserver;
