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

const applyTheme = (isDark) => {
  document.body.classList.toggle('dark-mode', isDark);
  const themeButtons = document.querySelectorAll('#theme-toggle, #settings-theme-toggle');
  themeButtons.forEach((button) => {
    if (button.id === 'theme-toggle') {
      button.textContent = isDark ? '☀️' : '🌙';
    }
    if (button.id === 'settings-theme-toggle') {
      button.checked = isDark;
    }
  });

  const settingsStatus = document.getElementById('settings-status');
  if (settingsStatus) {
    settingsStatus.textContent = isDark ? 'Theme is currently set to dark mode.' : 'Theme is currently set to light mode.';
  }

  localStorage.setItem('glitch-theme', isDark ? 'dark' : 'light');
};

const initialTheme = localStorage.getItem('glitch-theme') === 'dark';
applyTheme(initialTheme);

const themeToggle = document.getElementById('theme-toggle');
themeToggle?.addEventListener('click', () => {
  const nextMode = !document.body.classList.contains('dark-mode');
  applyTheme(nextMode);
});

const settingsThemeToggle = document.getElementById('settings-theme-toggle');
settingsThemeToggle?.addEventListener('change', (event) => {
  applyTheme(event.target.checked);
});

const settingsReset = document.getElementById('settings-reset');
settingsReset?.addEventListener('click', () => applyTheme(false));

const assistantLaunch = document.getElementById('assistant-launch');
const assistantModal = document.getElementById('assistant-modal');
const assistantClose = document.getElementById('assistant-close');
const assistantForm = document.getElementById('assistant-form');
const assistantInput = document.getElementById('assistant-input');
const assistantMessages = document.getElementById('assistant-messages');

const assistantReplies = {
  join: 'You can join GLITCH by visiting the Join page and submitting your interest through the form there.',
  program: 'GLITCH offers coding, AI, robotics, hardware, and leadership pathways. Visit the Programs page to browse them.',
  mission: 'GLITCH aims to empower girls with access, mentorship, and confidence in technology and innovation.',
  help: 'You can use the navigation links to explore About, Mission, Programs, Impact, and Join pages for more information.'
};

const addAssistantMessage = (text, type = 'bot') => {
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${type}`;
  bubble.textContent = text;
  assistantMessages?.appendChild(bubble);
  assistantMessages?.scrollTo({ top: assistantMessages.scrollHeight, behavior: 'smooth' });
};

const getAssistantSettings = () => {
  const raw = localStorage.getItem('glitch-assistant-settings');
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const fallbackAssistantAnswer = (question) => {
  let answer = assistantReplies.help;
  if (question.includes('join')) answer = assistantReplies.join;
  if (question.includes('program') || question.includes('opportunity') || question.includes('pathway')) answer = assistantReplies.program;
  if (question.includes('mission') || question.includes('goal') || question.includes('why')) answer = assistantReplies.mission;
  return answer;
};

const saveApiSettings = async () => {
  const apiKey = document.getElementById('chat-api-key')?.value.trim();
  const model = document.getElementById('chat-model')?.value.trim();
  const endpoint = document.getElementById('chat-endpoint')?.value.trim();
  const status = document.getElementById('api-settings-message');

  if (!apiKey || !model || !endpoint) {
    status.textContent = 'Please complete all AI settings fields before saving.';
    return;
  }

  localStorage.setItem(
    'glitch-assistant-settings',
    JSON.stringify({ apiKey, model, endpoint })
  );

  status.textContent = 'AI settings saved. The assistant will use your configured API model.';
};

const askAssistant = async (question) => {
  const settings = getAssistantSettings();

  if (!settings?.apiKey || !settings?.model || !settings?.endpoint) {
    return fallbackAssistantAnswer(question);
  }

  try {
    const response = await fetch(settings.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${settings.apiKey}`
      },
      body: JSON.stringify({
        model: settings.model,
        messages: [
          {
            role: 'system',
            content: 'You are a friendly assistant for the GLITCH website. Answer concisely and help visitors understand the site, programs, and how to join.'
          },
          {
            role: 'user',
            content: question
          }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return data?.choices?.[0]?.message?.content?.trim() || fallbackAssistantAnswer(question);
  } catch {
    return fallbackAssistantAnswer(question);
  }
};

assistantLaunch?.addEventListener('click', () => {
  assistantModal?.classList.toggle('open');
  assistantInput?.focus();
});

assistantClose?.addEventListener('click', () => {
  assistantModal?.classList.remove('open');
});

assistantForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const question = assistantInput.value.trim();
  if (!question) return;

  addAssistantMessage(question, 'user');
  assistantInput.value = '';

  const statusBubble = document.createElement('div');
  statusBubble.className = 'chat-bubble bot';
  statusBubble.textContent = 'Thinking...';
  assistantMessages?.appendChild(statusBubble);

  const answer = await askAssistant(question.toLowerCase());
  assistantMessages?.removeChild(statusBubble);
  addAssistantMessage(answer);
});

const saveApiButton = document.getElementById('save-api-settings');
saveApiButton?.addEventListener('click', saveApiSettings);

const storedSettings = getAssistantSettings();
if (storedSettings) {
  const keyField = document.getElementById('chat-api-key');
  const modelField = document.getElementById('chat-model');
  const endpointField = document.getElementById('chat-endpoint');

  keyField.value = storedSettings.apiKey || '';
  modelField.value = storedSettings.model || '';
  endpointField.value = storedSettings.endpoint || '';
}

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

const contactForm = document.getElementById('contact-form');
const contactSuccess = document.getElementById('contact-success');
const contactFormMessage = document.getElementById('contact-form-message');

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = contactForm.querySelector('#contact-name')?.value.trim();
  const email = contactForm.querySelector('#contact-email')?.value.trim();
  const subject = contactForm.querySelector('#contact-subject')?.value.trim();
  const message = contactForm.querySelector('#contact-message')?.value.trim();

  if (!name || !email || !subject || !message || !email.includes('@')) {
    if (contactFormMessage) {
      contactFormMessage.textContent = 'Please complete your name, email, subject, and message so we can respond properly.';
    }
    return;
  }

  if (contactSuccess) {
    contactSuccess.classList.add('visible');
    contactSuccess.textContent = `Thanks, ${name}! Your message has been sent to GLITCH.`;
  }

  if (contactFormMessage) {
    contactFormMessage.textContent = '';
  }

  contactForm.reset();
});

/* =========================================================
   GLITCH — FUZZY CURSOR AURA
   ========================================================= */

function setupFuzzyCursor() {
  if (window.matchMedia("(pointer: coarse)").matches) {
    return;
  }

  const aura = document.createElement("div");

  aura.className = "fuzzy-cursor";

  document.body.appendChild(aura);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  let currentX = mouseX;
  let currentY = mouseY;

  document.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
  });

  function animate() {
    currentX += (mouseX - currentX) * 0.12;
    currentY += (mouseY - currentY) * 0.12;

    aura.style.left = `${currentX}px`;
    aura.style.top = `${currentY}px`;

    requestAnimationFrame(animate);
  }

  animate();

  const interactiveElements = document.querySelectorAll(
    "a, button, input, textarea, select, .card, .pathway-card, .resource-card, .leader"
  );

  interactiveElements.forEach((element) => {
    element.addEventListener("mouseenter", () => {
      aura.classList.add("is-hovering");
    });

    element.addEventListener("mouseleave", () => {
      aura.classList.remove("is-hovering");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupFuzzyCursor();
});

/* =========================================================
   GLITCH — PAGE CODE MORPH
   ========================================================= */

function randomSymbol() {
  const characters =
    "01{}[]<>/\\|*$#@%+=-_~^!?ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  return characters[
    Math.floor(Math.random() * characters.length)
  ];
}

function createGlitchString(length) {
  let result = "";

  for (let i = 0; i < length; i++) {
    result += randomSymbol();
  }

  return result;
}

function morphPageTitle() {
  const title = document.querySelector(".code-title");

  if (!title) return;

  const textElement = title.querySelector(".code-title-text");
  const finalText = title.dataset.final;

  if (!textElement || !finalText) return;

  let frame = 0;

  const totalFrames = 18;

  textElement.classList.add("morphing");

  const interval = setInterval(() => {
    const progress = frame / totalFrames;

    let output = "";

    for (let i = 0; i < finalText.length; i++) {
      if (progress > i / finalText.length) {
        output += finalText[i];
      } else {
        output += randomSymbol();
      }
    }

    textElement.textContent = output;

    frame++;

    if (frame > totalFrames) {
      clearInterval(interval);

      textElement.textContent = finalText;

      textElement.classList.remove("morphing");
      textElement.classList.add("resolved");

      setTimeout(() => {
        textElement.classList.remove("resolved");
      }, 700);
    }
  }, 55);
}

document.addEventListener("DOMContentLoaded", () => {
  morphPageTitle();
});

/* =========================================================
   GLITCH — ONE-TIME HERO SCROLL
   ========================================================= */

function setupGlitchIntro() {
  const intro = document.querySelector(".glitch-intro");

  if (!intro) return;

  const words = [...intro.querySelectorAll(".glitch-word")];

  if (!words.length) return;

  let currentIndex = 0;

  function updateIntro() {
    const rect = intro.getBoundingClientRect();

    const totalScroll =
      intro.offsetHeight - window.innerHeight;

    const progress =
      Math.max(
        0,
        Math.min(
          1,
          -rect.top / totalScroll
        )
      );

    const index = Math.min(
      words.length - 1,
      Math.floor(progress * words.length)
    );

    if (index !== currentIndex) {
      currentIndex = index;

      words.forEach((word, i) => {
        word.classList.toggle(
          "active",
          i === currentIndex
        );
      });
    }
  }

  window.addEventListener(
    "scroll",
    updateIntro,
    { passive: true }
  );

  updateIntro();
}

document.addEventListener(
  "DOMContentLoaded",
  setupGlitchIntro
);