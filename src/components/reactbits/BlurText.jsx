import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../../lib/reducedMotion';

export default function BlurText({
  text = '',
  className = '',
  tag: Tag = 'span',
  delay = 120,
  animateBy = 'letters', // 'words' | 'letters'
  direction = 'top', // 'top' | 'bottom'
  threshold = 0.2,
  rootMargin = '0px',
  onAnimationComplete,
}) {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
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

  const elements = animateBy === 'words' ? text.split(' ') : [...text];
  const translateY = direction === 'top' ? '-15px' : '15px';

  return (
    <Tag
      ref={ref}
      className={`blur-text ${className}`}
      aria-label={text}
      style={{ display: 'inline-block' }}
    >
      {elements.map((el, i) => {
        const isSpace = el === ' ';
        const style = inView
          ? {
              filter: 'blur(0px)',
              opacity: 1,
              transform: 'translate3d(0, 0, 0)',
              transition: `filter 0.9s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)`,
              transitionDelay: `${i * delay}ms`,
              display: 'inline-block',
              willChange: 'filter, opacity, transform',
            }
          : {
              filter: 'blur(12px)',
              opacity: 0,
              transform: `translate3d(0, ${translateY}, 0)`,
              display: 'inline-block',
              willChange: 'filter, opacity, transform',
            };

        return (
          <span
            key={`${el}-${i}`}
            aria-hidden="true"
            style={style}
            onTransitionEnd={() => {
              if (i === elements.length - 1 && onAnimationComplete) {
                onAnimationComplete();
              }
            }}
          >
            {isSpace ? '\u00A0' : el}
            {animateBy === 'words' && i < elements.length - 1 ? '\u00A0' : ''}
          </span>
        );
      })}
    </Tag>
  );
}
