(() => {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  gsap.registerPlugin(ScrollTrigger);

  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    gsap.to(".progress-bar", {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        start: 0,
        end: "max",
        scrub: 0.35,
      },
    });

    const heroTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 0.8,
      },
    });

    heroTl
      .to(".layer-far", { yPercent: -14, scale: 1.08, ease: "none" }, 0)
      .to(".layer-mid", { yPercent: -32, ease: "none" }, 0)
      .to(".layer-near", { yPercent: -58, xPercent: 6, ease: "none" }, 0)
      .to(".hero-title", { y: -90, scale: 0.84, ease: "none" }, 0)
      .to(".hero-copy", { y: -140, opacity: 0, ease: "none" }, 0)
      .to(".hero-veil", { opacity: 0.82, ease: "none" }, 0);

    gsap.fromTo(
      ".statement-bg img",
      { yPercent: -8, scale: 1.12 },
      {
        yPercent: 12,
        scale: 1.02,
        ease: "none",
        scrollTrigger: {
          trigger: ".statement",
          start: "top bottom",
          end: "bottom top",
          scrub: 0.7,
        },
      },
    );

    gsap.to(".word", {
      color: "var(--fg)",
      stagger: 0.14,
      ease: "none",
      scrollTrigger: {
        trigger: ".statement",
        start: "top 75%",
        end: "center 40%",
        scrub: true,
      },
    });

    gsap.utils.toArray(".parallax-frame").forEach((frame) => {
      const visual = frame.querySelector(".parallax-media");
      if (!visual) return;
      gsap.fromTo(
        visual,
        { yPercent: -8, scale: 1.22 },
        {
          yPercent: 14,
          scale: 1.05,
          ease: "none",
          scrollTrigger: {
            trigger: frame,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.65,
          },
        },
      );
    });
  });

  mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
    ScrollTrigger.create({
      trigger: ".statement",
      start: "top top",
      end: "+=90%",
      pin: true,
      pinSpacing: true,
    });
  });
})();
