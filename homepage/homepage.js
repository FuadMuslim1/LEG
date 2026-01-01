/**
 * Learning English Geuwat - Main Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initTypingEffect();
  initModalLogic();
  initScrollLogic();
  initNavigationEffects();
});

// --- Typing Effect ---
function initTypingEffect() {
  const text = "Belajar Cepat Santuy, Cas Cis Cus, Langsung Praktek!";
  const typingElement = document.getElementById("typing");
  if (!typingElement) return;

  let index = 0;
  function typeWriter() {
    if (index < text.length) {
      typingElement.textContent += text.charAt(index);
      index++;
      setTimeout(typeWriter, 80);
    }
  }
  typeWriter();
}

// --- Modal Logic ---
function initModalLogic() {
  const openModal = (id) => {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
    }
  };

  const closeModal = (modal) => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  };

  // Trigger buttons
  document.querySelectorAll('[data-modal]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(trigger.dataset.modal);
    });
  });

  // Close buttons
  document.querySelectorAll('.modal .close').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.closest('.modal')));
  });

  // Global listeners
  window.addEventListener('click', e => {
    if (e.target.classList.contains('modal')) closeModal(e.target);
  });

  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal.active').forEach(closeModal);
    }
  });
}

// --- Scroll Logic ---
function initScrollLogic() {
  const scrollBtn = document.getElementById('scrollTopBtn');
  if (!scrollBtn) return;

  window.addEventListener('scroll', () => {
    scrollBtn.classList.toggle('visible', window.scrollY > 300);
  });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// --- Navigation & Neon Effects ---
function initNavigationEffects() {
  const triggerNeon = (selector) => {
    const element = document.querySelector(selector);
    if (!element) return;

    element.classList.remove('neon');
    void element.offsetWidth; // trigger reflow
    element.classList.add('neon');
  };

  const navItems = document.querySelectorAll('.nav-menu a, .nav-menu .nav-btn');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const targetIdAttr = item.getAttribute('href');
      const targetDataAttr = item.dataset.target;
      const targetId = targetDataAttr ? `#${targetDataAttr}` : targetIdAttr;

      if (!targetId || targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Trigger neon effect
        if (targetId === '#hero-title') {
          triggerNeon('#hero-title');
        } else {
          triggerNeon(`${targetId} h2`);
        }
      }
    });
  });
}
