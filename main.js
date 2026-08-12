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

const scrollCue = document.querySelector("[data-scroll-cue]");
if (scrollCue) {
  const syncScrollCue = () => {
    const hide = window.scrollY > window.innerHeight * 0.18;
    scrollCue.classList.toggle("is-hidden", hide);
  };

  syncScrollCue();
  window.addEventListener("scroll", syncScrollCue, { passive: true });
}

/* Share menu in header */
const shareRoot = document.querySelector("[data-share]");
if (shareRoot) {
  const shareUrl = `${window.location.origin}${window.location.pathname}`;
  const shareText =
    "和歌山のエンジニアと学ぶ人がつながる場所 — WAKAYAMA ENGINEER PLATFORM";
  const toggleBtn = shareRoot.querySelector("[data-share-toggle]");
  const panel = shareRoot.querySelector("[data-share-panel]");
  const nativeBtn = shareRoot.querySelector("[data-share-native]");
  const xLink = shareRoot.querySelector("[data-share-x]");
  const lineLink = shareRoot.querySelector("[data-share-line]");
  const copyBtn = shareRoot.querySelector("[data-share-copy]");

  const closePanel = () => {
    if (!panel || !toggleBtn) return;
    panel.hidden = true;
    toggleBtn.setAttribute("aria-expanded", "false");
  };

  const openPanel = () => {
    if (!panel || !toggleBtn) return;
    panel.hidden = false;
    toggleBtn.setAttribute("aria-expanded", "true");
  };

  if (toggleBtn && panel) {
    toggleBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      if (panel.hidden) openPanel();
      else closePanel();
    });

    document.addEventListener("click", (event) => {
      if (!shareRoot.contains(event.target)) closePanel();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closePanel();
    });
  }

  if (xLink) {
    const params = new URLSearchParams({
      text: `${shareText}\n${shareUrl}`,
    });
    xLink.href = `https://twitter.com/intent/tweet?${params.toString()}`;
  }

  if (lineLink) {
    const params = new URLSearchParams({ url: shareUrl });
    lineLink.href = `https://social-plugins.line.me/lineit/share?${params.toString()}`;
  }

  if (nativeBtn && navigator.share) {
    nativeBtn.hidden = false;
    nativeBtn.addEventListener("click", async () => {
      closePanel();
      try {
        await navigator.share({
          title: "WAKAYAMA ENGINEER PLATFORM",
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        if (error && error.name === "AbortError") return;
      }
    });
  }

  if (copyBtn) {
    const defaultLabel = copyBtn.textContent;
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(shareUrl);
        copyBtn.classList.add("is-copied");
        copyBtn.textContent = "コピーしました";
        window.setTimeout(() => {
          copyBtn.classList.remove("is-copied");
          copyBtn.textContent = defaultLabel;
          closePanel();
        }, 1200);
      } catch {
        copyBtn.textContent = "失敗しました";
        window.setTimeout(() => {
          copyBtn.textContent = defaultLabel;
        }, 1200);
      }
    });
  }
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
