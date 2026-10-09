/**
 * ICE · GH Pages v3.2 dense — reveal + wallpaper parallax + nav glass scroll
 */
document.documentElement.classList.add("js");

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const mobile = window.matchMedia("(max-width: 767px)").matches;
document.body.dataset.motion = reduce ? "reduce" : "full";

const nav = document.querySelector(".nav");
const onScrollNav = () => {
  if (!nav) return;
  nav.classList.toggle("is-scrolled", (window.scrollY || 0) > 8);
};
window.addEventListener("scroll", onScrollNav, { passive: true });
onScrollNav();

// Section reveal — only when JS + full motion; default CSS keeps content visible
if (!reduce) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
}

// Wallpaper parallax — far/mid/near; mobile halves k and drops near layer (CSS)
const layers = {
  far: { el: document.querySelector(".wp-far"), k: 0.06, cap: 48 },
  mid: { el: document.querySelector(".wp-mid"), k: 0.14, cap: 88 },
  near: { el: document.querySelector(".wp-near"), k: 0.24, cap: 120 },
};
if (mobile) {
  layers.far.k *= 0.5;
  layers.mid.k *= 0.5;
  layers.far.cap = 28;
  layers.mid.cap = 44;
}

let ticking = false;
const apply = () => {
  ticking = false;
  if (reduce) return;
  const y = window.scrollY || 0;
  for (const key of Object.keys(layers)) {
    const L = layers[key];
    if (!L.el) continue;
    if (mobile && key === "near") continue;
    const dy = Math.max(-L.cap, Math.min(L.cap, y * L.k));
    L.el.style.transform = `translate3d(0, ${dy.toFixed(2)}px, 0)`;
  }
};

if (!reduce) {
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(apply);
      }
    },
    { passive: true }
  );
  apply();
}
