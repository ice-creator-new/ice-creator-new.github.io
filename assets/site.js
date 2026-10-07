/**
 * Ice · GH Pages entry
 * Dual-track: desktop 3D (lazy Three) vs letter choreography.
 */

const DESKTOP_MQ = "(min-width: 1024px)";
const REDUCE_MQ = "(prefers-reduced-motion: reduce)";
/** Bump with index.html ?v= so dynamic import is cache-busted too */
const ASSET_V = "20261007b";

let stageHandle = null;
let mounting = false;

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
}

function canUse3D() {
  return (
    window.matchMedia(DESKTOP_MQ).matches &&
    !window.matchMedia(REDUCE_MQ).matches &&
    hasWebGL()
  );
}

function setTrack(track) {
  document.body.dataset.track = track;
}

function setupNavActive() {
  const sections = ["hero", "featured", "about", "contact"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const links = [...document.querySelectorAll('.nav-links a[href^="#"]')];

  const update = () => {
    const y = window.scrollY + window.innerHeight * 0.35;
    let current = sections[0]?.id ?? "hero";
    for (const section of sections) {
      if (section.offsetTop <= y) current = section.id;
    }
    for (const link of links) {
      const href = link.getAttribute("href")?.slice(1);
      link.classList.toggle("is-active", href === current);
    }
  };

  window.addEventListener("scroll", update, { passive: true });
  update();
}

/**
 * Letter-track Hero: ensure ICE letter stagger (SPEC §4.1).
 * CSS animates on data-track=letter; JS forces final state for reduce / 3d,
 * and can re-trigger choreography when switching into letter track.
 */
function runLetterHero({ restart = false } = {}) {
  const title = document.querySelector(".hero-title");
  const lead = document.querySelector(".hero-lead");
  if (!title) return;

  const CHOREO_MS = 620 + 48 * 2 + 90 + 480;

  const markLit = () => {
    title.classList.add("is-lit");
    if (lead) lead.classList.add("is-lit");
  };

  if (document.body.dataset.track !== "letter") {
    markLit();
    return;
  }

  if (window.matchMedia(REDUCE_MQ).matches) {
    markLit();
    return;
  }

  if (restart) {
    title.classList.remove("is-lit");
    if (lead) lead.classList.remove("is-lit");
    void title.offsetWidth; // restart CSS @keyframes
  }

  window.setTimeout(markLit, CHOREO_MS + 80);
}

async function ensure3D() {
  if (stageHandle || mounting) return;
  mounting = true;
  try {
    const mod = await import(`./stage3d.js?v=${ASSET_V}`);
    stageHandle = await mod.mountStage({
      canvas: document.getElementById("stage-canvas"),
      stage: document.getElementById("stage"),
      sectionIds: ["hero", "featured", "about", "contact"],
    });
  } catch (err) {
    console.warn("[ice] 3D stage failed, falling back to letter track", err);
    setTrack("letter");
    const stage = document.getElementById("stage");
    if (stage) {
      stage.classList.remove("is-ready");
      stage.dataset.mounted = "0";
    }
    stageHandle = null;
    runLetterHero({ restart: true });
  } finally {
    mounting = false;
  }
}

function teardown3D() {
  if (stageHandle?.teardown) {
    stageHandle.teardown();
  }
  stageHandle = null;
  const stage = document.getElementById("stage");
  if (stage) {
    stage.classList.remove("is-ready");
    stage.dataset.mounted = "0";
  }
}

let lastTrack = null;

async function applyTrack() {
  if (canUse3D()) {
    setTrack("3d");
    runLetterHero();
    await ensure3D();
    lastTrack = "3d";
  } else {
    teardown3D();
    setTrack("letter");
    runLetterHero({ restart: lastTrack === "3d" });
    lastTrack = "letter";
  }
}

setupNavActive();
applyTrack();

window.matchMedia(DESKTOP_MQ).addEventListener("change", applyTrack);
window.matchMedia(REDUCE_MQ).addEventListener("change", applyTrack);
