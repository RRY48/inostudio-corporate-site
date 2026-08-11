/* ==========================================================================
   Иностудио — общий скрипт сайта (прототип)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  initMenu();
  initFilters();
  initForm();
  initReveal();
});

/* ---------- Мобильное меню ---------- */
function initMenu() {
  var toggle = document.getElementById('menuToggle');
  var nav = document.getElementById('mainNav');

  if (!toggle || !nav) return;

  toggle.addEventListener('click', function () {
    nav.classList.toggle('open');
  });

  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('open');
    });
  });

  document.addEventListener('click', function (e) {
    if (!nav.contains(e.target) && !toggle.contains(e.target)) {
      nav.classList.remove('open');
    }
  });
}

/* ---------- Фильтры (кейсы и блог) ---------- */
function initFilters() {
  var filterBar = document.getElementById('filterBar');
  if (!filterBar) return;

  var grid = document.getElementById('casesGrid') || document.getElementById('blogGrid');
  if (!grid) return;

  var noResults = document.getElementById('noResults');
  var buttons = filterBar.querySelectorAll('.filter-btn');

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      buttons.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      var filter = btn.getAttribute('data-filter');
      var visibleCount = 0;

      grid.querySelectorAll('.case-card, .blog-card').forEach(function (card) {
        var categories = (card.getAttribute('data-category') || '').split(' ');

        if (filter === 'all' || categories.indexOf(filter) !== -1) {
          card.classList.remove('hide');
          visibleCount++;
        } else {
          card.classList.add('hide');
        }
      });

      if (noResults) {
        noResults.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    });
  });
}

/* ---------- Анимации появления ---------- */
function initReveal() {
  var items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach(function (item) { item.classList.add('visible'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  items.forEach(function (item) { observer.observe(item); });
}

/* ---------- Форма (демо без сервера) ---------- */
function initForm() {
  var form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name = document.getElementById('name');
    var phone = document.getElementById('phone');

    if (name && !name.value.trim()) {
      name.focus();
      return;
    }

    if (phone && !phone.value.trim()) {
      phone.focus();
      return;
    }

    form.classList.add('show-success');

    setTimeout(function () {
      form.classList.remove('show-success');
      form.reset();
    }, 5000);
  });
}

/* ---------- Видео-заглушка в hero ---------- */
document.addEventListener('click', function (e) {
  var playBtn = e.target.closest('.play-btn');
  if (playBtn) {
    var caption = playBtn.closest('.video-placeholder').querySelector('.video-caption');
    if (caption) caption.textContent = 'Видео появится здесь (демо-заглушка) ▶';
  }
});