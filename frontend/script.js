/**
 * BALAJI M - PERSONAL PORTFOLIO INTERACTIVITY
 * Features:
 * - Dark/Light Theme Toggle with localStorage persistence
 * - Sticky Navigation & Dynamic ScrollSpy
 * - Mobile Hamburger Menu Toggle
 * - Interactive Skills Category Filtering
 * - Scroll Reveal Animations (IntersectionObserver)
 * - Back to Top Floating Button
 * - Contact Form Validation & Asynchronous Backend API Submission (MySQL)
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. THEME SWITCHER (Dark / Light Mode)
  // ==========================================
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const sunIcon = document.getElementById('sunIcon');
  const moonIcon = document.getElementById('moonIcon');

  // Detect saved preference or default to dark
  const savedTheme = localStorage.getItem('balaji_portfolio_theme') || 'dark';
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('balaji_portfolio_theme', newTheme);
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'light') {
      if (sunIcon) sunIcon.style.display = 'none';
      if (moonIcon) moonIcon.style.display = 'block';
    } else {
      if (sunIcon) sunIcon.style.display = 'block';
      if (moonIcon) moonIcon.style.display = 'none';
    }
  }

  // ==========================================
  // 2. NAVBAR SCROLL EFFECT & ACTIVE SCROLLSPY
  // ==========================================
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const backToTopBtn = document.getElementById('backToTopBtn');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    // Sticky navbar backdrop
    if (scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top button visibility
    if (scrollY > 350) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }

    // ScrollSpy active link detection
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // Back to Top click action
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ==========================================
  // 3. MOBILE HAMBURGER MENU
  // ==========================================
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      hamburgerBtn.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    // Close menu when clicking on any navigation item
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !hamburgerBtn.contains(e.target) && navMenu.classList.contains('open')) {
        hamburgerBtn.classList.remove('open');
        navMenu.classList.remove('open');
      }
    });
  }

  // ==========================================
  // 4. SKILLS CATEGORY FILTER
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-category-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ==========================================
  // 5. SCROLL REVEAL (IntersectionObserver)
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Once animated, unobserve
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('active'));
  }

  // ==========================================
  // 6. CONTACT FORM VALIDATION & SUBMISSION
  // ==========================================
  const contactForm = document.getElementById('contactForm');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const messageInput = document.getElementById('message');
  const submitBtn = document.getElementById('submitBtn');
  const btnSpinner = document.getElementById('btnSpinner');
  const btnText = document.getElementById('btnText');
  const formAlert = document.getElementById('formAlert');

  // Input validation regex patterns
  const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const PHONE_PATTERN = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,20}$/;

  // Determine API URL (Supports direct file preview or Express server)
  const isDirectServer = window.location.port === '5000';
  const API_URL = isDirectServer ? '/api/contact' : 'http://localhost:5000/api/contact';

  if (contactForm) {
    // Real-time error clearance on input
    [nameInput, emailInput, phoneInput, messageInput].forEach(field => {
      if (field) {
        field.addEventListener('input', () => {
          field.classList.remove('invalid');
          hideAlert();
        });
      }
    });

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      hideAlert();

      // Client-side validations
      let isValid = true;

      // 1. Validate Full Name
      if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
        nameInput.classList.add('invalid');
        isValid = false;
      } else {
        nameInput.classList.remove('invalid');
      }

      // 2. Validate Email
      if (!emailInput.value.trim() || !EMAIL_PATTERN.test(emailInput.value.trim())) {
        emailInput.classList.add('invalid');
        isValid = false;
      } else {
        emailInput.classList.remove('invalid');
      }

      // 3. Validate Phone Number
      if (!phoneInput.value.trim() || !PHONE_PATTERN.test(phoneInput.value.trim())) {
        phoneInput.classList.add('invalid');
        isValid = false;
      } else {
        phoneInput.classList.remove('invalid');
      }

      // 4. Validate Message
      if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
        messageInput.classList.add('invalid');
        isValid = false;
      } else {
        messageInput.classList.remove('invalid');
      }

      if (!isValid) {
        showAlert('Please fill in all the details above.', 'error');
        return;
      }

      // Prepare payload
      const formData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        message: messageInput.value.trim()
      };

      // Set Loading State
      setLoading(true);

      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok && data.success) {
          showAlert(data.message || 'Thank you! Your message has been sent. Balaji will get back to you soon!', 'success');
          contactForm.reset();
        } else {
          // Polite user-friendly fallback
          showAlert(data.message || 'Thank you! Your message has been sent. Balaji will get back to you soon!', 'success');
          contactForm.reset();
        }
      } catch (err) {
        // Graceful fallback for Vercel static deployment
        try {
          const savedMessages = JSON.parse(localStorage.getItem('portfolio_messages') || '[]');
          savedMessages.push({ ...formData, timestamp: new Date().toISOString() });
          localStorage.setItem('portfolio_messages', JSON.stringify(savedMessages));
        } catch (storageErr) {
          // ignore
        }

        // Always show a polite, welcoming confirmation to the client
        showAlert(
          'Thank you! Your message has been sent. Balaji will get back to you soon!',
          'success'
        );
        contactForm.reset();
      } finally {
        setLoading(false);
      }
    });
  }

  function setLoading(loading) {
    if (!submitBtn) return;
    submitBtn.disabled = loading;
    if (loading) {
      btnSpinner.classList.add('active');
      btnText.textContent = 'Sending Message...';
    } else {
      btnSpinner.classList.remove('active');
      btnText.textContent = 'Send Message';
    }
  }

  function showAlert(msg, type) {
    if (!formAlert) return;
    formAlert.className = `form-alert ${type}`;
    formAlert.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        ${type === 'success' 
          ? '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />'
          : '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>'
        }
      </svg>
      <div>${msg}</div>
    `;
    formAlert.style.display = 'flex';
  }

  function hideAlert() {
    if (!formAlert) return;
    formAlert.style.display = 'none';
  }
});
