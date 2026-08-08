# CLAUDE.md

NOIR is a cinematic single-page site for a seven-seat kissaten in Tomigaya, Tokyo, built to make a stranger feel the room and book a seat.

Read DESIGN.md before any task in this repo.

## 10. Anti-patterns

Reject these in review, they are the failure modes for this specific design:

- Vermilion used as a glow, fill, or gradient → it becomes a generic dark-mode SaaS site.
- Vermilion drawn as an **enclosed shape** — a bordered square, badge, pill, or chip. The
  geometry failure, not the glow one: a closed vermilion outline reads as a UI badge however
  restrained the colour is, and it will out-compete the reservation CTA for attention. The
  seal in §6.8 did exactly this and was removed. Vermilion is a rule, a seal-less mark, or one
  word — never a container.
- A Western display serif replacing Shippori Mincho → loses the only distinctive type decision.
- Photographs of coffee cups, latte art, or hands holding mugs → instant stock-photo café.
- Rounded corners, drop shadows, glassmorphism, or any card with a background colour.
- Compressing `vh` padding to "fit more content" → the emptiness is the product.
- Scrubbing a `<video>` element instead of frames.
- Cropping the subject out of the frame sequence to make it fill the viewport. The fit follows
  the source: a portrait master is `contain` (its negative space IS the shot), a 16:9 master is
  `cover` (§6.2). What is never acceptable is a crop that cuts the dripper or strands most of
  the viewport in dead ground — measure before choosing, do not default either way.
- Adding a testimonials section, a logo wall, an Instagram grid, or a newsletter modal.
- More than one animation moving at any given moment.
- **Verifying that an animation RUNS is not verifying that it RENDERS.** Third occurrence of
  this shape in this project, so it is now a rule. A property changing over time proves the
  tween is wired, nothing more. The rail characters rotated exactly as instrumented while laid
  out horizontally at 3px wide — the effect ran perfectly on a broken element. Earlier:
  "0/61 determinism mismatches" scored a frozen canvas as perfect scrub determinism, and
  "CLS 0" scored a page on which nothing moved. **Assert the rendered result — box, position,
  size, orientation — not only the animated value.** If a measurement looks flawless, confirm
  the thing being measured is intact before believing it.
WORKFLOW.md holds the phase order and must not be skipped.
