/**
 * Ice · GH Pages entry
 * Dual-track: desktop 3D (lazy Three) vs letter choreography.
 */

const DESKTOP_MQ = "(min-width: 1024px)";
const REDUCE_MQ = "(prefers-reduced-motion: reduce)";

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

async function ensure3D() {
  if (stageHandle || mounting) return;
  mounting = true;
  try {
    const mod = await import("./stage3d.js");
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

async function applyTrack() {
  if (canUse3D()) {
    setTrack("3d");
    await ensure3D();
  } else {
    teardown3D();
    setTrack("letter");
  }
}

setupNavActive();
applyTrack();

window.matchMedia(DESKTOP_MQ).addEventListener("change", applyTrack);
window.matchMedia(REDUCE_MQ).addEventListener("change", applyTrack);
