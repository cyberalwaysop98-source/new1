// Placeholder contract (revised plan): renders a layered CSS gradient field in
// sumi/vermilion when no src is set (the current state — see src/assets/manifest.js),
// and a real <video> the moment webm/mp4 paths are filled in. Scrubbed scale and
// marquee motion in the sections that use this must work identically against
// either render path — this component only decides what paints, never how it's
// animated (that's the caller's GSAP target via `mediaRef`).
import { forwardRef } from 'react';
import './ambientMedia.css';

const AmbientMedia = forwardRef(function AmbientMedia(
  { webm, mp4, poster, alt = '', className = '', variant = 'default' },
  mediaRef
) {
  const hasVideo = Boolean(webm || mp4);

  if (!hasVideo) {
    return (
      <div
        ref={mediaRef}
        className={`ambient-media ambient-media--placeholder ambient-media--${variant} ${className}`}
        role="img"
        aria-label={alt}
      />
    );
  }

  return (
    <video
      ref={mediaRef}
      className={`ambient-media ambient-media--video ${className}`}
      muted
      loop
      playsInline
      preload="none"
      poster={poster ?? undefined}
      aria-label={alt}
    >
      {webm && <source src={webm} type="video/webm" />}
      {mp4 && <source src={mp4} type="video/mp4" />}
    </video>
  );
});

export default AmbientMedia;
