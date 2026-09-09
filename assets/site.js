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
        scrub: 0.2,
      },
    });

    const heroTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    heroTl
      .to(".hero-grid", { yPercent: -18, ease: "none" }, 0)
      .to(".shard-a", { yPercent: -28, ease: "none" }, 0)
      .to(".shard-b", { yPercent: -52, ease: "none" }, 0)
      .to(".shard-c", { yPercent: -76, ease: "none" }, 0)
      .to(".hero-title", { y: -64, scale: 0.9, ease: "none" }, 0)
      .to(".hero-copy", { y: -96, opacity: 0.2, ease: "none" }, 0);

    gsap.to(".word", {
      color: "var(--fg)",
      stagger: 0.12,
      ease: "none",
      scrollTrigger: {
        trigger: ".statement",
        start: "top 78%",
        end: "center 42%",
        scrub: true,
      },
    });

    gsap.utils.toArray(".work-card").forEach((card) => {
      const visual = card.querySelector(".work-visual");
      if (!visual) return;
      gsap.fromTo(
        visual,
        { yPercent: 14 },
        {
          yPercent: -12,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    });
  });

  mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
    ScrollTrigger.create({
      trigger: ".statement",
      start: "top top",
      end: "+=65%",
      pin: true,
      pinSpacing: true,
    });
  });
})();
