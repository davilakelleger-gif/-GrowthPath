// Navbar scroll effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  if (currentScroll > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  lastScroll = currentScroll;
});

// Mobile menu
const mobileBtn = document.getElementById('mobileMenuBtn');
let mobileMenu = document.querySelector('.mobile-menu');

if (!mobileMenu) {
  mobileMenu = document.createElement('div');
  mobileMenu.className = 'mobile-menu';
  mobileMenu.innerHTML = `
    <a href="#features" onclick="closeMobileMenu()" data-i18n="features">Features</a>
    <a href="#how-it-works" onclick="closeMobileMenu()" data-i18n="how_works">How It Works</a>
    <a href="#testimonials" onclick="closeMobileMenu()" data-i18n="testimonials">Testimonials</a>
    <a href="#download" onclick="closeMobileMenu()" data-i18n="download">Download</a>
    <a href="dashboard/" onclick="closeMobileMenu()" data-i18n="dashboard">Dashboard</a>
  `;
  document.body.appendChild(mobileMenu);
}

mobileBtn.addEventListener('click', () => {
  mobileBtn.classList.toggle('active');
  mobileMenu.classList.toggle('open');
});

function closeMobileMenu() {
  mobileBtn.classList.remove('active');
  mobileMenu.classList.remove('open');
}

// Close mobile menu on nav link click
document.querySelectorAll('.navbar-links a').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

// Intersection Observer for scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
    }
  });
}, observerOptions);

document.querySelectorAll('.card, .section-title, .section-subtitle').forEach(el => {
  el.classList.add('fade-in-section');
  observer.observe(el);
});

// Smooth anchor scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Theme toggle
const theme = localStorage.getItem('gp-theme') || 'light';
document.documentElement.setAttribute('data-theme', theme);

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}

// PWA install prompt
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  document.querySelectorAll('.install-btn').forEach(btn => btn.style.display = 'inline-flex');
});

document.addEventListener('click', e => {
  const btn = e.target.closest('.install-btn');
  if (!btn || !deferredPrompt) return;
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then(() => { deferredPrompt = null; });
});

// Animate progress bars when visible
const progressObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bar = entry.target;
      const width = bar.getAttribute('data-width');
      if (width) {
        bar.style.width = width + '%';
      }
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.progress-fill[data-width]').forEach(bar => {
  progressObserver.observe(bar);
});
