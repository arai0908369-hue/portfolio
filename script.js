/* ============================================================
   HARURI - Main JavaScript
   ============================================================ */

// ===== Loading Screen =====
(function() {
  var screen = document.getElementById('loading-screen');
  if (!screen) return;

  // 闃ｱ縺ｳ繧臥函謌・  var lp = document.getElementById('loadingPetals');
  if (lp) {
    for (var i = 0; i < 12; i++) {
      var p = document.createElement('div');
      p.className = 'loading-petal';
      var size = 7 + Math.random() * 10;
      var hue  = 318 + Math.random() * 42;
      p.style.cssText = 'width:'+size+'px;height:'+size+'px;left:'+(Math.random()*100)+'vw;animation-duration:'+(7+Math.random()*8)+'s;animation-delay:'+(Math.random()*3)+'s;background:radial-gradient(circle at 38% 38%,hsla('+hue+',70%,82%,0.9),hsla('+hue+',58%,70%,0.6));';
      lp.appendChild(p);
    }
  }

  // 2.5遘貞ｾ後↓繝輔ぉ繝ｼ繝峨い繧ｦ繝遺・DOM蜑企勁
  setTimeout(function() {
    screen.classList.add('hide');
    setTimeout(function() {
      if (screen && screen.parentNode) screen.parentNode.removeChild(screen);
    }, 750);
  }, 2500);
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
    <div class="modal-thumb yt">?</div>
    <h3>YouTube Making Process</h3>
    <p>Watch the making process of resin accessories and plush clothes.<br>From material selection to completion.</p>
    <a class="modal-link" href="https://youtube.com" target="_blank">→ YouTubeView Channel</a>
  `,
  tiktok: `
    <div class="modal-thumb tk">♪</div>
    <h3>TikTok Livelive</h3>
    <p>TikTokLive streams and short making videos.<br>Enjoy real-time interaction!</p>
    <a class="modal-link" href="https://tiktok.com" target="_blank">→ TikTok View</a>
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
