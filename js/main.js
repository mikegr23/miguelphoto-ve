/* =========================================================
   Miguel Photo — Interacciones & Lógica
   ========================================================= */

const CONFIG = {
  whatsapp: "584128261010",
  instagram: "https://www.instagram.com/miguelphoto.ve/"
};

document.documentElement.classList.remove("no-js");

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

/* ---------- Año dinámico ---------- */
const yearEl = $("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------- Portada: Carrusel de imágenes automáticas ---------- */
const slides = $$(".hero-slide");
const heroDots = $("#heroDots");
const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;

if (slides.length > 1 && heroDots) {
  let s = Math.max(0, slides.findIndex((im) => im.classList.contains("active")));
  let sTimer;
  
  const goSlide = (i) => {
    slides[s].classList.remove("active");
    if (heroDots.children[s]) heroDots.children[s].classList.remove("active");
    s = (i + slides.length) % slides.length;
    slides[s].loading = "eager";
    slides[(s + 1) % slides.length].loading = "eager";
    slides[s].classList.add("active");
    if (heroDots.children[s]) heroDots.children[s].classList.add("active");
  };
  
  const runSlides = () => { 
    clearInterval(sTimer); 
    if (!calm) sTimer = setInterval(() => goSlide(s + 1), 6000); 
  };
  
  slides.forEach((_, i) => {
    const b = document.createElement("button");
    b.setAttribute("aria-label", `Foto ${i + 1}`);
    b.tabIndex = -1;
    if (i === s) b.classList.add("active");
    b.addEventListener("click", () => { goSlide(i); runSlides(); });
    heroDots.appendChild(b);
  });
  
  slides[(s + 1) % slides.length].loading = "eager";
  runSlides();
}

/* ---------- Carrusel de Marcas ---------- */
const brandsTrack = $("#brandsTrack");
if (brandsTrack) {
  [...brandsTrack.children].forEach((li) => {
    const copy = li.cloneNode(true);
    copy.setAttribute("aria-hidden", "true");
    $$("img", copy).forEach((im) => { im.alt = ""; });
    brandsTrack.appendChild(copy);
  });
}

/* ---------- Barra de navegación y progreso ---------- */
const nav = $("#nav");
const bar = $("#progressBar");
const onScroll = () => {
  const y = window.scrollY;
  if (nav) nav.classList.toggle("scrolled", y > 40);
  if (bar) {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
  }
};
addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- Menú Móvil ---------- */
const toggle = $("#menuToggle");
const links = $("#navLinks");
if (toggle && links) {
  const setMenu = (open) => {
    links.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open);
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    document.body.style.overflow = open ? "hidden" : "";
  };
  toggle.addEventListener("click", () => setMenu(!links.classList.contains("open")));
  $$("a", links).forEach((a) => a.addEventListener("click", () => setMenu(false)));
}

/* ---------- Resaltar sección activa en el menú ---------- */
const navMap = new Map($$(".nav-links a[href^='#']:not(.btn)").map((a) => [a.getAttribute("href").slice(1), a]));
const spy = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting && navMap.has(e.target.id)) {
      navMap.forEach((a) => a.classList.remove("current"));
      navMap.get(e.target.id).classList.add("current");
    }
  });
}, { rootMargin: "-35% 0px -50% 0px" });
navMap.forEach((_, id) => { 
  const s = document.getElementById(id); 
  if (s) spy.observe(s); 
});

/* ---------- Animación Scroll Reveal ---------- */
const revealer = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { 
      e.target.classList.add("in"); 
      revealer.unobserve(e.target); 
    }
  });
}, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

$$(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 80}ms`;
  revealer.observe(el);
});

/* ---------- Contadores Numéricos Animados ---------- */
const counter = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const end = +el.dataset.count;
    const start = performance.now();
    const dur = 1500;
    const tick = (t) => {
      const p = Math.min((t - start) / dur, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    counter.unobserve(el);
  });
}, { threshold: 0.6 });
$$("[data-count]").forEach((el) => counter.observe(el));

/* ---------- Filtros del Portafolio ---------- */
const items = $$(".g-item");
$$(".filter").forEach((btn) => {
  btn.addEventListener("click", () => {
    $$(".filter").forEach((b) => { 
      b.classList.remove("active"); 
      b.setAttribute("aria-selected", "false"); 
    });
    btn.classList.add("active");
    btn.setAttribute("aria-selected", "true");
    
    const filterValue = btn.dataset.filter;
    items.forEach((it) => it.classList.add("fade"));
    
    setTimeout(() => {
      items.forEach((it) => {
        const matches = filterValue === "all" || it.dataset.cat === filterValue;
        it.classList.toggle("hide", !matches);
      });
      requestAnimationFrame(() => items.forEach((it) => it.classList.remove("fade")));
    }, 280);
  });
});

/* ---------- Lightbox Modal ---------- */
const lb = $("#lightbox");
const lbImg = $("#lbImg");
const lbCap = $("#lbCap");
let current = 0;

const visible = () => items.filter((it) => !it.classList.contains("hide"));

const showImage = (i) => {
  const list = visible();
  if (!list.length) return;
  current = (i + list.length) % list.length;
  const img = $("img", list[current]);
  lbImg.src = img.dataset.full || img.src;
  lbImg.alt = img.alt || "Fotografía Miguel González";
  lbCap.textContent = $("figcaption", list[current])?.textContent || "";
};

const openLightbox = (it) => {
  if (!lb) return;
  showImage(visible().indexOf(it));
  lb.hidden = false;
  document.body.style.overflow = "hidden";
  $(".lb-close", lb)?.focus();
};

const closeLightbox = () => { 
  if (!lb) return;
  lb.hidden = true; 
  document.body.style.overflow = ""; 
};

items.forEach((it) => {
  it.tabIndex = 0;
  it.addEventListener("click", () => openLightbox(it));
  it.addEventListener("keydown", (e) => { 
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openLightbox(it);
    }
  });
});

if (lb) {
  $(".lb-close", lb)?.addEventListener("click", closeLightbox);
  $(".lb-prev", lb)?.addEventListener("click", () => showImage(current - 1));
  $(".lb-next", lb)?.addEventListener("click", () => showImage(current + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLightbox(); });
  
  addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showImage(current - 1);
    if (e.key === "ArrowRight") showImage(current + 1);
  });
}
