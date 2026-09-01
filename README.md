# LandingPage5 — Modern Marketing Landing Page

A polished, conversion-focused landing page featuring a hero section, a three-up features showcase, and an accessible contact form — all built with semantic HTML, a shared design-system stylesheet, and vanilla JavaScript (no build step required).

## What it does
LandingPage5 is a self-contained marketing site that introduces a product, highlights its key capabilities, and lets visitors get in touch. It is designed to be fast, accessible, and easy to adapt.

- **Hero section** — A clear headline, supporting subhead, and primary call-to-action set the tone and drive the visitor toward the next step.
- **Features section** — Three or more product features are presented as scannable cards, each with an icon, title, and short description.
- **Contact form section** — A labeled name / email / message form with inline client-side validation, accessible error messaging, and a non-network submit handler stub.

## Project layout
- `public/index.html` — Single-page markup containing the hero, features, and contact form sections.
- `public/styles/main.css` — Design system tokens (color, type, spacing, radii, shadows) plus hero, features, header, and contact form styles.
- `public/styles/contact-form.css` — Contact form-specific layout, input states, and status messaging.
- `public/scripts/contact-form.js` — Client-side validation, inline error rendering, and a basic submit handler stub.

## Hero section
- Clear headline with gradient accent and supporting subhead framing the value proposition.
- Primary call-to-action button plus secondary ghost action.
- Professional typography hierarchy (Plus Jakarta Sans display + Inter body).
- Accessible, contrast-safe palette over a layered gradient + glow background.
- Responsive layout, full keyboard and screen-reader support, respects `prefers-reduced-motion`.

## Features section
- Section heading and three or more feature blocks, each with an icon, title, and short description.
- Consistent spacing and a responsive grid that adapts cleanly across viewport sizes.
- Polished background treatment that complements the hero without competing with it.
- Accessible typography and semantic structure for assistive technologies.

## Contact form section
- Labeled fields for name, email, and message with a submit button.
- Inline client-side validation for required fields and email format.
- Accessible error messaging with `aria-live` regions and clear visual states.
- Submit handler stub that processes the form locally without making a network request.

## Run locally
This is a static site — no build step or dependencies are required.

Option 1 — open the file directly:
```bash
open public/index.html
```

Option 2 — serve the `public/` directory with any static server, for example:
```bash
npx serve public
```

## Deliverables from this board
- **Hero section** — Headline, subhead, primary CTA, layered gradient background, accessible typography hierarchy, and responsive layout.
- **Features section** — Three-up feature grid with icon, title, and description per item, consistent spacing, and a complementary background treatment.
- **Contact form section** — Labeled name / email / message inputs, inline client-side validation with accessible error messaging, polished form styling, and a non-network submit handler stub.

## Helix quality bar
- Use professional, readable typography (modern web fonts, clear hierarchy, accessible sizes).
- Use a polished professional background (subtle gradients, textures, or patterns — not a flat unfinished page).
- Follow language and framework best practices: clear structure, naming, error handling, security basics, and maintainable code.