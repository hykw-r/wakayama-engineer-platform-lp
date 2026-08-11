const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if (!prefersReducedMotion) {
  document.documentElement.classList.add("js-motion");
}

const revealEls = document.querySelectorAll(".reveal");

const showReveal = (el) => {
  el.classList.add("is-visible");
};

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        showReveal(entry.target);
        observer.unobserve(entry.target);
      }
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -4% 0px",
    }
  );

  for (const el of revealEls) {
    observer.observe(el);
  }

  // Failsafe: never leave content stuck invisible
  window.setTimeout(() => {
    for (const el of revealEls) showReveal(el);
  }, 1200);
} else {
  for (const el of revealEls) showReveal(el);
}

if (!prefersReducedMotion) {
  const brand = document.querySelector("[data-glitch]");
  if (brand) {
    const burst = () => {
      brand.classList.add("is-glitching");
      window.setTimeout(() => brand.classList.remove("is-glitching"), 220);
    };

    window.setTimeout(burst, 700);
    window.setInterval(() => {
      if (Math.random() > 0.55) burst();
    }, 3200);
  }

  const parallax = document.querySelector("[data-parallax]");
  if (parallax) {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId = 0;

    const tick = () => {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;
      parallax.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      rafId = requestAnimationFrame(tick);
    };

    const onMove = (event) => {
      const { innerWidth, innerHeight } = window;
      const nx = (event.clientX / innerWidth - 0.5) * 2;
      const ny = (event.clientY / innerHeight - 0.5) * 2;
      targetX = nx * -14;
      targetY = ny * -10;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    rafId = requestAnimationFrame(tick);

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
      } else {
        rafId = requestAnimationFrame(tick);
      }
    });
  }
}
