const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});

const revealEls = document.querySelectorAll('.reveal');
if (!prefersReducedMotion) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.18 }
  );

  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('visible'));
}

const header = document.querySelector('.site-header');
const scrollProgress = document.getElementById('scroll-progress');
const backToTop = document.getElementById('back-to-top');

const updateScrollUI = () => {
  const scrollTop = window.scrollY || window.pageYOffset;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

  if (scrollProgress) {
    scrollProgress.style.width = `${progress}%`;
  }

  if (header) {
    header.classList.toggle('shrink', scrollTop > 50);
  }

  if (backToTop) {
    backToTop.classList.toggle('visible', scrollTop > 420);
  }
};

window.addEventListener('scroll', updateScrollUI);
updateScrollUI();

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
});

const typingWords = ['Learn.', 'Build.', 'Lead.', 'Innovate.'];
const typingText = document.getElementById('typing-text');
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeLoop() {
  const currentWord = typingWords[wordIndex];

  if (!isDeleting) {
    charIndex++;
    typingText.textContent = currentWord.slice(0, charIndex);
    if (charIndex === currentWord.length) {
      isDeleting = true;
      setTimeout(typeLoop, 1200);
      return;
    }
  } else {
    charIndex--;
    typingText.textContent = currentWord.slice(0, charIndex);
    if (charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % typingWords.length;
    }
  }

  setTimeout(typeLoop, isDeleting ? 50 : 110);
}

if (typingText) {
  typeLoop();
}

const countEls = document.querySelectorAll('.count');
const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const target = Number(el.dataset.target || 0);
      const duration = 1300;
      const start = performance.now();

      const animate = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const value = Math.floor(progress * target);
        el.textContent = value.toLocaleString();
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          el.textContent = target.toLocaleString();
        }
      };

      requestAnimationFrame(animate);
      countObserver.unobserve(el);
    });
  },
  { threshold: 0.4 }
);

countEls.forEach((el) => countObserver.observe(el));

const pathwayCards = document.querySelectorAll('.pathway-card');
pathwayCards.forEach((card) => {
  card.addEventListener('click', () => {
    const wasOpen = card.classList.contains('is-open');
    pathwayCards.forEach((item) => item.classList.remove('is-open'));
    if (!wasOpen) card.classList.add('is-open');
  });
});

const filterButtons = document.querySelectorAll('.filter-btn');
const resourceCards = document.querySelectorAll('.resource-card');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');

    const filter = button.dataset.filter;
    resourceCards.forEach((card) => {
      const matches = filter === 'all' || card.dataset.level === filter || card.dataset.topic === filter || card.dataset.age === filter;
      card.classList.toggle('hidden', !matches);
    });
  });
});

const carouselCards = document.querySelectorAll('.testimonial-card');
let testimonialIndex = 0;

function updateCarousel() {
  carouselCards.forEach((card, index) => {
    card.classList.toggle('active', index === testimonialIndex);
  });
}

const prevButton = document.querySelector('.carousel-btn.prev');
const nextButton = document.querySelector('.carousel-btn.next');

prevButton?.addEventListener('click', () => {
  testimonialIndex = testimonialIndex === 0 ? carouselCards.length - 1 : testimonialIndex - 1;
  updateCarousel();
});

nextButton?.addEventListener('click', () => {
  testimonialIndex = (testimonialIndex + 1) % carouselCards.length;
  updateCarousel();
});

setInterval(() => {
  testimonialIndex = (testimonialIndex + 1) % carouselCards.length;
  updateCarousel();
}, 5000);

const themeToggle = document.getElementById('theme-toggle');
themeToggle?.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
});

const newsletterForm = document.getElementById('newsletter-form');
const formMessage = document.getElementById('form-message');

newsletterForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const emailField = newsletterForm.querySelector('#email');
  const email = emailField.value.trim();

  if (!email || !email.includes('@')) {
    if (formMessage) {
      formMessage.textContent = 'Please enter a valid email address.';
    }
    emailField?.focus();
    return;
  }

  if (formMessage) {
    formMessage.textContent = 'Thanks for joining the GLITCH newsletter!';
  }
  newsletterForm.reset();
});

const joinForm = document.getElementById('join-form');
const joinSuccess = document.getElementById('join-success');
const joinFormMessage = document.getElementById('join-form-message');

joinForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = joinForm.querySelector('#name')?.value.trim();
  const email = joinForm.querySelector('#email')?.value.trim();
  const role = joinForm.querySelector('#role')?.value.trim();

  if (!name || !email || !role || !email.includes('@')) {
    if (joinFormMessage) {
      joinFormMessage.textContent = 'Please complete your name, email, and interest so we can help you get started.';
    }
    return;
  }

  if (joinSuccess) {
    joinSuccess.classList.add('visible');
    joinSuccess.textContent = `Thanks, ${name}! Your interest in joining GLITCH has been received.`;
  }

  if (joinFormMessage) {
    joinFormMessage.textContent = '';
  }

  joinForm.reset();
});
