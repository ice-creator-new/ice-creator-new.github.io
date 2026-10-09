/**
 * Ice · GH Pages entry
 * Direction A: typography + letter choreography · no 3D
 */

const REDUCE_MQ = "(prefers-reduced-motion: reduce)";

function prefersReduce() {
  return window.matchMedia(REDUCE_MQ).matches;
}

function setMotionAttr() {
  document.body.dataset.motion = prefersReduce() ? "reduce" : "full";
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

function inViewport(el) {
  const r = el.getBoundingClientRect();
  return r.bottom > 0 && r.top < window.innerHeight * 0.92;
}

/** L1 — IntersectionObserver scroll reveal (§4.2) */
function setupReveal() {
  const nodes = [...document.querySelectorAll(".reveal")];
  if (!nodes.length) return;

  if (prefersReduce()) {
    for (const el of nodes) el.classList.add("is-in");
    const featured = document.getElementById("featured");
    if (featured) featured.classList.add("is-in");
    return;
  }

  // Mark already-visible nodes before enabling hide cascade (avoids FOUC)
  for (const el of nodes) {
    if (inViewport(el)) el.classList.add("is-in");
  }

  const pending = nodes.filter((el) => !el.classList.contains("is-in"));
  if (!pending.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      }
    },
    { threshold: 0.15 }
  );

  for (const el of pending) io.observe(el);
}

setMotionAttr();
setupReveal();
// Enable progressive-enhancement hide only after in-view nodes are marked
document.documentElement.classList.add("js");
setupNavActive();

window.matchMedia(REDUCE_MQ).addEventListener("change", () => {
  setMotionAttr();
  if (prefersReduce()) {
    for (const el of document.querySelectorAll(".reveal")) {
      el.classList.add("is-in");
    }
  }
});
