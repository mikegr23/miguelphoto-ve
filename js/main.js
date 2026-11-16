/* =========================================================
   Miguel Photo — interacciones
   ========================================================= */

/* ===== EDITA AQUÍ TUS DATOS ===== */
const CONFIG = {
  // Tu WhatsApp con código de país, sin "+", espacios ni guiones. Ej: 584121234567
  whatsapp: "584128261010",
  // Enlace de tu perfil de Google Business / Google Maps (cópialo desde Google Maps > Compartir)
  googleMaps: "https://share.google/47ZnjiNJLRaEUHs5c"
};
/* ================================= */

document.documentElement.classList.remove("no-js");

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

/* ---------- Enlaces de WhatsApp ---------- */
const waLink = (msg) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
$$("[data-wa]").forEach((a) => {
  a.href = waLink(a.dataset.waMsg || "Hola Miguel, vi tu web y quiero información.");
  a.target = "_blank";
  a.rel = "noopener";
});
$$("#mapsLink, [data-maps]").forEach((a) => {
  a.href = CONFIG.googleMaps;
  a.target = "_blank";
  a.rel = "noopener";
});
$("#year").textContent = new Date().getFullYear();

/* ---------- Portada: fotos que cambian solas ---------- */
const slides = $$(".hero-slide");
const heroDots = $("#heroDots");
const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
if (slides.length > 1) {
  let s = Math.max(0, slides.findIndex((im) => im.classList.contains("active")));
  let sTimer;
  const goSlide = (i) => {
    slides[s].classList.remove("active");
    heroDots.children[s].classList.remove("active");
    s = (i + slides.length) % slides.length;
    slides[s].loading = "eager";
    slides[(s + 1) % slides.length].loading = "eager"; // precarga la siguiente
    slides[s].classList.add("active");
    heroDots.children[s].classList.add("active");
  };
  const runSlides = () => { clearInterval(sTimer); if (!calm) sTimer = setInterval(() => goSlide(s + 1), 6000); };
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

/* ---------- Carrusel de logos: se duplica solo para girar sin cortes ---------- */
const brandsTrack = $("#brandsTrack");
if (brandsTrack) {
  [...brandsTrack.children].forEach((li) => {
    const copy = li.cloneNode(true);
    copy.setAttribute("aria-hidden", "true");
    $$("img", copy).forEach((im) => { im.alt = ""; });
    brandsTrack.appendChild(copy);
  });
  // los logos pesan poco: cuando el carrusel se acerca a la pantalla, se cargan todos
  new IntersectionObserver((entries, obs) => {
    if (!entries[0].isIntersecting) return;
    $$("img", brandsTrack).forEach((im) => { im.loading = "eager"; });
    obs.disconnect();
  }, { rootMargin: "600px 0px" }).observe(brandsTrack);
}

/* ---------- Menú: fondo al bajar, barra de progreso ---------- */
const nav = $("#nav");
const bar = $("#progressBar");
const onScroll = () => {
  const y = window.scrollY;
  nav.classList.toggle("scrolled", y > 40);
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
};
addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- Menú móvil ---------- */
const toggle = $("#menuToggle");
const links = $("#navLinks");
const setMenu = (open) => {
  links.classList.toggle("open", open);
  toggle.setAttribute("aria-expanded", open);
  toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  document.body.style.overflow = open ? "hidden" : "";
};
toggle.addEventListener("click", () => setMenu(!links.classList.contains("open")));
$$("a", links).forEach((a) => a.addEventListener("click", () => setMenu(false)));

/* ---------- Resaltar la sección actual en el menú ---------- */
const navMap = new Map($$(".nav-links a[href^='#']:not(.btn)").map((a) => [a.getAttribute("href").slice(1), a]));
const spy = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting && navMap.has(e.target.id)) {
      navMap.forEach((a) => a.classList.remove("current"));
      navMap.get(e.target.id).classList.add("current");
    }
  });
}, { rootMargin: "-45% 0px -50% 0px" });
navMap.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });

/* ---------- Aparición al hacer scroll ---------- */
const revealer = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); revealer.unobserve(e.target); }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
$$(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 90}ms`;
  revealer.observe(el);
});

/* ---------- Contadores animados ---------- */
const counter = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const end = +el.dataset.count;
    const start = performance.now();
    const dur = 1600;
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

/* ---------- Filtros del portafolio ---------- */
const items = $$(".g-item");
$$(".filter").forEach((btn) => {
  btn.addEventListener("click", () => {
    $$(".filter").forEach((b) => { b.classList.remove("active"); b.setAttribute("aria-selected", "false"); });
    btn.classList.add("active");
    btn.setAttribute("aria-selected", "true");
    const f = btn.dataset.filter;
    items.forEach((it) => it.classList.add("fade"));
    setTimeout(() => {
      items.forEach((it) => {
        it.classList.toggle("hide", f !== "all" && it.dataset.cat !== f);
      });
      requestAnimationFrame(() => items.forEach((it) => it.classList.remove("fade")));
    }, 300);
  });
});

/* ---------- Visor de fotos (lightbox) ---------- */
const lb = $("#lightbox");
const lbImg = $("#lbImg");
const lbCap = $("#lbCap");
let current = 0;
const visible = () => items.filter((it) => !it.classList.contains("hide"));
const show = (i) => {
  const list = visible();
  current = (i + list.length) % list.length;
  const img = $("img", list[current]);
  lbImg.src = img.dataset.full || img.src;
  lbImg.alt = img.alt;
  lbCap.textContent = $("figcaption", list[current])?.textContent || "";
};
const openLb = (it) => {
  show(visible().indexOf(it));
  lb.hidden = false;
  document.body.style.overflow = "hidden";
  $(".lb-close", lb).focus();
};
const closeLb = () => { lb.hidden = true; document.body.style.overflow = ""; };
items.forEach((it) => {
  it.tabIndex = 0;
  it.addEventListener("click", () => openLb(it));
  it.addEventListener("keydown", (e) => { if (e.key === "Enter") openLb(it); });
});
$(".lb-close", lb).addEventListener("click", closeLb);
$(".lb-prev", lb).addEventListener("click", () => show(current - 1));
$(".lb-next", lb).addEventListener("click", () => show(current + 1));
lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });
addEventListener("keydown", (e) => {
  if (lb.hidden) return;
  if (e.key === "Escape") closeLb();
  if (e.key === "ArrowLeft") show(current - 1);
  if (e.key === "ArrowRight") show(current + 1);
});
let touchX = null;
lb.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
lb.addEventListener("touchend", (e) => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
  touchX = null;
});

/* ---------- Testimonios en carrusel ---------- */
const quotes = $$(".quote");
const dots = $(".quote-dots");
let q = 0;
let qTimer;
const goQuote = (i) => {
  quotes[q].classList.remove("active");
  dots.children[q].classList.remove("active");
  q = (i + quotes.length) % quotes.length;
  quotes[q].classList.add("active");
  dots.children[q].classList.add("active");
};
if (quotes.length) quotes.forEach((_, i) => {
  const b = document.createElement("button");
  b.setAttribute("aria-label", `Testimonio ${i + 1}`);
  if (i === 0) b.classList.add("active");
  b.addEventListener("click", () => { goQuote(i); restart(); });
  dots.appendChild(b);
});
const restart = () => { clearInterval(qTimer); qTimer = setInterval(() => goQuote(q + 1), 6500); };
if (quotes.length > 1) restart();

/* ---------- Formulario -> WhatsApp ---------- */
const form = $("#contactForm");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = form.nombre.value.trim();
  const service = form.servicio.value;
  form.nombre.parentElement.classList.toggle("error", !name);
  form.servicio.parentElement.classList.toggle("error", !service);
  if (!name || !service) {
    $("#formNote").textContent = "Por favor indica tu nombre y el servicio que te interesa.";
    return;
  }
  let msg = `Hola Miguel, soy ${name}. Me interesa: ${service}.`;
  if (form.fecha.value) {
    const [y, m, d] = form.fecha.value.split("-");
    msg += ` Fecha tentativa: ${d}/${m}/${y}.`;
  }
  if (form.horario.value) msg += ` Horario preferido: ${form.horario.value}.`;
  if (form.mensaje.value.trim()) msg += ` ${form.mensaje.value.trim()}`;
  window.open(waLink(msg), "_blank", "noopener");
  $("#formNote").textContent = "¡Listo! Envía el mensaje en WhatsApp y te respondo pronto.";
});
