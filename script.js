/* ==========================================================================
   INITIALIZATION & MAIN LOGIC
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Theme Management
  initTheme();

  // Navigation Scrolling & Active Links
  initNav();

  // Text Typing Animation
  initTypingEffect();

  // Scroll Reveal Animations & Stats Counters
  initScrollAnimations();

  // Project Category Filters
  initProjectFilters();

  // Certificate Lightbox
  initCertificateLightbox();

  // Contact Form Handling
  initContactForm();

  // Back to Top functionality
  initBackToTop();
});

/* ==========================================================================
   THEME MANAGER (DARK / LIGHT)
   ========================================================================== */
function initTheme() {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const htmlElement = document.documentElement;

  // Retrieve saved preference or default to system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme) {
    htmlElement.setAttribute('data-theme', savedTheme);
  } else {
    const defaultTheme = systemPrefersDark ? 'dark' : 'light';
    htmlElement.setAttribute('data-theme', defaultTheme);
    localStorage.setItem('theme', defaultTheme);
  }

  // Event Listener for all theme toggle buttons (header and mobile drawer)
  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      htmlElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  });
}

/* ==========================================================================
   NAVIGATION & MOBILE DRAWER MENU
   ========================================================================== */
function initNav() {
  const header = document.getElementById('main-header');
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const menuIconOpen = document.getElementById('menu-icon-open');
  const menuIconClose = document.getElementById('menu-icon-close');
  const desktopLinks = document.querySelectorAll('.nav-link:not(.nav-btn)');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const sections = document.querySelectorAll('section');

  // Sticky Header on Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile Menu Toggle
  const toggleMobileMenu = () => {
    const isOpen = mobileNav.classList.contains('open');
    if (isOpen) {
      mobileNav.classList.remove('open');
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
      mobileNav.setAttribute('aria-hidden', 'true');
      menuIconOpen.classList.remove('hidden');
      menuIconClose.classList.add('hidden');
      document.body.style.overflow = '';
    } else {
      mobileNav.classList.add('open');
      mobileMenuToggle.setAttribute('aria-expanded', 'true');
      mobileNav.setAttribute('aria-hidden', 'false');
      menuIconOpen.classList.add('hidden');
      menuIconClose.classList.remove('hidden');
      document.body.style.overflow = 'hidden'; // Prevent scroll while menu is open
    }
  };

  mobileMenuToggle.addEventListener('click', toggleMobileMenu);

  // Close Mobile Menu on Link Click
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileNav.classList.contains('open')) {
        toggleMobileMenu();
      }
    });
  });

  // Active Link Observer
  const activeLinkObserverOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px', // Trigger when section is in the middle of the viewport
    threshold: 0
  };

  const activeLinkObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        // Update Desktop Links
        desktopLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, activeLinkObserverOptions);

  sections.forEach(section => {
    activeLinkObserver.observe(section);
  });
}

/* ==========================================================================
   TYPING TEXT ANIMATION
   ========================================================================== */
function initTypingEffect() {
  const typingTextEl = document.getElementById('typing-text');
  if (!typingTextEl) return;

  const roles = [
    'Full Stack Developer',
    'Web Developer',
    'UI Designer',
    'Problem Solver'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let delay = 120; // typing speed

  function type() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
      typingTextEl.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      delay = 60; // deletion speed
    } else {
      typingTextEl.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      delay = 120; // typing speed
    }

    // Word completed typing
    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      delay = 2000; // Pause at full word
    } 
    // Word fully deleted
    else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 500; // Pause before typing next word
    }

    setTimeout(type, delay);
  }

  // Start the typing loop
  setTimeout(type, 1000);
}

/* ==========================================================================
   SCROLL REVEAL & METRIC ANIMATIONS
   ========================================================================== */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right');
  const statNumbers = document.querySelectorAll('.stat-number');
  const skillProgressBars = document.querySelectorAll('.skill-progress');

  // Options for Intersection Observers
  const revealOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  // General Reveal Observer
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Animates only once
      }
    });
  }, revealOptions);

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // Animated Numbers Counter Observer
  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const targetVal = parseInt(target.getAttribute('data-target'), 10);
        animateCounter(target, targetVal);
        observer.unobserve(target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(num => {
    statsObserver.observe(num);
  });

  // Skill Bar Animation Observer
  const skillsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progressBars = entry.target.querySelectorAll('.skill-progress');
        progressBars.forEach(bar => {
          const targetWidth = bar.getAttribute('data-width');
          bar.style.width = targetWidth;
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    skillsObserver.observe(skillsSection);
  }
}

// Stats Counter Helper Function
function animateCounter(element, targetValue) {
  let currentValue = 0;
  const duration = 2000; // Duration in milliseconds
  const steps = 60;
  const stepTime = duration / steps;
  const increment = targetValue / steps;

  const timer = setInterval(() => {
    currentValue += increment;
    if (currentValue >= targetValue) {
      clearInterval(timer);
      element.textContent = formatStatValue(targetValue, element);
    } else {
      element.textContent = formatStatValue(Math.floor(currentValue), element);
    }
  }, stepTime);
}

function formatStatValue(val, element) {
  const id = element.closest('.stat-card').getAttribute('id');
  if (id === 'stat-card-1') return (val / 100).toFixed(2); // CGPA
  return val + '+';
}

/* ==========================================================================
   PROJECT FILTERING SYSTEM
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Update active state of buttons
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        // Simple scaling animation while filtering
        card.style.transform = 'scale(0.95)';
        card.style.opacity = '0';

        setTimeout(() => {
          const cardCategory = card.getAttribute('data-category');
          
          if (filterValue === 'all' || cardCategory === filterValue) {
            card.style.display = 'block';
            setTimeout(() => {
              card.style.transform = 'scale(1)';
              card.style.opacity = '1';
            }, 50);
          } else {
            card.style.display = 'none';
          }
        }, 300);
      });
    });
  });
}

/* ==========================================================================
   CERTIFICATE LIGHTBOX MODAL
   ========================================================================== */
function initCertificateLightbox() {
  const zoomBtns = document.querySelectorAll('.cert-zoom-btn');
  const lightbox = document.getElementById('cert-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close-btn');

  if (!lightbox) return;

  const openLightbox = (imgSrc, title) => {
    lightboxImg.src = imgSrc;
    lightboxImg.alt = title;
    lightboxCaption.textContent = title;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // Clear sources after animation completes
    setTimeout(() => {
      lightboxImg.src = '';
      lightboxCaption.textContent = '';
    }, 400);
  };

  zoomBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const src = btn.getAttribute('data-src');
      const title = btn.getAttribute('data-title');
      if (src) {
        e.preventDefault();
        openLightbox(src, title);
      }
    });
  });

  closeBtn.addEventListener('click', closeLightbox);

  // Close on clicking backdrop/outside image
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
      closeLightbox();
    }
  });

  // Close on ESC key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });
}

/* ==========================================================================
   CONTACT FORM HANDLING (VALIDATION & SIMULATION)
   ========================================================================== */
function initContactForm() {
  // To receive emails, create a free form at https://formspree.io/ and enter your Form ID here:
  const FORMSPREE_FORM_ID = 'mkoepkpp'; 

  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');
  const submitBtn = document.getElementById('form-submit-btn');
  const feedbackBox = document.getElementById('form-feedback');
  const feedbackMessage = document.getElementById('feedback-message');
  const feedbackIcon = document.getElementById('feedback-icon');

  // Input listeners to clear errors on typing
  const inputs = [nameInput, emailInput, subjectInput, messageInput];
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      input.closest('.form-group').classList.remove('invalid');
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim()) {
      nameInput.closest('.form-group').classList.add('invalid');
      isValid = false;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value)) {
      emailInput.closest('.form-group').classList.add('invalid');
      isValid = false;
    }

    // Validate Subject
    if (!subjectInput.value.trim()) {
      subjectInput.closest('.form-group').classList.add('invalid');
      isValid = false;
    }

    // Validate Message
    if (!messageInput.value.trim()) {
      messageInput.closest('.form-group').classList.add('invalid');
      isValid = false;
    }

    if (!isValid) return;

    // Submit Simulation (Loading visual indicator)
    submitBtn.classList.add('loading');
    const submitBtnText = submitBtn.querySelector('span');
    const submitBtnIcon = submitBtn.querySelector('.btn-icon');
    
    submitBtnText.textContent = 'Sending Message...';
    if (typeof lucide !== 'undefined') {
      submitBtnIcon.innerHTML = '<i data-lucide="loader" class="animate-spin"></i>';
      lucide.createIcons();
    }

    // Submit Form to Formspree (or simulate if no ID is configured)
    const formspreeEndpoint = `https://formspree.io/f/${FORMSPREE_FORM_ID}`;
    
    if (FORMSPREE_FORM_ID === 'YOUR_FORMSPREE_FORM_ID' || !FORMSPREE_FORM_ID) {
      // Simulation mode
      setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtnText.textContent = 'Send Message';
        submitBtnIcon.innerHTML = '<i data-lucide="send"></i>';
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }

        feedbackBox.classList.remove('hidden', 'error');
        feedbackMessage.textContent = 'Demo Mode: Message sent! (Configure FORMSPREE_FORM_ID in script.js to receive real emails at dhairy7879@gmail.com)';
        feedbackIcon.innerHTML = '<i data-lucide="check-circle-2"></i>';
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }

        form.reset();

        setTimeout(() => {
          feedbackBox.classList.add('hidden');
        }, 8000);
      }, 1500);
    } else {
      // Real submission mode
      fetch(formspreeEndpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        submitBtn.classList.remove('loading');
        submitBtnText.textContent = 'Send Message';
        submitBtnIcon.innerHTML = '<i data-lucide="send"></i>';
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }

        if (response.ok) {
          feedbackBox.classList.remove('hidden', 'error');
          feedbackMessage.textContent = 'Thank you! Your message was sent successfully.';
          feedbackIcon.innerHTML = '<i data-lucide="check-circle-2"></i>';
          if (typeof lucide !== 'undefined') {
            lucide.createIcons();
          }
          form.reset();
        } else {
          feedbackBox.classList.remove('hidden');
          feedbackBox.classList.add('error');
          feedbackMessage.textContent = 'Oops! There was a problem sending your message.';
          feedbackIcon.innerHTML = '<i data-lucide="alert-circle"></i>';
          if (typeof lucide !== 'undefined') {
            lucide.createIcons();
          }
        }

        setTimeout(() => {
          feedbackBox.classList.add('hidden');
        }, 5000);
      })
      .catch(error => {
        submitBtn.classList.remove('loading');
        submitBtnText.textContent = 'Send Message';
        submitBtnIcon.innerHTML = '<i data-lucide="send"></i>';
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }

        feedbackBox.classList.remove('hidden');
        feedbackBox.classList.add('error');
        feedbackMessage.textContent = 'Oops! There was a network error sending your message.';
        feedbackIcon.innerHTML = '<i data-lucide="alert-circle"></i>';
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }

        setTimeout(() => {
          feedbackBox.classList.add('hidden');
        }, 5000);
      });
    }
  });
}

/* ==========================================================================
   BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
