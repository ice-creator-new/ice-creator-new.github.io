# ICE

Personal homepage — GitHub Pages user site.

**Live:** https://ice-creator-new.github.io

## Architecture (2026-10 · v3.1b-B)

**Portfolio + SVG wallpaper parallax** — cold steel / warm white palette. No 3D / Three.js / theme switcher / empty placeholder cards.

| Layer | Behavior |
| --- | --- |
| Wallpaper | Fixed 3-layer inline SVG (far / mid / near) + vignette; scroll parallax on desktop |
| Motion | `prefers-reduced-motion` → static wallpaper; mobile drops near layer & halves k |
| Reveal | Sections default visible (no-JS readable); JS + full motion fades in |
| Work | One real link only — icesniper blog card with abstract texture face |

- `assets/tokens.css` — design tokens (palette B, space, type, parallax k)
- `assets/site.css` — layout, wallpaper, components
- `assets/site.js` — reveal + parallax

Blog site (icesniper.vercel.app) is separate and untouched.

Design source of truth: SPEC v3.1b-B (`personal-site-gh-pages-spec-v3.1b`).

## Edit

| File | What to change |
| --- | --- |
| `index.html` | Copy, links, wallpaper SVG |
| `assets/tokens.css` | Palette / spacing / motion |
| `assets/site.css` | Layout & components |
| `assets/site.js` | Reveal / parallax |

## Preview

```bash
npx --yes serve -l 4173 .
# open http://localhost:4173
```

Or open `index.html` directly (Google Fonts need network).

GitHub Pages serves `main` from the repo root.
