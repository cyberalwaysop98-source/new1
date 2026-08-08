import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../../lib/reducedMotion';

export default function SplitText({
  text = '',
  className = '',
  tag: Tag = 'h1',
  delay = 100,
  splitBy = 'characters', // 'characters' | 'words'
  animationFrom = { opacity: 0, transform: 'translate3d(0, 30px, 0)' },
  animationTo = { opacity: 1, transform: 'translate3d(0, 0, 0)' },
  threshold = 0.2,
  rootMargin = '0px',
  onLetterAnimationComplete,
}) {
  const [inView, setInView] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (containerRef.current) {
            observer.unobserve(containerRef.current);
          }
        }
      },
      { threshold, rootMargin }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const items = splitBy === 'words' ? text.split(' ') : [...text];

  return (
    <Tag
      ref={containerRef}
      className={`split-text ${className}`}
      aria-label={text}
      style={{ display: 'inline-block', overflow: 'hidden' }}
    >
      {items.map((item, index) => {
        const isSpace = item === ' ';
        const style = inView
          ? {
              ...animationTo,
              transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)`,
              transitionDelay: `${index * delay}ms`,
              display: 'inline-block',
              willChange: 'transform, opacity',
            }
          : {
              ...animationFrom,
              display: 'inline-block',
              willChange: 'transform, opacity',
            };

        return (
          <span
            key={`${item}-${index}`}
            aria-hidden="true"
            style={style}
            onTransitionEnd={() => {
              if (index === items.length - 1 && onLetterAnimationComplete) {
                onLetterAnimationComplete();
              }
            }}
          >
            {isSpace ? '\u00A0' : item}
            {splitBy === 'words' && index < items.length - 1 ? '\u00A0' : ''}
          </span>
        );
      })}
    </Tag>
  );
}
