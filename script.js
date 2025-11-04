// Theme Management
(function() {
  function getTheme() {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }

  function setTheme(theme) {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
    updateThemeButton(theme);
  }

  function updateThemeButton(theme) {
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.textContent = theme === 'dark' ? 'Light' : 'Dark';
    }
  }

  // Initialize theme
  const initialTheme = getTheme();
  setTheme(initialTheme);

  // Theme toggle button
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = getTheme();
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    });
  }
})();

// Mobile Menu
(function() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  let isOpen = false;

  function toggleMenu() {
    isOpen = !isOpen;
    if (mobileMenu) {
      mobileMenu.style.display = isOpen ? 'block' : 'none';
    }
    if (mobileMenuBtn) {
      mobileMenuBtn.setAttribute('aria-expanded', isOpen.toString());
    }
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMenu);
  }

  // Close menu on hash change (navigation)
  window.addEventListener('hashchange', () => {
    if (isOpen) {
      toggleMenu();
    }
  });

  // Close menu when clicking on a link
  const mobileLinks = mobileMenu?.querySelectorAll('a');
  if (mobileLinks) {
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (isOpen) {
          toggleMenu();
        }
      });
    });
  }
})();

// Contact Form
(function() {
  const form = document.getElementById('contact-form');
  const errorDiv = document.getElementById('form-error');
  const successDiv = document.getElementById('form-success');
  const failDiv = document.getElementById('form-fail');
  const submitBtn = document.getElementById('submit-btn');

  function hideAllMessages() {
    if (errorDiv) errorDiv.style.display = 'none';
    if (successDiv) successDiv.style.display = 'none';
    if (failDiv) failDiv.style.display = 'none';
  }

  function showError(message) {
    hideAllMessages();
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.style.display = 'block';
    }
  }

  function showSuccess() {
    hideAllMessages();
    if (successDiv) {
      successDiv.style.display = 'block';
    }
  }

  function showFail() {
    hideAllMessages();
    if (failDiv) {
      failDiv.style.display = 'block';
    }
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideAllMessages();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      // Validation
      if (!name || !email || !message) {
        showError('Please fill out all fields.');
        return;
      }

      if (!validateEmail(email)) {
        showError('Please enter a valid email address.');
        return;
      }

      // Disable submit button
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

      try {
        // Try to send via Netlify function if available, otherwise fallback to mailto
        const response = await fetch('/.netlify/functions/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, message }),
        });

        if (response.ok) {
          showSuccess();
          form.reset();
        } else {
          throw new Error('Failed to send');
        }
      } catch (err) {
        console.warn('Form submission error:', err);
        showFail();
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
        }
      }
    });
  }
})();

// Set current year in footer
(function() {
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
})();

// Smooth scrolling for anchor links
(function() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offsetTop = target.offsetTop - 64; // Account for fixed navbar
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
})();
