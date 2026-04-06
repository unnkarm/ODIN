/**
 * ODIN — Shared Core JavaScript
 * Cursor · Stars · Navigation · Page Transitions · Scroll Reveal · Count-Up
 */

/* ═══════════════════════════════════════════════════
   PAGE TRANSITION
   ═══════════════════════════════════════════════════ */
function goTo(href) {
  const overlay = document.getElementById('page-transition');
  if (!overlay) { location.href = href; return; }
  overlay.classList.add('active');
  setTimeout(() => { location.href = href; }, 640);
}

// Wire up all [data-href] elements
function initLinks() {
  document.querySelectorAll('[data-href]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      goTo(el.dataset.href);
    });
  });
}

/* ═══════════════════════════════════════════════════
   CUSTOM CURSOR
   ═══════════════════════════════════════════════════ */
function initCursor() {
  const dot  = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  // Ring follows with lag
  const followRing = () => {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(followRing);
  };
  followRing();

  // Hover expand
  const hoverEls = 'button, a, [data-href], .opt, .scenario, .arch-card';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverEls)) {
      document.body.classList.add('cursor-hover');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverEls)) {
      document.body.classList.remove('cursor-hover');
    }
  });
}

/* ═══════════════════════════════════════════════════
   STAR FIELD
   ═══════════════════════════════════════════════════ */
function initStars(canvasId = 'stars', count = 350) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];

  const resize = () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = Array.from({ length: count }, () => ({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      r:  Math.random() * 1.3 + 0.15,
      o:  Math.random(),
      sp: Math.random() * 0.005 + 0.002,
    }));
  };
  resize();
  window.addEventListener('resize', resize);

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.o += s.sp * (Math.random() > 0.5 ? 1 : -1);
      s.o  = Math.max(0.04, Math.min(0.92, s.o));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${s.o.toFixed(2)})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  };
  draw();
}

/* ═══════════════════════════════════════════════════
   NAVIGATION
   ═══════════════════════════════════════════════════ */
function initNav(activePage) {
  const pages = [
    { id: 'index',        label: 'Home',         href: 'index.html' },
    { id: 'mission',      label: 'Mission',       href: 'mission.html' },
    { id: 'architecture', label: 'Architecture',  href: 'architecture.html' },
    { id: 'copilot',      label: 'AI Copilot',    href: 'copilot.html' },
    { id: 'report',       label: 'Report',        href: 'report.html' },
  ];

  const links = pages.map(p =>
    `<a class="nav-link${p.id === activePage ? ' active' : ''}" data-href="${p.href}">${p.label}</a>`
  ).join('');

  const mount = document.getElementById('nav-mount');
  if (!mount) return;

  mount.innerHTML = `
    <nav id="main-nav">
      <a class="nav-logo" data-href="index.html">O<span class="accent">DIN</span></a>
      <div class="nav-links">${links}</div>
      <div class="nav-right">
        <div class="nav-dot"></div>
        <span id="nav-clock">T+00:00:00</span>
      </div>
      <button class="nav-burger" onclick="toggleMobileMenu()" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </nav>
    <div id="mobile-menu">
      ${pages.map(p => `<a class="mob-link" data-href="${p.href}">${p.label}</a>`).join('')}
    </div>`;

  // Scroll shadow
  window.addEventListener('scroll', () => {
    document.getElementById('main-nav')
      ?.classList.toggle('scrolled', window.scrollY > 80);
  });

  // Re-wire links after injecting
  initLinks();

  // Mission clock
  startClock();
}

function toggleMobileMenu() {
  document.getElementById('mobile-menu')?.classList.toggle('open');
}

/* ═══════════════════════════════════════════════════
   MISSION ELAPSED TIME CLOCK
   ═══════════════════════════════════════════════════ */
function startClock(startSeconds = 66247) {
  let s = startSeconds;
  const tick = () => {
    s++;
    const h  = String(Math.floor(s / 3600)).padStart(2, '0');
    const m  = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
    const sc = String(s % 60).padStart(2, '0');
    const el = document.getElementById('nav-clock');
    if (el) el.textContent = `T+${h}:${m}:${sc}`;
  };
  setInterval(tick, 1000);
}

/* ═══════════════════════════════════════════════════
   SCROLL REVEAL (IntersectionObserver)
   ═══════════════════════════════════════════════════ */
function initReveal() {
  const targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!targets.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Animate any progress bars inside
        entry.target.querySelectorAll('[data-w]').forEach(bar => {
          setTimeout(() => { bar.style.width = bar.dataset.w; }, 300);
        });
      }
    });
  }, { threshold: 0.1 });

  targets.forEach(el => io.observe(el));
}

/* ═══════════════════════════════════════════════════
   COUNT-UP NUMBERS
   ═══════════════════════════════════════════════════ */
function countUp(el, target, duration = 2000) {
  const start = Date.now();
  const step = () => {
    const elapsed  = Date.now() - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 4);
    el.textContent = Math.floor(ease * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
  };
  step();
}

function initCountUp() {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target._counted) {
        entry.target._counted = true;
        countUp(entry.target, parseInt(entry.target.dataset.count));
      }
    });
  }, { threshold: 0.4 });

  els.forEach(el => io.observe(el));
}

/* ═══════════════════════════════════════════════════
   INIT ALL — call on DOMContentLoaded
   ═══════════════════════════════════════════════════ */
function odinInit(page) {
  initCursor();
  initStars();
  initLinks();
  if (page) initNav(page);
  initReveal();
  initCountUp();
}
