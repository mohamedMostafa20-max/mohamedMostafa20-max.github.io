// =====================================================================
//  Mohamed Mustafa: portfolio scripts
//  1. language (English / عربي)   2. typing   3. top bar & menu
//  4. hero 3D steel model + CAD crosshair   5. counters & reveals
//  6. projects grid, filters   7. project viewer (zoom / swipe)   8. contact form
// =====================================================================
document.documentElement.classList.add("js");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;
const isArabic = () => document.documentElement.lang === "ar";
const langHooks = [];

// ---------------------------------------------------------------------
// 1. Language: every translated element keeps its Arabic text in data-ar
// ---------------------------------------------------------------------
function setLang(lang) {
  const ar = lang === "ar";
  document.documentElement.lang = ar ? "ar" : "en";
  try { localStorage.setItem("mm-lang", ar ? "ar" : "en"); } catch (e) {}
  // carry the language in every internal page link, so the next page opens in the same language
  document.querySelectorAll('a[href]').forEach((link) => {
    const h = link.getAttribute("href");
    if (!/^(index|about|projects|expertise|contact)\.html/.test(h)) return;
    const [path, hash] = h.split("#");
    const base = path.split("?")[0];
    link.setAttribute("href", base + (ar ? "?lang=ar" : "?lang=en") + (hash ? "#" + hash : ""));
  });
  document.documentElement.dir = ar ? "rtl" : "ltr";

  document.querySelectorAll("[data-ar]").forEach((el) => {
    if (!el.hasAttribute("data-en")) el.setAttribute("data-en", el.innerHTML);
    el.innerHTML = ar ? el.getAttribute("data-ar") : el.getAttribute("data-en");
  });

  const toggle = document.getElementById("lang-toggle");
  toggle.textContent = ar ? "English" : "عربي";
  toggle.setAttribute("aria-label", ar ? "Switch to English" : "التبديل إلى العربية");

  langHooks.forEach((fn) => fn(ar));
}
// title, description and canonical link per language (so Google indexes both versions)
const META = {
  en: {
    title: document.title,
    desc: document.querySelector('meta[name="description"]').content,
  },
  ar: {
    title: ({ "projects.html": "المشاريع | ", "about.html": "نبذة | ", "expertise.html": "الخبرة | ", "contact.html": "تواصل | " }[(location.pathname.split("/").pop() || "")] || "") + "محمد مصطفى | مهندس إنشائي لتصميم المنشآت المعدنية في مصر",
    desc: "محمد مصطفى، مهندس مدني وإنشائي متخصص في تصميم المنشآت المعدنية في 6 أكتوبر، الجيزة، مصر. تصميم هناجر ومخازن ومصانع معدنية، ومظلات محطات الوقود، وجمالونات، وخزانات API 650، ووصلات معدنية، لأكثر من 200 مشروع في مصر والسعودية والإمارات.",
  },
};
const SITE = "https://mohamedmostafa20-max.github.io/";
const PAGE = (location.pathname.split("/").pop() || "").replace(/^index\.html$/, "");
let canonical = document.querySelector('link[rel="canonical"]');
if (!canonical) {
  canonical = document.createElement("link");
  canonical.rel = "canonical";
  document.head.appendChild(canonical);
}
langHooks.push((ar) => {
  const m = ar ? META.ar : META.en;
  document.title = m.title;
  document.querySelector('meta[name="description"]').content = m.desc;
  canonical.href = SITE + PAGE + (ar ? "?lang=ar" : "");
});

document.getElementById("lang-toggle").addEventListener("click", () => {
  const ar = !isArabic();
  setLang(ar ? "ar" : "en");
  try { localStorage.setItem("mm-lang", ar ? "ar" : "en"); } catch (e) {}
  // keep the address in step with the language, so a shared link opens the same language
  const url = new URL(location.href);
  url.searchParams.set("lang", ar ? "ar" : "en");
  history.replaceState(null, "", url.pathname + url.search + url.hash);
});
canonical.href = SITE + PAGE;
// the site opens in English; ?lang=ar opens the Arabic version (this is the address Google indexes for Arabic)

document.getElementById("year").textContent = new Date().getFullYear();

// ---------------------------------------------------------------------
// 2. Typing: the role line types, waits, erases and types again
// ---------------------------------------------------------------------
(() => {
  const el = document.getElementById("typing-title");
  if (!el) return;
  const TEXT = {
    en: "Civil / Steel Structures Design Engineer",
    ar: "مهندس مدني / تصميم منشآت معدنية",
  };
  let text = TEXT.en;
  let i = text.length;
  let timer;

  if (reduceMotion) {
    langHooks.push((ar) => (el.textContent = ar ? TEXT.ar : TEXT.en));
    return;
  }

  function type() {
    el.textContent = text.slice(0, ++i);
    if (i < text.length) timer = setTimeout(type, 55);
    else timer = setTimeout(erase, 2800);
  }
  function erase() {
    el.textContent = text.slice(0, --i);
    if (i > 0) timer = setTimeout(erase, 28);
    else timer = setTimeout(type, 450);
  }
  el.textContent = "";
  i = 0;
  timer = setTimeout(type, 900);

  langHooks.push((ar) => {
    clearTimeout(timer);
    text = ar ? TEXT.ar : TEXT.en;
    i = 0;
    el.textContent = "";
    timer = setTimeout(type, 200);
  });
})();

// ---------------------------------------------------------------------
// 3. Top bar: background after scroll, active section, mobile menu
// ---------------------------------------------------------------------
(() => {
  const bar = document.getElementById("topbar");
  const menuBtn = document.getElementById("menu-btn");
  const links = [...document.querySelectorAll(".nav a")];

  const onScroll = () => bar.classList.toggle("scrolled", window.scrollY > 20);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  menuBtn.addEventListener("click", () => {
    const open = bar.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open);
  });
  links.forEach((a) => a.addEventListener("click", () => {
    bar.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  }));

  if ("IntersectionObserver" in window) {
    const map = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          links.forEach((a) => a.classList.remove("active"));
          map.get(e.target.id)?.classList.add("active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    map.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
  }
})();

// ---------------------------------------------------------------------
// 4. Hero: a steel building that draws itself, then a load path runs through it
// ---------------------------------------------------------------------
(() => {
  const wrap = document.getElementById("hero-model");
  if (!wrap) return;
  const canvas = document.getElementById("model-canvas");
  const callout = document.getElementById("callout");
  const read = document.getElementById("ch-read");
  if (!canvas.getContext) return;
  const ctx = canvas.getContext("2d");

  // ---------- geometry (metres) ----------
  const HALF = 12, BAY = 6, NB = 6, EAVE = 8.4, APEX = 11.6, BOT = 7.0, NP = 6;
  const L = (NB * BAY) / 2;
  const topY = (x) => EAVE + (APEX - EAVE) * (1 - Math.abs(x) / HALF);
  const xs = [];
  for (let k = 0; k <= 2 * NP; k++) xs.push(-HALF + (k * HALF) / NP);
  const zs = [];
  for (let f = 0; f <= NB; f++) zs.push(-L + f * BAY);

  const M = []; // members: a, b, type, t0, dur
  const add = (a, b, type, t0, dur = 0.55) => M.push({ a, b, type, t0, dur });

  zs.forEach((z, f) => {
    const d = f * 0.11;
    add([-HALF, 0, z], [-HALF, EAVE, z], "col", 0.35 + d, 0.6);
    add([HALF, 0, z], [HALF, EAVE, z], "col", 0.35 + d, 0.6);
    for (let k = 0; k < 2 * NP; k++) {
      const x0 = xs[k], x1 = xs[k + 1], t = 1.0 + d + k * 0.018;
      add([x0, topY(x0), z], [x1, topY(x1), z], "chord", t, 0.35);
      add([x0, BOT, z], [x1, BOT, z], "chord", t, 0.35);
      if (k % 2 === 0) add([x0, BOT, z], [x1, topY(x1), z], "web", t + 0.12, 0.3);
      else add([x0, topY(x0), z], [x1, BOT, z], "web", t + 0.12, 0.3);
      if (k > 0) add([x0, BOT, z], [x0, topY(x0), z], "web", t + 0.1, 0.3);
    }
  });
  for (let b = 0; b < NB; b++) {
    const z0 = zs[b], z1 = zs[b + 1], d = b * 0.09;
    xs.forEach((x, k) => add([x, topY(x), z0], [x, topY(x), z1], "purlin", 2.0 + d + k * 0.01, 0.4));
    [-HALF, HALF].forEach((x) => {
      [2.8, 5.6].forEach((y) => add([x, y, z0], [x, y, z1], "girt", 2.2 + d, 0.4));
    });
    [-6, 6].forEach((x) => add([x, BOT, z0], [x, BOT, z1], "tie", 2.3 + d, 0.4));
    if (b === 0 || b === NB - 1) {
      [-1, 1].forEach((s) => {
        add([s * HALF, EAVE, z0], [0, APEX, z1], "brace", 2.7, 0.5);
        add([s * HALF, EAVE, z1], [0, APEX, z0], "brace", 2.7, 0.5);
        add([s * HALF, 0, z0], [s * HALF, EAVE, z1], "brace", 2.8, 0.5);
        add([s * HALF, 0, z1], [s * HALF, EAVE, z0], "brace", 2.8, 0.5);
      });
    }
  }
  const BUILT = 3.5;

  // structural grid on the ground: frame lines 1..7 and column lines A, B
  const G = [];
  zs.forEach((z, f) => G.push({ a: [-HALF - 3.5, 0, z], b: [HALF + 2, 0, z], label: String(f + 1), t0: 0.05 + f * 0.04 }));
  [[-HALF, "A"], [HALF, "B"]].forEach(([x, lab], i) => G.push({ a: [x, 0, -L - 3.5], b: [x, 0, L + 2], label: lab, t0: 0.1 + i * 0.05 }));

  // ---------- colours ----------
  const C = {
    col: [240, 198, 116, 1],
    chord: [111, 211, 232, 0.95],
    web: [111, 211, 232, 0.42],
    purlin: [176, 196, 218, 0.5],
    girt: [176, 196, 218, 0.3],
    tie: [176, 196, 218, 0.35],
    brace: [240, 198, 116, 0.6],
  };
  const W_ = { col: 2, chord: 1.4, web: 1, purlin: 1, girt: 0.9, tie: 0.9, brace: 1.1 };

  // ---------- view ----------
  let W = 0, H = 0, dpr = 1, S = 10, cx = 0, cy = 0;
  let yaw = -0.62, pitch = 0.4, mx = 0, my = 0, tmx = 0, tmy = 0;
  const D = 64;
  let leaderNode = null;

  function resize() {
    const r = wrap.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    fit();
    pickLeaderNode();
  }

  // scale the model so it always fits its box, with room for the sway and the photo callout
  function fit() {
    const rtl = document.documentElement.dir === "rtl";
    const pts = [];
    M.forEach((m) => pts.push(m.a, m.b));
    G.forEach((g) => pts.push(g.a, g.b));
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    const keep = [S, cx, cy, yaw];
    S = 1; cx = 0; cy = 0; pitch = 0.4;
    [-0.62 - 0.32, -0.62, -0.62 + 0.32].forEach((yw) => {
      yaw = yw;
      pts.forEach((p) => {
        const q = proj(p);
        x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]);
        y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]);
      });
    });
    yaw = keep[3];
    const small = W < 600;
    const pad = small ? 22 : 30; // room for the grid bubbles at the ends of the grid lines
    S = Math.min((W - 2 * pad) * (small ? 1.0 : 0.96) / (x1 - x0), (H * (small ? 0.84 : 0.8)) / (y1 - y0));
    cx = W / 2 - (S * (x0 + x1)) / 2 + W * (rtl ? -0.02 : 0.02);
    cy = H * (small ? 0.44 : 0.42) - (S * (y0 + y1)) / 2;
  }

  function proj(p) {
    const x = p[0], y = p[1] - 5, z = p[2];
    const c = Math.cos(yaw), s = Math.sin(yaw);
    const x1 = x * c - z * s, z1 = x * s + z * c;
    const cp = Math.cos(pitch), sp = Math.sin(pitch);
    const y2 = y * cp - z1 * sp, z2 = y * sp + z1 * cp;
    const f = D / (D + z2);
    return [cx + x1 * S * f, cy - y2 * S * f, z2];
  }

  // the column base nearest the photo callout gets the leader line
  function pickLeaderNode() {
    const rtl = document.documentElement.dir === "rtl";
    let best = null, bestScore = -Infinity;
    zs.forEach((z) => [-HALF, HALF].forEach((x) => {
      const p = proj([x, 0, z]);
      const score = p[1] * 0.6 + (rtl ? p[0] : -p[0]);
      if (score > bestScore) { bestScore = score; best = [x, 0, z]; }
    }));
    leaderNode = best;
  }

  const ease = (t) => 1 - Math.pow(1 - t, 3);
  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

  let start = null, running = false, raf = 0, calloutShown = false;

  function frame(now) {
    if (!running) return;
    if (start === null) start = now;
    const t = reduceMotion ? 99 : (now - start) / 1000;

    // camera: slow sway plus the visitor's pointer
    mx += (tmx - mx) * 0.06;
    my += (tmy - my) * 0.06;
    const sway = reduceMotion ? 0 : Math.sin(t * 0.13) * 0.3;
    yaw = -0.62 + sway + mx * 0.55;
    pitch = 0.4 + my * 0.2;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.lineCap = "round";

    // ground grid (chain-dashed centre lines with grid bubbles)
    ctx.font = `600 ${W < 600 ? 10 : 11.5}px Archivo, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    G.forEach((g) => {
      const k = ease(clamp01((t - g.t0) / 0.9));
      if (k <= 0) return;
      const pa = proj(g.a);
      const pb = proj([g.a[0] + (g.b[0] - g.a[0]) * k, 0, g.a[2] + (g.b[2] - g.a[2]) * k]);
      ctx.setLineDash([14, 4, 2, 4]);
      ctx.strokeStyle = "rgba(111,211,232,0.22)";
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(pa[0], pa[1]); ctx.lineTo(pb[0], pb[1]); ctx.stroke();
      ctx.setLineDash([]);
      const r = W < 600 ? 8 : 10;
      ctx.globalAlpha = k;
      ctx.fillStyle = "rgba(11,21,34,0.9)";
      ctx.strokeStyle = "rgba(111,211,232,0.65)";
      ctx.beginPath(); ctx.arc(pa[0], pa[1], r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "rgba(111,211,232,0.95)";
      ctx.fillText(g.label, pa[0], pa[1] + 0.5);
      ctx.globalAlpha = 1;
    });

    // load path: a band sweeps down the frame every few seconds
    const cyc = 6.5, built = t > BUILT;
    const ph = built && !reduceMotion ? ((t - BUILT) % cyc) / 2.4 : 2;
    const plane = 12.8 - ph * 14;

    // members, far ones first
    const list = [];
    for (const m of M) {
      const k = ease(clamp01((t - m.t0) / m.dur));
      if (k <= 0) continue;
      const pa = proj(m.a);
      const end = [m.a[0] + (m.b[0] - m.a[0]) * k, m.a[1] + (m.b[1] - m.a[1]) * k, m.a[2] + (m.b[2] - m.a[2]) * k];
      const pb = proj(end);
      list.push({ m, pa, pb, depth: (pa[2] + pb[2]) / 2, k });
    }
    list.sort((p, q) => q.depth - p.depth);

    for (const it of list) {
      const { m, pa, pb, depth } = it;
      const base = C[m.type];
      const fog = 0.45 + 0.55 * clamp01((26 - depth) / 52);
      let col = base, alpha = base[3] * fog, w = W_[m.type];
      if (ph <= 1) {
        const ym = (m.a[1] + m.b[1]) / 2;
        const g = clamp01(1 - Math.abs(ym - plane) / 1.6);
        if (g > 0) {
          col = [
            base[0] + (240 - base[0]) * g,
            base[1] + (198 - base[1]) * g,
            base[2] + (116 - base[2]) * g,
          ];
          alpha = Math.min(1, alpha + g * 0.6);
          w += g * 1.4;
        }
      }
      ctx.strokeStyle = rgba(col, alpha);
      ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(pa[0], pa[1]); ctx.lineTo(pb[0], pb[1]); ctx.stroke();
    }

    // supports (fixed-base symbol) under each column once it has started
    zs.forEach((z, f) => [-HALF, HALF].forEach((x) => {
      const k = clamp01((t - (0.35 + f * 0.11)) / 0.4);
      if (k <= 0) return;
      const p = proj([x, 0, z]);
      const s = 5.5;
      ctx.globalAlpha = k;
      ctx.strokeStyle = "rgba(240,198,116,0.9)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(p[0], p[1]); ctx.lineTo(p[0] - s, p[1] + s * 1.3); ctx.lineTo(p[0] + s, p[1] + s * 1.3); ctx.closePath();
      ctx.stroke();
      ctx.globalAlpha = 1;
    }));

    // leader from the photo callout to its column base
    if (leaderNode && t > 1.1) {
      if (!calloutShown) { callout.classList.add("on"); calloutShown = true; }
      const img = callout.querySelector("img");
      const ir = img.getBoundingClientRect(), wr = wrap.getBoundingClientRect();
      const ccx = ir.left - wr.left + ir.width / 2, ccy = ir.top - wr.top + ir.height / 2;
      const p = proj(leaderNode);
      const dx = p[0] - ccx, dy = p[1] - ccy, len = Math.hypot(dx, dy) || 1;
      const r = ir.width / 2 + 9;
      const sx = ccx + (dx / len) * r, sy = ccy + (dy / len) * r;
      const k = ease(clamp01((t - 1.1) / 0.8));
      ctx.strokeStyle = "rgba(111,211,232,0.75)";
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + (p[0] - sx) * k, sy + (p[1] - sy) * k); ctx.stroke();
      if (k >= 1) {
        ctx.fillStyle = "rgba(111,211,232,1)";
        ctx.beginPath(); ctx.arc(p[0], p[1], 3, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "rgba(111,211,232,0.5)";
        ctx.beginPath(); ctx.arc(p[0], p[1], 9, 0, Math.PI * 2); ctx.stroke();
      }
    }

    if (reduceMotion) { running = false; return; }
    raf = requestAnimationFrame(frame);
  }

  function play() {
    if (running) return;
    running = true;
    raf = requestAnimationFrame(frame);
  }
  function pause() {
    running = false;
    cancelAnimationFrame(raf);
  }

  // pause when the hero is off screen or the tab is hidden
  let visible = true;
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      visible && !document.hidden ? play() : pause();
    }).observe(wrap);
  }
  document.addEventListener("visibilitychange", () => (document.hidden || !visible ? pause() : play()));

  // pointer: tilt the model and drive the CAD crosshair
  wrap.addEventListener("pointermove", (e) => {
    const r = wrap.getBoundingClientRect();
    const px = e.clientX - r.left, py = e.clientY - r.top;
    tmx = px / r.width - 0.5;
    tmy = py / r.height - 0.5;
    if (finePointer) {
      wrap.classList.add("aim");
      wrap.style.setProperty("--cx", px + "px");
      wrap.style.setProperty("--cy", py + "px");
      const X = (px - cx) / S, Y = (cy - py) / S + 5;
      read.textContent = `X ${X.toFixed(2)}  Y ${Y.toFixed(2)}`;
    }
  });
  wrap.addEventListener("pointerleave", () => {
    wrap.classList.remove("aim");
    tmx = 0; tmy = 0;
  });

  const ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  ready.then(() => { resize(); play(); });
  window.addEventListener("resize", () => { resize(); if (reduceMotion) play(); });
  langHooks.push(() => { resize(); if (reduceMotion) play(); });
})();

// ---------------------------------------------------------------------
// 5. Counters, reveals, magnetic buttons
// ---------------------------------------------------------------------
(() => {
  // count-up figures in the hero
  const nums = document.querySelectorAll(".dim-num");
  function countUp(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || "";
    const t0 = performance.now(), dur = 1700;
    (function step(now) {
      const t = Math.min((now - t0) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3))) + suffix;
      if (t < 1) requestAnimationFrame(step);
    })(t0);
  }
  if (!reduceMotion) setTimeout(() => nums.forEach(countUp), 700);

  // reveal blocks, draw section underlines, cascade the code badges
  const targets = document.querySelectorAll(".reveal, .sec-head, .codes");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("seen");
        if (e.target.classList.contains("codes")) {
          [...e.target.children].forEach((c, i) => (c.style.transitionDelay = `${i * 90}ms`));
          setTimeout(() => [...e.target.children].forEach((c) => (c.style.transitionDelay = "")), 1400);
        }
        io.unobserve(e.target);
      });
    }, { threshold: 0.15 });
    targets.forEach((t) => io.observe(t));
  } else {
    targets.forEach((t) => t.classList.add("seen"));
  }

  // buttons lean toward the pointer
  if (finePointer && !reduceMotion) {
    document.querySelectorAll(".magnetic").forEach((b) => {
      b.addEventListener("pointermove", (e) => {
        const r = b.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        b.style.transform = `translate(${dx * 0.16}px, ${dy * 0.28 - 2}px)`;
      });
      b.addEventListener("pointerleave", () => (b.style.transform = ""));
    });
  }
})();

// ---------------------------------------------------------------------
// 6. Projects: tiles built from each <article class="project">, filters
// ---------------------------------------------------------------------
const Projects = (() => {
  const grid = document.getElementById("project-grid");
  if (!grid) return { visible: () => [], byId: () => null };
  const all = [...grid.querySelectorAll(".project")];
  const viewable = all.filter((p) => !p.classList.contains("project-doc"));

  all.forEach((p) => {
    const title = p.querySelector("h3");
    const media = document.createElement("div");
    media.className = "p-media";

    if (p.classList.contains("project-doc")) {
      media.classList.add("doc-cover");
      media.innerHTML = `<svg viewBox="0 0 70 92" aria-hidden="true">
          <path d="M4 4h44l18 18v66H4z" stroke="#f0c674" stroke-width="2.5"/>
          <path d="M48 4v18h18" stroke="#f0c674" stroke-width="2.5"/>
          <path d="M14 40h42M14 50h42M14 60h30M14 70h36" stroke="#6fd3e8" stroke-width="2.5" stroke-linecap="round"/>
        </svg>`;
      p.prepend(media);
      return;
    }

    const names = p.dataset.images.split(/\s+/).filter(Boolean);
    const img = document.createElement("img");
    img.src = `images/thumb/${names[0]}.webp`;
    const loc = p.querySelector(".meta-loc");
    const altText = () => {
      const t = title.textContent.trim();
      const where = loc ? loc.textContent.trim() : "";
      return isArabic()
        ? `${t}${where ? "، " + where : ""}، تصميم منشآت معدنية م. محمد مصطفى`
        : `${t}${where ? ", " + where : ""}, steel structure design by Mohamed Mustafa`;
    };
    img.alt = altText();
    langHooks.push(() => (img.alt = altText()));
    img.loading = "lazy";
    img.decoding = "async";
    media.appendChild(img);
    media.insertAdjacentHTML("beforeend",
      `<span class="p-count"><svg class="ic"><use href="#i-file"/></svg>${names.length}</span>` +
      `<span class="p-open" data-ar="افتح المشروع">Open project</span>`);
    p.prepend(media);

    p.tabIndex = 0;
    p.setAttribute("role", "button");
    const label = () => p.setAttribute("aria-label", title.textContent.trim());
    label();
    langHooks.push(label);
    p.addEventListener("click", () => Viewer.open(p));
    p.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); Viewer.open(p); }
    });
  });

  // ---------- filters ----------
  const bar = document.getElementById("filters");
  const buttons = [...bar.querySelectorAll(".filter")];
  const ink = bar.querySelector(".filter-ink");
  let current = "all";

  const matches = (p, f) => f === "all" || p.dataset.cat === f ||
    (p.dataset.country || "").split(/\s+/).includes(f);

  buttons.forEach((b) => {
    const n = all.filter((p) => matches(p, b.dataset.filter)).length;
    b.insertAdjacentHTML("beforeend", `<b class="fcount">${n}</b>`);
  });

  function placeInk() {
    const b = bar.querySelector(".filter.active");
    ink.style.width = b.offsetWidth + "px";
    ink.style.height = b.offsetHeight + "px";
    ink.style.transform = `translate(${b.offsetLeft}px, ${b.offsetTop}px)`;
  }

  buttons.forEach((b) => b.addEventListener("click", () => {
    current = b.dataset.filter;
    buttons.forEach((x) => x.classList.toggle("active", x === b));
    placeInk();
    let i = 0;
    all.forEach((p) => {
      p.classList.remove("is-in");
      if (matches(p, current)) {
        p.hidden = false;
        p.style.animationDelay = `${Math.min(i++, 12) * 45}ms`;
        void p.offsetWidth;
        p.classList.add("is-in");
      } else {
        p.hidden = true;
      }
    });
  }));

  const ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  ready.then(placeInk);
  window.addEventListener("resize", placeInk);
  langHooks.push(() => requestAnimationFrame(placeInk));

  return {
    visible: () => viewable.filter((p) => !p.hidden),
    byId: (id) => document.getElementById(id),
  };
})();

// featured tiles open their project in the viewer
document.querySelectorAll("[data-open]").forEach((b) => {
  b.addEventListener("click", () => {
    const p = Projects.byId(b.dataset.open);
    if (p) Viewer.open(p);
    else location.href = "projects.html?lang=" + (isArabic() ? "ar" : "en") + "#" + b.dataset.open;
  });
});

// ---------------------------------------------------------------------
// 7. Project viewer: images, thumbnails, zoom (wheel, pinch, buttons), swipe
// ---------------------------------------------------------------------
const Viewer = (() => {
  const box = document.getElementById("viewer");
  const stage = document.getElementById("v-stage");
  const img = document.getElementById("v-img");
  const $ = (id) => document.getElementById(id);
  const title = $("v-title"), meta = $("v-meta"), desc = $("v-desc"), thumbs = $("v-thumbs");
  const count = $("v-count"), prev = $("v-prev"), next = $("v-next"), zoomLevel = $("v-zoom-level");

  let list = [], pi = 0, names = [], ii = 0, returnFocus = null;
  let scale = 1, tx = 0, ty = 0;

  function apply(animate) {
    img.style.transition = animate ? "transform .3s cubic-bezier(.22,1,.36,1), opacity .25s" : "opacity .25s";
    img.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
    zoomLevel.textContent = Math.round(scale * 100) + "%";
  }
  function clampPan() {
    const w = img.offsetWidth * scale, h = img.offsetHeight * scale;
    const mx = Math.max(0, (w - stage.clientWidth) / 2 + 40);
    const my = Math.max(0, (h - stage.clientHeight) / 2 + 40);
    tx = Math.min(mx, Math.max(-mx, tx));
    ty = Math.min(my, Math.max(-my, ty));
  }
  function zoomAt(px, py, s, animate) {
    s = Math.min(6, Math.max(1, s));
    const r = stage.getBoundingClientRect();
    const ox = px - (r.left + r.width / 2), oy = py - (r.top + r.height / 2);
    tx = ox - (s / scale) * (ox - tx);
    ty = oy - (s / scale) * (oy - ty);
    scale = s;
    if (scale === 1) { tx = 0; ty = 0; }
    clampPan();
    apply(animate);
  }
  const resetZoom = (animate) => { scale = 1; tx = 0; ty = 0; apply(animate); };

  function renderInfo() {
    const p = list[pi];
    title.textContent = p.querySelector("h3").textContent.trim();
    meta.innerHTML = p.querySelector(".project-meta").innerHTML;
    desc.textContent = p.querySelector(".project-description").textContent.trim();
    $("v-prev-proj").disabled = list.length < 2;
    $("v-next-proj").disabled = list.length < 2;
  }

  function renderThumbs() {
    thumbs.innerHTML = "";
    names.forEach((n, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", `${i + 1} / ${names.length}`);
      b.innerHTML = `<img src="images/thumb/${n}.webp" alt="" loading="lazy">`;
      b.addEventListener("click", () => show(i));
      thumbs.appendChild(b);
    });
  }

  function show(i) {
    ii = i;
    resetZoom(false);
    const n = names[ii];
    const full = `images/full/${n}.webp`;
    img.classList.add("loading");
    img.src = `images/thumb/${n}.webp`;
    img.alt = `${title.textContent} (${ii + 1} / ${names.length})`;
    img.style.animation = "none"; void img.offsetWidth; img.style.animation = "";
    const hi = new Image();
    hi.onload = () => { if (names[ii] === n) { img.src = full; img.classList.remove("loading"); } };
    hi.onerror = () => img.classList.remove("loading");
    hi.src = full;
    count.textContent = `${ii + 1} / ${names.length}`;
    prev.disabled = ii === 0;
    next.disabled = ii === names.length - 1;
    [...thumbs.children].forEach((b, k) => b.classList.toggle("active", k === ii));
    thumbs.children[ii]?.scrollIntoView({ block: "nearest", inline: "nearest" });
    [ii - 1, ii + 1].forEach((k) => { if (names[k]) new Image().src = `images/full/${names[k]}.webp`; });
  }

  function load(index) {
    pi = (index + list.length) % list.length;
    names = list[pi].dataset.images.split(/\s+/).filter(Boolean);
    renderInfo();
    renderThumbs();
    show(0);
  }

  function open(p) {
    list = Projects.visible();
    if (!list.includes(p)) list = [p];
    returnFocus = document.activeElement;
    box.hidden = false;
    document.documentElement.style.overflow = "hidden";
    load(list.indexOf(p));
    $("v-close").focus();
  }

  function close() {
    box.hidden = true;
    document.documentElement.style.overflow = "";
    img.removeAttribute("src");
    if (returnFocus && returnFocus.focus) returnFocus.focus({ preventScroll: true });
  }

  const goPrev = () => { if (ii > 0) show(ii - 1); };
  const goNext = () => { if (ii < names.length - 1) show(ii + 1); };

  prev.addEventListener("click", goPrev);
  next.addEventListener("click", goNext);
  $("v-close").addEventListener("click", close);
  $("v-prev-proj").addEventListener("click", () => load(pi - 1));
  $("v-next-proj").addEventListener("click", () => load(pi + 1));
  $("v-zoom-in").addEventListener("click", () => {
    const r = stage.getBoundingClientRect(); zoomAt(r.left + r.width / 2, r.top + r.height / 2, scale * 1.5, true);
  });
  $("v-zoom-out").addEventListener("click", () => {
    const r = stage.getBoundingClientRect(); zoomAt(r.left + r.width / 2, r.top + r.height / 2, scale / 1.5, true);
  });

  document.addEventListener("keydown", (e) => {
    if (box.hidden) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowRight") goNext();
    else if (e.key === "ArrowLeft") goPrev();
    else if (e.key === "+" || e.key === "=") $("v-zoom-in").click();
    else if (e.key === "-") $("v-zoom-out").click();
  });

  stage.addEventListener("wheel", (e) => {
    e.preventDefault();
    zoomAt(e.clientX, e.clientY, scale * (e.deltaY < 0 ? 1.18 : 1 / 1.18), false);
  }, { passive: false });
  stage.addEventListener("dblclick", (e) => zoomAt(e.clientX, e.clientY, scale > 1 ? 1 : 2.6, true));

  // pointers: pan when zoomed, swipe when not, pinch with two fingers, double tap
  const pts = new Map();
  let g = null, lastTap = { t: 0, x: 0, y: 0 };

  stage.addEventListener("pointerdown", (e) => {
    if (e.target.closest("button")) return;
    stage.setPointerCapture(e.pointerId);
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pts.size === 1) {
      g = { type: scale > 1 ? "pan" : "swipe", x0: e.clientX, y0: e.clientY, tx0: tx, ty0: ty, moved: false };
    } else if (pts.size === 2) {
      const [a, b] = [...pts.values()];
      g = { type: "pinch", d0: Math.hypot(a.x - b.x, a.y - b.y), mx0: (a.x + b.x) / 2, my0: (a.y + b.y) / 2, s0: scale, tx0: tx, ty0: ty, moved: true };
    }
  });
  stage.addEventListener("pointermove", (e) => {
    if (!pts.has(e.pointerId) || !g) return;
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (g.type === "pinch" && pts.size >= 2) {
      const [a, b] = [...pts.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      const r = stage.getBoundingClientRect();
      const cx0 = g.mx0 - (r.left + r.width / 2), cy0 = g.my0 - (r.top + r.height / 2);
      const s = Math.min(6, Math.max(1, g.s0 * (d / g.d0)));
      const mx = (a.x + b.x) / 2 - (r.left + r.width / 2), my = (a.y + b.y) / 2 - (r.top + r.height / 2);
      tx = mx - (s / g.s0) * (cx0 - g.tx0);
      ty = my - (s / g.s0) * (cy0 - g.ty0);
      scale = s;
      clampPan(); apply(false);
      return;
    }
    const dx = e.clientX - g.x0, dy = e.clientY - g.y0;
    if (Math.abs(dx) > 6 || Math.abs(dy) > 6) g.moved = true;
    if (g.type === "pan") { tx = g.tx0 + dx; ty = g.ty0 + dy; clampPan(); apply(false); }
    else if (g.type === "swipe") { tx = dx; apply(false); }
  });
  function up(e) {
    if (!pts.has(e.pointerId)) return;
    pts.delete(e.pointerId);
    if (!g) return;
    if (g.type === "pinch") {
      if (pts.size === 0) { if (scale < 1.05) resetZoom(true); g = null; }
      else { const [p] = [...pts.values()]; g = { type: "pan", x0: p.x, y0: p.y, tx0: tx, ty0: ty, moved: true }; }
      return;
    }
    const dx = e.clientX - g.x0, dy = e.clientY - g.y0;
    if (g.type === "swipe") {
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) (dx < 0 ? goNext : goPrev)();
      else resetZoom(true);
    }
    if (!g.moved && e.pointerType !== "mouse") {
      const now = Date.now();
      if (now - lastTap.t < 300 && Math.hypot(e.clientX - lastTap.x, e.clientY - lastTap.y) < 30) {
        zoomAt(e.clientX, e.clientY, scale > 1 ? 1 : 2.6, true);
        lastTap.t = 0;
      } else lastTap = { t: now, x: e.clientX, y: e.clientY };
    }
    g = null;
  }
  stage.addEventListener("pointerup", up);
  stage.addEventListener("pointercancel", up);

  langHooks.push(() => { if (!box.hidden) renderInfo(); });

  return { open, close };
})();

// ---------------------------------------------------------------------
// 8. Contact form: sends without leaving the page
// ---------------------------------------------------------------------
(() => {
  const form = document.getElementById("contact-form");
  if (!form) return;
  const status = document.getElementById("form-status");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const button = form.querySelector("button[type=submit]");
    button.disabled = true;
    status.className = "form-status";
    status.textContent = isArabic() ? "جارٍ الإرسال…" : "Sending…";
    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(res.status);
      form.reset();
      status.classList.add("ok");
      status.textContent = isArabic() ? "شكرًا! تم إرسال رسالتك." : "Thanks! Your message was sent.";
    } catch {
      status.classList.add("err");
      status.textContent = isArabic()
        ? "تعذّر الإرسال. راسلني على engineer422002@gmail.com"
        : "The message couldn't be sent. Please email engineer422002@gmail.com";
    } finally {
      button.disabled = false;
    }
  });
})();

// ---------------------------------------------------------------------
// Visitor statistics (GoatCounter). Mohamed sees all the numbers on his
// GoatCounter dashboard. The public counter in the footer stays hidden
// and appears by itself once the total passes SHOW_FROM visitors.
// Opening the site once with #mohamed shows the counter on that device
// all the time (for Mohamed only) and stops counting his own visits;
// #mohamed-off undoes it.
// ---------------------------------------------------------------------
(() => {
  const CODE = "mohamedmustafa"; // the GoatCounter site code (mohamedmustafa.goatcounter.com)
  const SHOW_FROM = 1000;
  const OWNER = "mm-owner";

  let owner = false;
  try {
    if (location.hash === "#mohamed") {
      localStorage.setItem(OWNER, "1");
      localStorage.setItem("skipgc", "t"); // GoatCounter skips this browser
    } else if (location.hash === "#mohamed-off") {
      localStorage.removeItem(OWNER);
      localStorage.removeItem("skipgc");
    }
    if (location.hash.startsWith("#mohamed")) history.replaceState(null, "", location.pathname + location.search);
    owner = localStorage.getItem(OWNER) === "1";
  } catch {}

  const show = (text) => {
    document.getElementById("visits-num").textContent = text;
    document.getElementById("ft-visits").hidden = false;
    document.querySelector(".footer").classList.add("has-visits");
  };

  if (!CODE) {
    if (owner) show("—");
    return;
  }
  const base = `https://${CODE}.goatcounter.com`;

  // the counting script itself is loaded from <head> in index.html

  // Visitors get GoatCounter's cached total (it refreshes every few hours).
  // On Mohamed's own devices ask for a fresh total: a different "start" date
  // each minute (always before the site existed, so the total is the same)
  // skips that cache.
  let url = base + "/counter/TOTAL.json";
  if (owner) {
    const day = Math.floor(Date.now() / 60000) % 20000;
    url += "?start=" + new Date(Date.UTC(1970, 0, 1) + day * 864e5).toISOString().slice(0, 10);
  }

  fetch(url)
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => {
      const n = d ? parseInt(String(d.count).replace(/\D/g, ""), 10) : NaN;
      if (Number.isFinite(n) && (owner || n >= SHOW_FROM)) show(n.toLocaleString("en-US"));
      else if (owner) show("—");
    })
    .catch(() => owner && show("—"));
})();

// ---------------------------------------------------------------------
// Open the Arabic version when the address has ?lang=ar
// ---------------------------------------------------------------------
{
  // order: ?lang in the address > the visitor's last choice > the device language
  const q = new URLSearchParams(location.search).get("lang");
  let saved = null;
  try { saved = localStorage.getItem("mm-lang"); } catch (e) {}
  const dev = (navigator.languages && navigator.languages[0]) || navigator.language || "en";
  const want = q || saved || (/^ar\b/i.test(dev) ? "ar" : "en");
  if (want === "ar") setLang("ar");
  else { try { localStorage.setItem("mm-lang", "en"); } catch (e) {} }
}
// open a project directly from a link like projects.html#project-park
if (location.hash.startsWith("#project-")) {
  const p = Projects.byId(location.hash.slice(1));
  if (p) setTimeout(() => Viewer.open(p), 300);
}
