(function () {
  'use strict';

  /* --- Navbar mobile menu --- */
  var navToggle = document.getElementById('navToggle');
  var navMenu = document.getElementById('navMenu');
  var navbar = document.getElementById('navbar');

  if (navToggle && navMenu) {
    var navLinks = navMenu.querySelectorAll('.navbar__link, .navbar__actions a');

    function closeMenu() {
      navMenu.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    function openMenu() {
      navMenu.classList.add('is-open');
      navToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    navToggle.addEventListener('click', function () {
      navMenu.classList.contains('is-open') ? closeMenu() : openMenu();
    });

    navLinks.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
        closeMenu();
        navToggle.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1024 && navMenu.classList.contains('is-open')) {
        closeMenu();
      }
    });
  }

  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('navbar--scrolled', window.scrollY > 8);
    }, { passive: true });
  }

  /* --- Scroll reveal --- */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* --- Animated counters --- */
  var statNumbers = document.querySelectorAll('.stat__number[data-target]');
  if (statNumbers.length && 'IntersectionObserver' in window) {
    var counted = false;
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !counted) {
          counted = true;
          statNumbers.forEach(function (el) {
            animateCounter(el);
          });
          counterObserver.disconnect();
        }
      });
    }, { threshold: 0.5 });

    var statsSection = document.querySelector('.hero__stats');
    if (statsSection) counterObserver.observe(statsSection);
  }

  function animateCounter(el) {
    var target = parseFloat(el.dataset.target);
    var isDecimal = el.dataset.decimal === 'true';
    var duration = 1800;
    var start = performance.now();

    function tick(now) {
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = target * eased;

      if (isDecimal) {
        el.textContent = current.toFixed(1);
      } else if (target >= 1000) {
        el.textContent = Math.floor(current).toLocaleString('es-ES') + '+';
      } else {
        el.textContent = Math.floor(current).toLocaleString('es-ES');
      }

      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  /* --- Feature tabs --- */
  var tabBtns = document.querySelectorAll('.feature-tabs__btn');
  var tabPanels = document.querySelectorAll('.feature-panel');

  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var tab = btn.dataset.tab;

      tabBtns.forEach(function (b) {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');

      tabPanels.forEach(function (panel) {
        var isMatch = panel.dataset.panel === tab;
        panel.classList.toggle('is-active', isMatch);
        panel.hidden = !isMatch;
      });
    });
  });

  /* --- FAQ accordion --- */
  var accordionItems = document.querySelectorAll('.accordion__item');
  accordionItems.forEach(function (item) {
    var trigger = item.querySelector('.accordion__trigger');
    if (!trigger) return;

    trigger.addEventListener('click', function () {
      var isOpen = item.classList.contains('is-open');

      accordionItems.forEach(function (other) {
        other.classList.remove('is-open');
        var t = other.querySelector('.accordion__trigger');
        if (t) t.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* --- Reviews carousel --- */
  var track = document.getElementById('reviewTrack');
  var prevBtn = document.getElementById('reviewPrev');
  var nextBtn = document.getElementById('reviewNext');
  var dotsContainer = document.getElementById('reviewDots');

  if (track && dotsContainer) {
    var cards = track.querySelectorAll('.review-card');
    var currentIndex = 0;

    cards.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.className = 'carousel__dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', 'Ir a reseña ' + (i + 1));
      dot.addEventListener('click', function () {
        scrollToIndex(i);
      });
      dotsContainer.appendChild(dot);
    });

    var dots = dotsContainer.querySelectorAll('.carousel__dot');

    function getScrollAmount() {
      var card = cards[0];
      if (!card) return 0;
      var gap = parseInt(getComputedStyle(track).gap) || 24;
      return card.offsetWidth + gap;
    }

    function scrollToIndex(index) {
      currentIndex = Math.max(0, Math.min(index, cards.length - 1));
      track.scrollTo({ left: getScrollAmount() * currentIndex, behavior: 'smooth' });
      updateDots();
    }

    function updateDots() {
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === currentIndex);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        scrollToIndex(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        scrollToIndex(currentIndex + 1);
      });
    }

    track.addEventListener('scroll', function () {
      var amount = getScrollAmount();
      if (amount === 0) return;
      currentIndex = Math.round(track.scrollLeft / amount);
      updateDots();
    }, { passive: true });

    var autoPlay = setInterval(function () {
      var next = currentIndex + 1 >= cards.length ? 0 : currentIndex + 1;
      scrollToIndex(next);
    }, 5000);

    track.addEventListener('mouseenter', function () { clearInterval(autoPlay); });
    track.addEventListener('touchstart', function () { clearInterval(autoPlay); }, { passive: true });
  }

  /* --- Active nav link on scroll --- */
  var sections = document.querySelectorAll('section[id]');
  var navLinkEls = document.querySelectorAll('.navbar__link');

  if (sections.length && navLinkEls.length) {
    window.addEventListener('scroll', function () {
      var scrollPos = window.scrollY + 100;
      sections.forEach(function (section) {
        if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
          var id = section.getAttribute('id');
          navLinkEls.forEach(function (link) {
            link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { passive: true });
  }
})();
