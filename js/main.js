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

/* ---------- Фильтры (портфолио: несколько групп; кейсы и блог: одна группа) ---------- */
function initFilters() {
  var bars = document.querySelectorAll('.filter-bar');
  if (!bars.length) return;

  var grid = document.getElementById('casesGrid') || document.getElementById('blogGrid') || document.getElementById('servicesGrid');
  if (!grid) return;

  var noResults = document.getElementById('noResults');
  var emptyMessage = 'В этой категории пока нет материалов. Обратитесь к нам — покажем похожие проекты.';
  if (document.getElementById('servicesGrid')) emptyMessage = 'В этой категории пока нет карточки. Расскажите о задаче — подберём экспертизу.';
  if (document.getElementById('casesGrid')) emptyMessage = 'В этой выборке пока нет проектов. Сбросьте фильтры или расскажите о задаче — покажем релевантный опыт.';

  var state = {};

  function valueOf(card, group) {
    var value = card.getAttribute('data-' + group);
    if (value === null && group === 'cat') value = card.getAttribute('data-category');
    return (value || '').split(' ');
  }

  function apply() {
    var visibleCount = 0;

    grid.querySelectorAll('.case-card, .blog-card, .service-card').forEach(function (card) {
      var ok = true;

      Object.keys(state).forEach(function (group) {
        var filter = state[group];
        if (!filter || filter === 'all') return;
        if (valueOf(card, group).indexOf(filter) === -1) ok = false;
      });

      if (ok) {
        card.classList.remove('hide');
        visibleCount++;
      } else {
        card.classList.add('hide');
      }
    });

    if (noResults) {
      if (visibleCount === 0) {
        noResults.style.display = 'block';
        noResults.innerHTML = '<p>' + emptyMessage + '</p>';
      } else {
        noResults.style.display = 'none';
      }
    }
  }

  Array.prototype.forEach.call(bars, function (bar) {
    var group = bar.getAttribute('data-group') || 'cat';
    state[group] = 'all';

    bar.querySelectorAll('.filter-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        bar.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        state[group] = btn.getAttribute('data-filter');
        apply();
      });
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