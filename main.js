const revealEls = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  for (const el of revealEls) {
    if (el.closest(".hero")) continue;
    observer.observe(el);
  }
} else {
  for (const el of revealEls) {
    el.classList.add("is-visible");
  }
}
