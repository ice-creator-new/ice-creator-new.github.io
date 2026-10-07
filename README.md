# ICE

Personal homepage — GitHub Pages user site.

**Live:** https://ice-creator-new.github.io

## Architecture (2026-10 redesign)

Direction **6 desktop + 1 mobile** (see design spec):

| Track | When | Behavior |
| --- | --- | --- |
| Desktop 3D | ≥1024px, no `prefers-reduced-motion`, WebGL OK | Sticky Three.js canvas; scroll drives camera keyframes |
| Letter | Mobile / reduced-motion / WebGL fail | No Three.js download; Hero `ICE` letter choreography |

- `assets/tokens.css` — design tokens (color, space, type, motion)
- `assets/site.css` — layout & components
- `assets/site.js` — track detection + nav; **dynamic-imports** `stage3d.js` only on 3D track
- `assets/stage3d.js` — Three.js stage (CDN ES module); procedural placeholder; set `MODEL_URL` for a real glTF

Blog site (icesniper.vercel.app) is separate and untouched.

## Edit

| File | What to change |
| --- | --- |
| `index.html` | Copy, links, featured cards |
| `assets/tokens.css` | Palette / spacing |
| `assets/site.css` | Layout |
| `assets/stage3d.js` | Camera keyframes, `MODEL_URL` |

## Preview

Serve the repo root over HTTP (ES modules need a server):

```bash
npx --yes serve -l 4173 .
# open http://localhost:4173
```

Desktop: width ≥1024. Mobile / reduce: DevTools device mode or OS “Reduce motion”.

GitHub Pages serves `main` from the repo root.
