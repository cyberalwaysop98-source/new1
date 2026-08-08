import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '../../lib/reducedMotion';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollFloat({
  children,
  className = '',
  offsetY = 30,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion() || !containerRef.current) return;

    const el = containerRef.current;
    const tween = gsap.fromTo(
      el,
      { y: offsetY, opacity: 0.8 },
      {
        y: -offsetY,
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5,
        },
      }
    );

    return () => {
      tween.kill();
    };
  }, [offsetY]);

  return (
    <div ref={containerRef} className={`scroll-float ${className}`}>
      {children}
    </div>
  );
}
