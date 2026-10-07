/**
 * Desktop-only Three.js sticky stage.
 * Scroll drives camera keyframes + emissive; procedural placeholder geometry.
 * Loaded only when data-track=3d (dynamic import from site.js).
 *
 * Asset swap: set MODEL_URL to a glTF path (<2MB) later; keyframes stay the same.
 */

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";

/** Future: "./models/hero.glb" — leave null for procedural placeholder */
export const MODEL_URL = null;

const CAMERA_KEYS = [
  // Stronger orbit amplitude; About (≈0.75) stays frontal — avoids torus “cutaway”
  { p: 0.0, pos: [0, 0.4, 4.6], look: [0, 0, 0], emissive: 0.08 },
  { p: 0.22, pos: [-0.35, 0.15, 3.1], look: [0, 0.08, 0], emissive: 0.14 },
  { p: 0.5, pos: [2.1, 0.65, 2.4], look: [0, 0.12, 0], emissive: 0.26 },
  { p: 0.75, pos: [0.85, 0.75, 3.2], look: [0, 0.05, 0], emissive: 0.18 },
  { p: 1.0, pos: [0.1, 0.45, 4.4], look: [0, 0, 0], emissive: 0.08 },
];

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function lerpVec3(a, b, t) {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

function sampleKeys(p) {
  const clamped = Math.min(1, Math.max(0, p));
  let i = 0;
  while (i < CAMERA_KEYS.length - 1 && CAMERA_KEYS[i + 1].p < clamped) i += 1;
  const a = CAMERA_KEYS[i];
  const b = CAMERA_KEYS[Math.min(i + 1, CAMERA_KEYS.length - 1)];
  const span = b.p - a.p || 1;
  const t = (clamped - a.p) / span;
  return {
    pos: lerpVec3(a.pos, b.pos, t),
    look: lerpVec3(a.look, b.look, t),
    emissive: lerp(a.emissive, b.emissive, t),
  };
}

function sectionProgress(sectionIds) {
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  if (!sections.length) return 0;

  const scrollY = window.scrollY;
  const viewMid = scrollY + window.innerHeight * 0.4;
  const first = sections[0];
  const last = sections[sections.length - 1];
  const start = first.offsetTop;
  const end = last.offsetTop + last.offsetHeight * 0.5;
  if (end <= start) return 0;
  return Math.min(1, Math.max(0, (viewMid - start) / (end - start)));
}

function buildPlaceholder(scene) {
  const group = new THREE.Group();

  const accent = new THREE.Color(0x5eead4);
  const base = new THREE.Color(0x1a1f27);

  const torusMat = new THREE.MeshStandardMaterial({
    color: base,
    metalness: 0.55,
    roughness: 0.35,
    emissive: accent,
    emissiveIntensity: 0.08,
  });
  const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.85, 0.28, 32, 64),
    torusMat,
  );
  /* Milder tilt — less ellipsoid cutaway under About camera */
  torus.rotation.x = Math.PI * 0.22;
  group.add(torus);

  const icoMat = new THREE.MeshStandardMaterial({
    color: 0x12151a,
    metalness: 0.2,
    roughness: 0.55,
    emissive: accent,
    emissiveIntensity: 0.05,
    wireframe: false,
  });
  const ico = new THREE.Mesh(new THREE.IcosahedronGeometry(0.55, 0), icoMat);
  ico.position.set(-0.15, 0.1, 0.2);
  group.add(ico);

  const wire = new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.15, 1)),
    new THREE.LineBasicMaterial({
      color: accent,
      transparent: true,
      opacity: 0.22,
    }),
  );
  group.add(wire);

  scene.add(group);
  return { group, materials: [torusMat, icoMat], wire };
}

export async function mountStage({ canvas, stage, sectionIds }) {
  if (!canvas || !stage) throw new Error("missing canvas/stage");
  if (stage.dataset.mounted === "1") return;
  stage.dataset.mounted = "1";

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
  });
  renderer.setClearColor(0x0e1116, 1);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0e1116, 6, 14);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 40);
  camera.position.set(0, 0.4, 4.6);

  const hemi = new THREE.HemisphereLight(0xb8c4d4, 0x0b0d10, 0.85);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xffffff, 0.9);
  key.position.set(3, 4, 2);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0x5eead4, 0.25);
  fill.position.set(-2, 1, -1);
  scene.add(fill);

  const { group, materials } = buildPlaceholder(scene);

  // Optional glTF path (not used for placeholder)
  if (MODEL_URL) {
    try {
      const { GLTFLoader } = await import(
        "https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/loaders/GLTFLoader.js"
      );
      const loader = new GLTFLoader();
      const gltf = await loader.loadAsync(MODEL_URL);
      scene.remove(group);
      scene.add(gltf.scene);
    } catch (err) {
      console.warn("[ice] glTF load failed, keeping placeholder", err);
    }
  }

  let width = 0;
  let height = 0;
  const resize = () => {
    const rect = stage.getBoundingClientRect();
    width = Math.max(1, Math.floor(rect.width));
    height = Math.max(1, Math.floor(rect.height));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  resize();

  let targetP = 0;
  let smoothP = 0;
  let needsDraw = true;
  let scrolling = false;
  let scrollIdleTimer = 0;
  let raf = 0;
  let running = true;
  let lastTs = 0;

  const onScroll = () => {
    targetP = sectionProgress(sectionIds);
    scrolling = true;
    needsDraw = true;
    window.clearTimeout(scrollIdleTimer);
    scrollIdleTimer = window.setTimeout(() => {
      scrolling = false;
    }, 140);
  };

  const onVisibility = () => {
    if (document.hidden) {
      running = false;
      cancelAnimationFrame(raf);
    } else {
      running = true;
      needsDraw = true;
      lastTs = 0;
      loop(0);
    }
  };

  const onContextLost = (e) => {
    e.preventDefault();
    console.warn("[ice] WebGL context lost — letter track fallback");
    teardown();
    document.body.dataset.track = "letter";
  };

  const ro = new ResizeObserver(() => {
    resize();
    needsDraw = true;
  });
  ro.observe(stage);

  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);
  canvas.addEventListener("webglcontextlost", onContextLost);

  onScroll();

  function applyFrame(p, dt) {
    const sample = sampleKeys(p);
    camera.position.set(sample.pos[0], sample.pos[1], sample.pos[2]);
    camera.lookAt(sample.look[0], sample.look[1], sample.look[2]);
    for (const mat of materials) {
      mat.emissiveIntensity = sample.emissive;
    }
    // very slow idle spin only while drawing / scrolling
    const spin = scrolling ? dt * 0.00015 : dt * 0.00004;
    group.rotation.y += spin;
  }

  function loop(ts) {
    if (!running) return;
    raf = requestAnimationFrame(loop);
    const dt = lastTs ? Math.min(48, ts - lastTs) : 16;
    lastTs = ts;

    const damp = 0.12;
    const prev = smoothP;
    smoothP = lerp(smoothP, targetP, damp);
    if (Math.abs(smoothP - targetP) > 0.0004 || scrolling || needsDraw) {
      applyFrame(smoothP, dt);
      renderer.render(scene, camera);
      needsDraw = Math.abs(smoothP - targetP) > 0.0004 || scrolling;
    } else if (Math.abs(smoothP - prev) > 0.00001) {
      applyFrame(smoothP, dt);
      renderer.render(scene, camera);
    }
    // idle: skip render — save GPU
  }

  function teardown() {
    running = false;
    cancelAnimationFrame(raf);
    window.removeEventListener("scroll", onScroll);
    document.removeEventListener("visibilitychange", onVisibility);
    canvas.removeEventListener("webglcontextlost", onContextLost);
    ro.disconnect();
    renderer.dispose();
    stage.dataset.mounted = "0";
  }

  stage.classList.add("is-ready");
  loop(0);

  return { teardown };
}
