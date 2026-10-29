// Portfolio interactions — vanilla JS, no dependencies.
(function () {
  "use strict";

  const root = document.documentElement;
  root.classList.add("js");

  // ---------- Theme toggle (persists per browser) ----------
  const THEME_KEY = "theme";
  const themeBtn = document.querySelector(".theme-toggle");

  function readTheme() {
    try { return localStorage.getItem(THEME_KEY); } catch { return null; }
  }
  function saveTheme(value) {
    try { localStorage.setItem(THEME_KEY, value); } catch { /* storage blocked — ignore */ }
  }
  function currentTheme() {
    return root.dataset.theme ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  }

  const saved = readTheme();
  if (saved) root.dataset.theme = saved;
  else root.dataset.theme = currentTheme(); // lets CSS icon swap work without a saved value

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const next = currentTheme() === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      saveTheme(next);
    });
  }

  // ---------- Mobile menu ----------
  const menuBtn = document.querySelector(".menu-toggle");
  const navLinks = document.getElementById("nav-links");

  function setMenu(open) {
    if (!menuBtn || !navLinks) return;
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    navLinks.classList.toggle("is-open", open);
  }

  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
      setMenu(menuBtn.getAttribute("aria-expanded") !== "true");
    });
    navLinks.addEventListener("click", (e) => {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setMenu(false);
    });
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".nav")) setMenu(false);
    });
    // Reset if the viewport grows past the mobile breakpoint while open
    window.matchMedia("(min-width: 860px)").addEventListener("change", () => setMenu(false));
  }

  // ---------- Highlight the nav link for the section in view (home page) ----------
  const sectionLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  if (sectionLinks.length && "IntersectionObserver" in window) {
    const byId = new Map(sectionLinks.map((a) => [a.getAttribute("href").slice(1), a]));
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        sectionLinks.forEach((a) => a.classList.remove("is-active"));
        const link = byId.get(entry.target.id);
        if (link) link.classList.add("is-active");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    byId.forEach((_, id) => {
      const el = document.getElementById(id);
      if (el) spy.observe(el);
    });
  }

  // ---------- Reveal-on-scroll ----------
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  // ---------- Videos: load and play only while on screen ----------
  // Markup: <video data-autoplay muted loop playsinline preload="none" poster="...">
  const videos = document.querySelectorAll("video[data-autoplay]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !("IntersectionObserver" in window)) {
    videos.forEach((v) => { v.controls = true; });
  } else {
    const vio = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const v = entry.target;
        if (entry.isIntersecting) v.play().catch(() => { v.controls = true; });
        else v.pause();
      });
    }, { threshold: 0.25 });
    videos.forEach((v) => vio.observe(v));
  }

  // ---------- Back to top ----------
  const toTop = document.createElement("button");
  toTop.className = "back-to-top";
  toTop.type = "button";
  toTop.setAttribute("aria-label", "Back to top");
  toTop.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  document.body.appendChild(toTop);
  toTop.addEventListener("click", () => window.scrollTo({ top: 0 }));
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      toTop.classList.toggle("is-visible", window.scrollY > 600);
      ticking = false;
    });
  }, { passive: true });

  // ---------- Footer year ----------
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();
