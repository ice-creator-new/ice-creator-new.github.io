# ICE

Personal homepage — GitHub Pages user site.

**Live:** https://ice-creator-new.github.io

## Architecture (2026-10 · v3.2 dense)

**Portfolio + SVG wallpaper parallax + dense content** — cold steel / warm white palette B. Frosted glass sticky nav. No 3D / Three.js / theme switcher / empty placeholder cards.

| Layer | Behavior |
| --- | --- |
| Wallpaper | Fixed 3-layer inline SVG (far / mid / near) + vignette; scroll parallax on desktop |
| Nav | Frosted glass (`blur(18px) saturate`); opaque fallback without backdrop / reduced transparency |
| Motion | `prefers-reduced-motion` → static wallpaper; mobile drops near layer & halves k |
| Reveal | Sections default visible (no-JS readable); JS + full motion fades in |
| Work | Three real links — blog · Pulse · awesome-time |
| Stack | Six workbench cards (how Ice works, not an ad wall) |

- `assets/tokens.css` — design tokens (palette B, glass, space, type, parallax k)
- `assets/site.css` — layout, wallpaper, frosted nav, components
- `assets/site.js` — reveal + parallax + nav scroll deepen

Blog site (icesniper.vercel.app) is separate and untouched.

Design source of truth: SPEC v3.2 dense (`personal-site-gh-pages-spec-v3.2-dense`).

## Edit

| File | What to change |
| --- | --- |
| `index.html` | Copy, links, wallpaper SVG |
| `assets/tokens.css` | Palette / glass / spacing / motion |
| `assets/site.css` | Layout & components |
| `assets/site.js` | Reveal / parallax / nav |

## Preview

```bash
npx --yes serve -l 4173 .
# open http://localhost:4173
```

Or open `index.html` directly (Google Fonts need network).

GitHub Pages serves `main` from the repo root.
