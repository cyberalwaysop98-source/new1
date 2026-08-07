// DESIGN.md §6.5 placeholder renderer. Draws the pour-over as sumi-e ink
// strokes — kettle tilt, stream, bloom, drips, carafe filling, steam — using
// the exact `render(p)` signature the real frame sequence will use once
// USE_FRAMES flips (src/assets/manifest.js). Swapping to real frames only
// touches src/sections/Ritual.jsx, never this file's call contract.
//
// Deterministic: every value here is a pure function of `p` (0–1) and time
// `t` for the ambient steam drift, never Math.random(), so scrubbing forward
// and backward through the same `p` twice paints identically — required for
// it to double as a stand-in for a real, seekable frame sequence.

// These literals are a permitted exception to DESIGN.md §3's six-value rule — see
// the "Two permitted colour literals outside this block" note there. Canvas 2D
// takes colour strings and cannot read CSS custom properties; resolving them would
// mean a getComputedStyle call per frame inside the render loop, which §9's 60fps
// scrub budget forbids. They mirror --sumi, --washi and --shu and must be updated
// by hand if those tokens change.
const SUMI = '#0B0A09';
const WASHI = 'rgba(232, 225, 212, ALPHA)';
const SHU = 'rgba(140, 42, 30, ALPHA)';

function ink(alpha) {
  return WASHI.replace('ALPHA', String(alpha));
}
function lacquer(alpha) {
  return SHU.replace('ALPHA', String(alpha));
}

// Three acts across progress, matching the captions in §6.5: 一 湯 / 二 蒸らし / 三 抽出.
function segment(p) {
  const seg = Math.min(2, Math.floor(p * 3));
  const local = Math.min(1, Math.max(0, p * 3 - seg));
  return { seg, local };
}

function steam(ctx, cx, cy, spread, t, alpha) {
  ctx.save();
  ctx.strokeStyle = ink(alpha);
  ctx.lineWidth = 1.4;
  ctx.lineCap = 'round';
  for (let i = 0; i < 3; i++) {
    const ox = cx + (i - 1) * spread;
    const wobble = Math.sin(t * 1.3 + i * 2.1) * 10;
    ctx.beginPath();
    ctx.moveTo(ox, cy);
    ctx.bezierCurveTo(
      ox + wobble, cy - 40,
      ox - wobble, cy - 90,
      ox + wobble * 0.6, cy - 150
    );
    ctx.stroke();
  }
  ctx.restore();
}

function drawKettleAndPour(ctx, W, H, local, t) {
  const cx = W * 0.32;
  const cy = H * 0.22;
  const tilt = local * 0.5; // radians, kettle tips as it pours

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-0.15 - tilt);
  ctx.strokeStyle = ink(0.85);
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(0, 0, 70, 46, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(60, -6);
  ctx.quadraticCurveTo(120, -10, 150, 10);
  ctx.stroke();
  ctx.restore();

  // stream, only once tilt has progressed
  if (local > 0.12) {
    const streamAlpha = Math.min(1, (local - 0.12) * 3);
    ctx.save();
    ctx.strokeStyle = ink(0.5 * streamAlpha);
    ctx.lineWidth = 2;
    const sx = cx + 150 * Math.cos(-0.15 - tilt) - 10;
    const sy = cy + 10 + 150 * Math.sin(-0.15 - tilt) * 0.3;
    const ex = W * 0.5;
    const ey = H * 0.62;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.quadraticCurveTo(
      sx + (ex - sx) * 0.5 + Math.sin(t * 4) * 3,
      sy + (ey - sy) * 0.6,
      ex,
      ey
    );
    ctx.stroke();
    ctx.restore();
  }

  steam(ctx, cx - 10, cy - 30, 18, t, 0.18);
}

function drawDripper(ctx, W, H) {
  const cx = W * 0.5;
  const topY = H * 0.6;
  const botY = H * 0.72;
  const topW = 190;
  const botW = 60;

  ctx.save();
  ctx.strokeStyle = ink(0.7);
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx - topW / 2, topY);
  ctx.lineTo(cx - botW / 2, botY);
  ctx.lineTo(cx + botW / 2, botY);
  ctx.lineTo(cx + topW / 2, topY);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();

  return { cx, topY, botY, topW, botW };
}

function drawBloom(ctx, cx, topY, topW, local, t) {
  const bedY = topY + 30;
  const swell = 1 + local * 0.22;
  ctx.save();
  ctx.translate(cx, bedY);
  ctx.scale(swell, swell * 0.7);

  ctx.fillStyle = lacquer(0.5);
  ctx.beginPath();
  const r = topW * 0.4;
  const points = 14;
  for (let i = 0; i <= points; i++) {
    const a = (i / points) * Math.PI * 2;
    const jag = 1 + Math.sin(a * 4 + t * 0.6) * 0.06 * local;
    const px = Math.cos(a) * r * jag;
    const py = Math.sin(a) * r * 0.5 * jag;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();

  // crack lines once bloom is well underway
  if (local > 0.4) {
    ctx.strokeStyle = ink(0.35);
    ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
      const a = i * 1.6 + t * 0.1;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(a) * r * 0.8, Math.sin(a) * r * 0.4);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function drawDripsAndCarafe(ctx, W, H, cx, botY, local, t) {
  const carafeTop = H * 0.78;
  const carafeBot = H * 0.94;
  const carafeW = 130;

  // carafe outline
  ctx.save();
  ctx.strokeStyle = ink(0.6);
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(cx - carafeW / 2, carafeTop);
  ctx.lineTo(cx - carafeW / 2 - 10, carafeBot);
  ctx.lineTo(cx + carafeW / 2 + 10, carafeBot);
  ctx.lineTo(cx + carafeW / 2, carafeTop);
  ctx.stroke();

  // rising liquid
  const fillH = (carafeBot - carafeTop - 6) * local;
  ctx.fillStyle = lacquer(0.55);
  ctx.beginPath();
  ctx.rect(cx - carafeW / 2 + 4, carafeBot - fillH, carafeW - 8, fillH);
  ctx.fill();
  ctx.restore();

  // falling drip, cycles a few times per segment for motion read
  const dripCycle = (t * 1.6) % 1;
  if (dripCycle < 0.6) {
    const dy = carafeTop - (carafeTop - botY) * (1 - dripCycle / 0.6);
    ctx.save();
    ctx.fillStyle = ink(0.6);
    ctx.beginPath();
    ctx.ellipse(cx, dy, 3, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

export function renderRitual(ctx, p, W, H, t = 0) {
  ctx.save();
  ctx.fillStyle = SUMI;
  ctx.fillRect(0, 0, W, H);

  const { seg, local } = segment(p);
  const { cx, topY, botY, topW } = drawDripper(ctx, W, H);

  if (seg === 0) {
    drawKettleAndPour(ctx, W, H, local, t);
    // faint bed waiting, not yet blooming
    drawBloom(ctx, cx, topY, topW, 0, t);
  } else if (seg === 1) {
    drawBloom(ctx, cx, topY, topW, local, t);
    steam(ctx, cx, topY - 10, 22, t, 0.14);
  } else {
    drawBloom(ctx, cx, topY, topW, 1, t);
    drawDripsAndCarafe(ctx, W, H, cx, botY, local, t);
    steam(ctx, cx, topY - 10, 22, t, 0.1);
  }

  ctx.restore();
}
