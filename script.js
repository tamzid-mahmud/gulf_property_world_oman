document.addEventListener('DOMContentLoaded', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    const dismiss = () => preloader.classList.add('done');
    window.addEventListener('load', () => setTimeout(dismiss, 1400));
    setTimeout(dismiss, 2800);
  }

  const navbar = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });

  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navItems = document.querySelectorAll('.nav-item');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('open');
      document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });
  }

  navItems.forEach(item => {
    const link = item.querySelector('.nav-link');
    const dropdown = item.querySelector('.dropdown');

    if (dropdown && window.innerWidth <= 768) {
      link.classList.add('has-dropdown');
      link.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.dropdown.open').forEach(d => {
          if (d !== dropdown) {
            d.classList.remove('open');
            d.previousElementSibling.classList.remove('open');
          }
        });
        dropdown.classList.toggle('open');
        link.classList.toggle('open');
      });
    }
  });

  if (navMenu) {
    navMenu.querySelectorAll('a:not(.has-dropdown)').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal-up, .reveal-fade, .reveal-scale').forEach(el => {
    observer.observe(el);
  });

  document.querySelectorAll('.card, .testi-card, .gallery-item').forEach((el, i) => {
    if (!el.classList.contains('reveal-up') && !el.classList.contains('reveal-fade')) {
      el.classList.add('reveal-up');
      el.style.transitionDelay = `${(i % 3) * 0.1}s`;
      observer.observe(el);
    }
  });

  const form = document.getElementById('contactForm');
  if (form) {
    const get = (id) => document.getElementById(id);
    const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    const showErr = (el, msg) => { if (el) el.textContent = msg; };
    const clearErr = (el) => { if (el) el.textContent = ''; };

    ['f-name', 'f-email', 'f-phone', 'f-msg'].forEach(id => {
      const el = get(id);
      if (!el) return;
      el.addEventListener('blur', () => {
        if (id === 'f-name' && el.value.trim().length < 2) {
          showErr(get('nameErr'), 'Please enter your full name');
        } else if (id === 'f-email' && !isEmail(el.value.trim())) {
          showErr(get('emailErr'), 'Please enter a valid email');
        } else if (id === 'f-phone' && el.value.trim().length < 7) {
          showErr(get('phoneErr'), 'Please enter a valid phone');
        } else if (id === 'f-msg' && el.value.trim().length < 10) {
          showErr(get('msgErr'), 'Please tell us more (min 10 chars)');
        } else {
          if (id === 'f-name') clearErr(get('nameErr'));
          if (id === 'f-email') clearErr(get('emailErr'));
          if (id === 'f-phone') clearErr(get('phoneErr'));
          if (id === 'f-msg') clearErr(get('msgErr'));
        }
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = true;

      const name = get('f-name')?.value.trim() || '';
      const email = get('f-email')?.value.trim() || '';
      const phone = get('f-phone')?.value.trim() || '';
      const msg = get('f-msg')?.value.trim() || '';

      if (name.length < 2) { showErr(get('nameErr'), 'Please enter your full name'); ok = false; }
      else clearErr(get('nameErr'));

      if (!isEmail(email)) { showErr(get('emailErr'), 'Please enter a valid email'); ok = false; }
      else clearErr(get('emailErr'));

      if (phone.length < 7) { showErr(get('phoneErr'), 'Please enter a valid phone'); ok = false; }
      else clearErr(get('phoneErr'));

      if (msg.length < 10) { showErr(get('msgErr'), 'Please tell us more'); ok = false; }
      else clearErr(get('msgErr'));

      if (!ok) return;

      const btn = get('submitBtn');
      if (get('btnTxt')) get('btnTxt').style.display = 'none';
      if (get('btnLoad')) get('btnLoad').style.display = 'inline';
      if (btn) btn.disabled = true;

      setTimeout(() => {
        form.style.display = 'none';
        const s = get('formSuccess');
        if (s) {
          s.style.display = 'block';
          s.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 1000);
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  const statusEl = document.getElementById('openStatus');
  if (statusEl) {
    const now = new Date();
    const h = now.getHours() + now.getMinutes() / 60;
    if (h >= 9 && h < 20) {
      statusEl.innerHTML = '<div class="status-badge"><div class="status-dot"></div>Open Now — Closes 8 PM</div>';
    } else if (h < 9) {
      statusEl.innerHTML = '<div class="status-badge"><div class="status-dot"></div>Opens today at 9 AM</div>';
    } else {
      statusEl.innerHTML = '<div class="status-badge"><div class="status-dot"></div>Closed — Opens tomorrow 9 AM</div>';
    }
  }

  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      heroBg.style.transform = `translateY(${window.scrollY * 0.2}px)`;
    }, { passive: true });
  }
});
