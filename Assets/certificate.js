/* ── Certificate Lightbox ── */
(function () {
  const cards     = Array.from(document.querySelectorAll('.cert-card'));
  const lightbox  = document.getElementById('certLightbox');
  const backdrop  = document.getElementById('lightboxBackdrop');
  const closeBtn  = document.getElementById('lightboxClose');
  const img       = document.getElementById('lightboxImg');
  const titleEl   = document.getElementById('lightboxTitle');
  const orgEl     = document.getElementById('lightboxOrg');
  const yearEl    = document.getElementById('lightboxYear');
  const counter   = document.getElementById('lightboxCounter');
  const prevBtn   = document.getElementById('lightboxPrev');
  const nextBtn   = document.getElementById('lightboxNext');

  let current = 0;

  function openLightbox(index) {
    current = index;
    const card = cards[current];
    img.src        = card.dataset.img;
    img.alt        = card.dataset.title;
    titleEl.textContent = card.dataset.title;
    orgEl.textContent   = card.dataset.org;
    yearEl.textContent  = card.dataset.year;
    counter.textContent = `${current + 1} / ${cards.length}`;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function navigate(dir) {
    current = (current + dir + cards.length) % cards.length;
    openLightbox(current);
  }

  cards.forEach((card, i) => card.addEventListener('click', () => openLightbox(i)));
  closeBtn.addEventListener('click', closeLightbox);
  backdrop.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', () => navigate(-1));
  nextBtn.addEventListener('click', () => navigate(1));

  /* Keyboard navigation */
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });
})();