/* ============================================================
   HARURI - Main JavaScript�iFIXED VERSION�j
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {

  // ===== Loading Screen =====
  const ls = document.getElementById('loading-screen');

  function hideLoading() {
    if (!ls) return;
    ls.style.pointerEvents = 'none';
    ls.style.transition = 'opacity 3s ease';
    ls.style.opacity = '1s';
    setTimeout(() => {
      if (ls.parentNode) ls.parentNode.removeChild(ls);
    }, 2000);
  }

  if (ls) {
    setTimeout(hideLoading, 2000);
    window.addEventListener("load", hideLoading);
  }

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

  // ===== Hero Slider =====
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

    const goTo = (n) => {
      current = (n + total) % total;
      slidesInner.style.transform = `translateX(-${current * (100 / total)}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    };

    if (sliderPrev) sliderPrev.addEventListener('click', () => { goTo(current - 1); resetTimer(); });
    if (sliderNext) sliderNext.addEventListener('click', () => { goTo(current + 1); resetTimer(); });

    dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); resetTimer(); }));

    let tStartX = 0;
    slidesInner.addEventListener('touchstart', e => { tStartX = e.touches[0].clientX; }, { passive: true });
    slidesInner.addEventListener('touchend', e => {
      const diff = tStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        goTo(diff > 0 ? current + 1 : current - 1);
        resetTimer();
      }
    });

    const startTimer = () => { heroTimer = setInterval(() => goTo(current + 1), 4000); };
    const resetTimer = () => { clearInterval(heroTimer); startTimer(); };

    startTimer();
  }

  // ===== Gallery Scroll =====
  const galleryTrack = document.getElementById('galleryTrack');

  if (galleryTrack) {
    let isDown = false, startX, scrollLeft;

    galleryTrack.addEventListener('mousedown', e => {
      isDown = true;
      startX = e.pageX - galleryTrack.offsetLeft;
      scrollLeft = galleryTrack.parentElement.scrollLeft;
    });

    document.addEventListener('mouseup', () => isDown = false);

    galleryTrack.addEventListener('mousemove', e => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - galleryTrack.offsetLeft;
      galleryTrack.parentElement.scrollLeft = scrollLeft - (x - startX);
    });
  }

  // ===== Scroll Fade =====
  const fadeEls = document.querySelectorAll('.fade-in');

  if (fadeEls.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    });

    fadeEls.forEach(el => observer.observe(el));
  }

  // ===== Gallery Modal =====
  const galleryData = [
    { label: 'Resin Accessories' },
    { label: 'Plush Clothes' },
    { label: 'Sakura Series' },
    { label: 'Oshi Charm' },
    { label: 'Crystal Piercing' },
    { label: 'Glitter Series' },
  ];

  let currentGallery = 0;

  window.openGalleryModal = (idx) => {
    currentGallery = idx;
    renderGalleryModal();
    document.getElementById('galleryModal').classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const renderGalleryModal = () => {
    const d = galleryData[currentGallery];
    const lbl = document.getElementById('galleryModalLabel');
    if (lbl) lbl.textContent = d.label;
  };

  window.changeGalleryModal = (dir) => {
    currentGallery = (currentGallery + dir + galleryData.length) % galleryData.length;
    renderGalleryModal();
  };

  // ===== Media Modal =====
  const mediaContent = {
    youtube: `<h3>YouTube</h3><a href="https://youtube.com" target="_blank">View</a>`,
    tiktok: `<h3>TikTok</h3><a href="https://tiktok.com" target="_blank">View</a>`
  };

  window.openModal = (type) => {
    const overlay = document.getElementById('mediaModal');
    const content = document.getElementById('mediaModalContent');
    if (!overlay || !content) return;
    content.innerHTML = mediaContent[type] || '';
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeModal = (id) => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('open');
    document.body.style.overflow = '';
  };

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      window.closeModal('mediaModal');
      window.closeModal('galleryModal');
    }
  });

  // ===== Petals =====
  const createPetal = () => {
    const container = document.getElementById('petalsContainer');
    if (!container) return;

    const petal = document.createElement('div');
    petal.className = 'petal';
    petal.style.left = Math.random() * 100 + 'vw';

    container.appendChild(petal);
    setTimeout(() => petal.remove(), 8000);
  };

  setInterval(createPetal, 2000);

});
