import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../../lib/reducedMotion';

export default function ScrollReveal({
  children,
  className = '',
  tag: Tag = 'div',
  baseOpacity = 0,
  enableBlur = true,
  blurStrength = 8,
  threshold = 0.25,
  rootMargin = '0px',
}) {
  const [revealed, setRevealed] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      { threshold, rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const style = revealed
    ? {
        opacity: 1,
        filter: enableBlur ? 'blur(0px)' : 'none',
        transform: 'translate3d(0, 0, 0)',
        transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1), filter 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'opacity, filter, transform',
      }
    : {
        opacity: baseOpacity,
        filter: enableBlur ? `blur(${blurStrength}px)` : 'none',
        transform: 'translate3d(0, 24px, 0)',
        willChange: 'opacity, filter, transform',
      };

  return (
    <Tag ref={ref} className={`scroll-reveal ${className}`} style={style}>
      {children}
    </Tag>
  );
}
