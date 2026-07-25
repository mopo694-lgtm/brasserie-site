// Header background on scroll
const header = document.getElementById('site-header');
const hasHero = !!document.querySelector('.hero');
const onScroll = () => {
  header.classList.toggle('is-scrolled', !hasHero || window.scrollY > 30);
};
onScroll();
if (hasHero) window.addEventListener('scroll', onScroll, { passive: true });

// Mobile nav toggle
const navToggle = document.getElementById('nav-toggle');
const mainNav = document.getElementById('main-nav');
navToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});
mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Menu flip card (index page only)
const menuFlip = document.getElementById('menu-flip');
const menuFlipBtn = document.getElementById('menu-flip-btn');
if (menuFlip && menuFlipBtn) {
  const menuFlipLabel = menuFlipBtn.querySelector('.menu-flip-btn-label');
  menuFlipBtn.addEventListener('click', () => {
    const flipped = menuFlip.classList.toggle('is-flipped');
    menuFlipLabel.textContent = flipped ? 'Voir la carte' : 'Voir les boissons';
    menuFlipBtn.setAttribute('aria-pressed', String(flipped));
  });
}

// Gallery: continuous auto-scroll, draggable, infinite loop (index page only)
const galleryTrack = document.getElementById('gallery-track');
if (galleryTrack) {
  // Duplicate the photo set once so the track can loop seamlessly.
  const originalImgs = Array.from(galleryTrack.children);
  originalImgs.forEach(img => {
    const clone = img.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.removeAttribute('alt');
    galleryTrack.appendChild(clone);
  });

  let setWidth = 0;
  const measureSetWidth = () => {
    const last = originalImgs[originalImgs.length - 1];
    setWidth = (last.offsetLeft + last.offsetWidth) - originalImgs[0].offsetLeft + 18;
  };
  measureSetWidth();
  window.addEventListener('resize', measureSetWidth);

  const keepInLoop = () => {
    if (!setWidth) return;
    const maxScroll = galleryTrack.scrollWidth - galleryTrack.clientWidth;
    if (galleryTrack.scrollLeft <= 1) {
      galleryTrack.scrollLeft += setWidth;
    } else if (galleryTrack.scrollLeft >= maxScroll - 1) {
      galleryTrack.scrollLeft -= setWidth;
    }
  };
  galleryTrack.scrollLeft = 1;
  keepInLoop();

  const SPEED_PX_PER_SEC = 28;
  let autoScroll = true;
  let isDragging = false;
  let lastTime = null;
  const tick = (time) => {
    if (lastTime === null) lastTime = time;
    const dt = (time - lastTime) / 1000;
    lastTime = time;
    if (autoScroll && !isDragging) {
      galleryTrack.scrollLeft += SPEED_PX_PER_SEC * dt;
      keepInLoop();
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  // Mouse drag-to-scroll (touch keeps native swipe scrolling)
  let dragStartX = 0;
  let dragStartScroll = 0;
  galleryTrack.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'touch') return;
    isDragging = true;
    dragStartX = e.clientX;
    dragStartScroll = galleryTrack.scrollLeft;
    galleryTrack.setPointerCapture(e.pointerId);
    galleryTrack.classList.add('is-dragging');
  });
  galleryTrack.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    galleryTrack.scrollLeft = dragStartScroll - (e.clientX - dragStartX);
    keepInLoop();
  });
  const endDrag = () => {
    isDragging = false;
    galleryTrack.classList.remove('is-dragging');
  };
  galleryTrack.addEventListener('pointerup', endDrag);
  galleryTrack.addEventListener('pointercancel', endDrag);
  galleryTrack.addEventListener('pointerleave', endDrag);

  // Pause auto-scroll during touch swipes so it doesn't fight the user
  let touchResume;
  galleryTrack.addEventListener('touchstart', () => {
    autoScroll = false;
    clearTimeout(touchResume);
  }, { passive: true });
  galleryTrack.addEventListener('touchend', () => {
    touchResume = setTimeout(() => { autoScroll = true; }, 300);
  });
  galleryTrack.addEventListener('scroll', () => {
    if (!isDragging) keepInLoop();
  }, { passive: true });
}

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
