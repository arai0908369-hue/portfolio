/* ============================================================
   HARURI - Main JavaScript
   ============================================================ */

// ===== Loading Screen - Oshi-katsu =====
(function() {
  var ls = document.getElementById('loading-screen');
  if (!ls) return;

  var canvas = document.getElementById('ldCanvas');
  if (canvas) {
    var ctx = canvas.getContext('2d');
    var W, H;

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // パーティクル生成
    var particles = [];
    var types = ['star', 'heart', 'cross', 'dot'];

    function makeParticle() {
      var type = types[Math.floor(Math.random() * types.length)];
      return {
        x:    Math.random() * W,
        y:    H + 20,
        vx:   (Math.random() - 0.5) * 0.8,
        vy:   -(0.6 + Math.random() * 1.4),
        r:    2 + Math.random() * 5,
        op:   0.2 + Math.random() * 0.7,
        hue:  290 + Math.random() * 70,
        type: type,
        rot:  Math.random() * Math.PI * 2,
        rotV: (Math.random() - 0.5) * 0.04,
        life: 0,
        maxLife: 120 + Math.random() * 100
      };
    }
    for (var i = 0; i < 60; i++) {
      var p = makeParticle();
      p.y = Math.random() * H;
      particles.push(p);
    }

    // ハートパス
    function heartPath(cx, cy, r) {
      ctx.beginPath();
      ctx.moveTo(cx, cy + r * 0.3);
      ctx.bezierCurveTo(cx, cy - r * 0.5, cx - r * 1.2, cy - r * 0.5, cx - r * 1.2, cy + r * 0.2);
      ctx.bezierCurveTo(cx - r * 1.2, cy + r * 0.9, cx, cy + r * 1.5, cx, cy + r * 1.5);
      ctx.bezierCurveTo(cx, cy + r * 1.5, cx + r * 1.2, cy + r * 0.9, cx + r * 1.2, cy + r * 0.2);
      ctx.bezierCurveTo(cx + r * 1.2, cy - r * 0.5, cx, cy - r * 0.5, cx, cy + r * 0.3);
      ctx.closePath();
    }

    // 十字星パス
    function crossPath(cx, cy, r) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(Math.PI / 4);
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 0.28, r * 2.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 2.2, r * 0.28, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function drawParticle(p) {
      ctx.save();
      var fade = Math.min(p.life / 20, 1) * Math.min((p.maxLife - p.life) / 20, 1);
      ctx.globalAlpha = p.op * fade;

      var grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
      grd.addColorStop(0, 'hsla('+p.hue+',85%,88%,1)');
      grd.addColorStop(1, 'hsla('+p.hue+',75%,75%,0)');
      ctx.fillStyle = grd;
      ctx.strokeStyle = 'hsla('+p.hue+',85%,82%,0.8)';
      ctx.lineWidth = 0.8;

      if (p.type === 'heart') {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.translate(-p.x, -p.y);
        heartPath(p.x, p.y - p.r * 0.6, p.r * 0.7);
        ctx.fill();
        ctx.restore();
      } else if (p.type === 'cross') {
        crossPath(p.x, p.y, p.r);
      } else if (p.type === 'star') {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 1.5, 0, Math.PI * 2);
        ctx.fill();
        // 光の十字
        ctx.save();
        ctx.globalAlpha = p.op * fade * 0.7;
        ctx.fillStyle = 'hsla('+p.hue+',90%,95%,1)';
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.r * 0.2, p.r * 2.8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.r * 2.8, p.r * 0.2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    var animId;
    function tick() {
      if (!document.getElementById('loading-screen')) {
        cancelAnimationFrame(animId);
        return;
      }
      ctx.clearRect(0, 0, W, H);

      for (var i = particles.length - 1; i >= 0; i--) {
        var p = particles[i];
        p.x   += p.vx;
        p.y   += p.vy;
        p.rot += p.rotV;
        p.life++;
        if (p.life > p.maxLife) {
          particles.splice(i, 1);
          particles.push(makeParticle());
        } else {
          drawParticle(p);
        }
      }
      animId = requestAnimationFrame(tick);
    }
    tick();
  }

  // 消す処理
  var hidden = false;
  function hideLoading() {
    if (hidden) return;
    hidden = true;
    ls.style.pointerEvents = 'none';
    ls.style.touchAction   = 'none';
    ls.style.zIndex        = '-1';
    ls.style.transition    = 'opacity 0.7s ease';
    ls.style.opacity       = '0';
    setTimeout(function() {
      ls.style.display = 'none';
      ls.style.visibility = 'hidden';
      if (ls.parentNode) ls.parentNode.removeChild(ls);
    }, 750);
  }

  setTimeout(hideLoading, 2800);
  ls.addEventListener('touchstart', function() {
    setTimeout(hideLoading, 300);
  }, { passive: true });
  document.addEventListener('visibilitychange', function() {
    if (!document.hidden) hideLoading();
  });
})();

// ===== Hamburger =====


const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });
  mobileNav.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
    })
  );
}

const slidesInner = document.getElementById('heroSlidesInner');
const sliderPrev  = document.getElementById('sliderPrev');
const sliderNext  = document.getElementById('sliderNext');
const dotsWrap    = document.getElementById('sliderDots');

if (slidesInner) {
  const slides = slidesInner.querySelectorAll('.hero-slide-card');
  const dots   = dotsWrap ? dotsWrap.querySelectorAll('.dot') : [];
  const total  = slides.length;
  let current  = 0;
  let heroTimer;

  function goTo(n) {
    current = (n + total) % total;
    slidesInner.style.transform = `translateX(-${current * (100 / total)}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  if (sliderPrev) sliderPrev.addEventListener('click', () => { goTo(current - 1); resetTimer(); });
  if (sliderNext) sliderNext.addEventListener('click', () => { goTo(current + 1); resetTimer(); });
  dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); resetTimer(); }));

  let tStartX = 0;
  slidesInner.addEventListener('touchstart', e => { tStartX = e.touches[0].clientX; }, { passive: true });
  slidesInner.addEventListener('touchend',   e => {
    const diff = tStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { goTo(diff > 0 ? current + 1 : current - 1); resetTimer(); }
  });

  function startTimer() { heroTimer = setInterval(() => goTo(current + 1), 4000); }
  function resetTimer() { clearInterval(heroTimer); startTimer(); }
  startTimer();
}

const galleryTrack = document.getElementById('galleryTrack');
if (galleryTrack) {
  let isDown = false, startX, scrollLeft;
  galleryTrack.addEventListener('mousedown', e => {
    isDown = true;
    galleryTrack.style.cursor = 'grabbing';
    startX = e.pageX - galleryTrack.offsetLeft;
    scrollLeft = galleryTrack.parentElement.scrollLeft;
  });
  document.addEventListener('mouseup', () => { isDown = false; if (galleryTrack) galleryTrack.style.cursor = 'grab'; });
  galleryTrack.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - galleryTrack.offsetLeft;
    galleryTrack.parentElement.scrollLeft = scrollLeft - (x - startX);
  });
  galleryTrack.style.cursor = 'grab';
  // Make gallery outer scrollable
  const galleryOuter = galleryTrack.parentElement;
  galleryOuter.style.overflowX = 'auto';
  galleryOuter.style.scrollbarWidth = 'none';
  galleryOuter.style.msOverflowStyle = 'none';
}

// ===== Scroll Fade-in =====
const fadeEls = document.querySelectorAll('.fade-in');
if (fadeEls.length) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0 });

  fadeEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('visible');
    } else {
      observer.observe(el);
    }
  });
}

// ===== Gallery Data =====
const galleryData = [
  { emoji: '??', bg: 'linear-gradient(135deg,#e8c0d8,#d4b0d0,#c8c0e8)', label: 'Resin Accessories' },
  { emoji: '??', bg: 'linear-gradient(135deg,#c4d4a8,#b8c89c,#a8c090)', label: 'Plush Clothes' },
  { emoji: '??', bg: 'linear-gradient(135deg,#f0c0d0,#e8b0c8,#d8a8c0)', label: 'Sakura Series' },
  { emoji: 'Oshi', bg: 'linear-gradient(135deg,#e8c8a0,#e0c098,#d0b888)', label: 'Oshi Charm' },
  { emoji: '??', bg: 'linear-gradient(135deg,#b8c8e8,#b0c0e0,#a8b8d8)', label: 'Crystal Piercing' },
  { emoji: '?', bg: 'linear-gradient(135deg,#f0d0e0,#e8c8d8,#d8b8c8)', label: 'Glitter Series' },
];
let currentGallery = 0;

function openGalleryModal(idx) {
  currentGallery = idx;
  renderGalleryModal();
  document.getElementById('galleryModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function renderGalleryModal() {
  const d = galleryData[currentGallery];
  const img = document.getElementById('galleryModalImg');
  const lbl = document.getElementById('galleryModalLabel');
  if (img) { img.style.background = d.bg; img.textContent = d.emoji; }
  if (lbl) lbl.textContent = d.label;
}
function changeGalleryModal(dir) {
  currentGallery = (currentGallery + dir + galleryData.length) % galleryData.length;
  renderGalleryModal();
}

// ===== Media Modals =====
const mediaContent = {
  youtube: `
    <div class="modal-thumb yt"><img src="./image/samune.png" alt="YouTube"></div>
    <h3>YouTube channel</h3>
    <p>HaruriのYouTubeチャンネルへようこそ！</p>
    <a class="modal-link" href="https://youtube.com" target="_blank">YouTube　View Channel！</a>
  `,
  tiktok: `
    <div class="modal-thumb tk">??</div>
    <h3>TikTok Live</h3>
    <p>TikTokLive streams and short making videos.<br>Enjoy real-time interaction!</p>
    <a class="modal-link" href="https://tiktok.com" target="_blank">?? TikTok View</a>
  `,
};
function openModal(type) {
  const overlay = document.getElementById('mediaModal');
  const content = document.getElementById('mediaModalContent');
  if (!overlay || !content) return;
  content.innerHTML = mediaContent[type] || '';
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeModal('mediaModal'); closeModal('galleryModal'); }
});

// ===== Contact Form =====
function clearForm() {
  ['name','email','tel','message'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}
function submitForm() {
  const name    = document.getElementById('name');
  const email   = document.getElementById('email');
  const message = document.getElementById('message');
  if (!name || !email || !message) return;
  if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
    const btn = document.querySelector('.btn-send');
    if (btn) { btn.style.animation = 'none'; btn.offsetHeight; btn.style.animation = 'shake 0.4s ease'; }
    return;
  }
  showToast();
  clearForm();
}
function showToast() {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3600);
}

// ===== Floating Petals =====
function createPetal() {
  const container = document.getElementById('petalsContainer');
  if (!container) return;
  const petal = document.createElement('div');
  petal.className = 'petal';
  const size     = 8 + Math.random() * 13;
  const left     = Math.random() * 100;
  const duration = 9 + Math.random() * 13;
  const delay    = Math.random() * -18;
  const hue      = 328 + Math.random() * 38;
  petal.style.cssText = `
    width:${size}px; height:${size}px; left:${left}vw;
    animation-duration:${duration}s; animation-delay:${delay}s;
    background: radial-gradient(circle at 38% 38%, hsla(${hue},70%,82%,0.9), hsla(${hue},58%,70%,0.6));
  `;
  container.appendChild(petal);
  setTimeout(() => petal.remove(), (duration + Math.abs(delay)) * 1000 + 1500);
}
for (let i = 0; i < 16; i++) setTimeout(createPetal, i * 650);
setInterval(createPetal, 2400);

function toggleOrderFields() {
  const type = document.getElementById("type").value;
  const orderFields = document.getElementById("orderFields");

  if (type === "order") {
    orderFields.style.display = "block";
  } else {
    orderFields.style.display = "none";
  }
}
