import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../../lib/reducedMotion';

export default function VariableProximity({
  text = '',
  className = '',
  tag: Tag = 'span',
  radius = 120,
}) {
  const containerRef = useRef(null);
  const [letterSpacing, setLetterSpacing] = useState(0.34);

  useEffect(() => {
    if (prefersReducedMotion() || typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    function handleMouseMove(e) {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.hypot(e.clientX - centerX, e.clientY - centerY);

      if (distance < radius) {
        const factor = 1 - distance / radius;
        setLetterSpacing(0.34 + factor * 0.12);
      } else {
        setLetterSpacing(0.34);
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [radius]);

  return (
    <Tag
      ref={containerRef}
      className={`variable-proximity ${className}`}
      style={{
        letterSpacing: `${letterSpacing}em`,
        transition: 'letter-spacing 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {text}
    </Tag>
  );
}
