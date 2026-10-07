# 3D assets

Placeholder geometry is built in `assets/stage3d.js` (torus + icosahedron + wireframe).

To swap in a real glTF (&lt; 2MB, ideally ≤ 800KB):

1. Put the file here, e.g. `hero.glb`
2. In `stage3d.js`, set `MODEL_URL = "./models/hero.glb"`
3. Camera keyframes stay the same
