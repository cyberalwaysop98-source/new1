# CLAUDE.md

NOIR is a cinematic single-page site for a seven-seat kissaten in Tomigaya, Tokyo, built to make a stranger feel the room and book a seat.

Read DESIGN.md before any task in this repo.

## 10. Anti-patterns

Reject these in review, they are the failure modes for this specific design:

- Vermilion used as a glow, fill, or gradient → it becomes a generic dark-mode SaaS site.
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

WORKFLOW.md holds the phase order and must not be skipped.
