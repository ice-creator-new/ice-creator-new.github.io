# ICE

Personal homepage — GitHub Pages user site.

**Live:** https://ice-creator-new.github.io

## Architecture (2026-10 · Direction A)

**Typography + letter choreography** — no 3D / Three.js / empty stage.

| Layer | Behavior |
| --- | --- |
| L0 Hero | Oversized split `ICE` letter stagger (`prefers-reduced-motion` → static final state) |
| L1 Sections | IntersectionObserver fade/slide on Featured / About / Contact |
| L1.5 Trace | Optional thin SVG stroke under Featured (≥768; hidden when reduce) |
| Layout | Single-column IA all breakpoints; ≥768 featured cards 3-across |

- `assets/tokens.css` — design tokens (color, space, type, motion)
- `assets/site.css` — layout & components
- `assets/site.js` — nav highlight + scroll reveal + `data-motion`

Blog site (icesniper.vercel.app) is separate and untouched.

Design source of truth: SPEC v2 typography package (`personal-site-gh-pages-spec-v2-typography`).

## Edit

| File | What to change |
| --- | --- |
| `index.html` | Copy, links, featured cards |
| `assets/tokens.css` | Palette / spacing / motion |
| `assets/site.css` | Layout & components |

## Preview

```bash
npx --yes serve -l 4173 .
# open http://localhost:4173
```

Or open `index.html` directly (no CDN / no ES-module hard deps beyond `site.js`).

GitHub Pages serves `main` from the repo root.
