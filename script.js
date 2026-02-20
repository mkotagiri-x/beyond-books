// ==================== GOOGLE SHEETS CONFIG ====================
// PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL BELOW (see SETUP-GUIDE.txt)
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbzJQcM0cquccK6EqYCkJyKoTJ9sp-f2y-NDZNQ3Z3_8x7m1--1bjdp0XZnIDZppfj0/exec';

// Save lead to Google Sheets
async function saveToSheet(data) {
  if (!GOOGLE_SHEET_URL) {
    console.log('Google Sheet URL not configured. Lead data:', data);
    return;
  }
  try {
    await fetch(GOOGLE_SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    console.log('Lead saved to Google Sheet');
  } catch (err) {
    console.error('Sheet save error:', err);
  }
}

// ==================== NAVBAR ====================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ==================== MOBILE NAV ====================
const toggle = document.getElementById('navToggle');
const links = document.getElementById('navLinks');
toggle.addEventListener('click', () => {
  links.classList.toggle('open');
});
links.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => links.classList.remove('open'));
});

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ==================== SCROLL REVEAL ====================
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('active'), i * 60);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
reveals.forEach(el => revealObserver.observe(el));

// ==================== BACK TO TOP ====================
const btt = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  btt.classList.toggle('visible', window.scrollY > 400);
});
btt.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ==================== ACTIVE NAV LINK ====================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === '#' + current) link.style.color = 'var(--primary)';
  });
});

// ==================== COURSE FILTERS ====================
const filterBtns = document.querySelectorAll('.filter-btn');
const courseCards = document.querySelectorAll('.course-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    courseCards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.classList.remove('hidden');
        card.style.animation = 'fadeIn 0.4s ease forwards';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// Fade-in keyframe (injected)
const style = document.createElement('style');
style.textContent = '@keyframes fadeIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}';
document.head.appendChild(style);

// ==================== FAQ ACCORDION ====================
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const answer = item.querySelector('.faq-answer');
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-item').forEach(faq => {
      faq.classList.remove('open');
      faq.querySelector('.faq-answer').style.maxHeight = null;
    });

    // Open clicked
    if (!isOpen) {
      item.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

// ==================== DEMO FORM ====================
const demoForm = document.getElementById('demoForm');
if (demoForm) {
  demoForm.addEventListener('submit', async e => {
    e.preventDefault();

    const submitBtn = demoForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    // Show loading
    submitBtn.innerHTML = 'Sending...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';

    const name = document.getElementById('demoName').value.trim();
    const age = document.getElementById('demoAge').value;
    const phone = document.getElementById('demoPhone').value.trim();
    const city = document.getElementById('demoCity').value.trim();
    const course = document.getElementById('demoCourse');
    const courseLabel = course.options[course.selectedIndex].text;
    const slot = document.getElementById('demoSlot');
    const slotLabel = slot.options[slot.selectedIndex].text;
    const callback = document.getElementById('demoCallback').value;

    // Save to Google Sheets
    await saveToSheet({
      name: name,
      age: age,
      phone: phone,
      city: city,
      course: courseLabel,
      timeslot: slotLabel,
      callback: callback,
      platform: 'Google Meet'
    });

    // Open WhatsApp with pre-filled message
    const msg = `Hi! I want to book a free demo class at Beyond Books.%0A%0A` +
      `Student: ${name}%0A` +
      `Age: ${age}%0A` +
      `Phone: ${phone}%0A` +
      `City: ${city}%0A` +
      `Course: ${courseLabel}%0A` +
      `Timeslot: ${slotLabel}%0A` +
      `Callback Time: ${callback}%0A` +
      `Platform: Google Meet%0A%0A` +
      `Please share the class link. Thank you!`;

    window.open(`https://wa.me/917146745454?text=${msg}`, '_blank');

    // Show success
    submitBtn.innerHTML = '&#10003; Booked! Check WhatsApp';
    submitBtn.style.background = '#22c55e';
    submitBtn.style.opacity = '1';
    submitBtn.disabled = false;

    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.style.background = '';
      demoForm.reset();
    }, 4000);
  });
}

// ==================== COUNTER (for hero trust) ====================
// Simple counter for any future dynamic numbers
function animateValue(el, start, end, duration) {
  const range = end - start;
  const step = range / (duration / 16);
  let current = start;
  const timer = setInterval(() => {
    current += step;
    if (current >= end) {
      el.textContent = end;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current);
    }
  }, 16);
}
