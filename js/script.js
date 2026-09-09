const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const navbar = document.getElementById('navbar');
const scrollProgressBar = document.getElementById('scrollProgressBar');
const backToTop = document.getElementById('backToTop');
const toast = document.getElementById('toast');
const profileImg = document.getElementById('profileImg');
const avatarFallback = document.getElementById('avatarFallback');
const roleRotator = document.getElementById('roleRotator');

const savedTheme = localStorage.getItem('ak_portfolio_theme') || 'cyber';
document.documentElement.setAttribute('data-theme', savedTheme);

const themeBtns = document.querySelectorAll('.theme-btn');
themeBtns.forEach((btn) => {
  if (btn.getAttribute('data-theme') === savedTheme) {
    btn.classList.add('active');
  } else {
    btn.classList.remove('active');
  }

  btn.addEventListener('click', () => {
    const selected = btn.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', selected);
    localStorage.setItem('ak_portfolio_theme', selected);
    themeBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    showToast(`Theme changed to ${btn.getAttribute('title')}`);
  });
});

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (scrollProgressBar) {
    scrollProgressBar.style.width = `${progress}%`;
  }

  if (backToTop) {
    if (scrollTop > 450) {
      backToTop.classList.add('visible');
      backToTop.setAttribute('aria-hidden', 'false');
    } else {
      backToTop.classList.remove('visible');
      backToTop.setAttribute('aria-hidden', 'true');
    }
  }

  const sections = document.querySelectorAll('section[id], header[id]');
  let currentActive = '';
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 150;
    const sectionHeight = section.offsetHeight;
    if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
      currentActive = section.getAttribute('id');
    }
  });

  const links = document.querySelectorAll('.nav-link');
  links.forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentActive}`) {
      link.classList.add('active');
    }
  });
});

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  document.querySelectorAll('.nav-link, .nav-cta').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

if (profileImg && avatarFallback) {
  profileImg.addEventListener('error', () => {
    profileImg.style.display = 'none';
    avatarFallback.style.display = 'flex';
  });
}

if (roleRotator) {
  const roles = [
    'MCA (AI & ML) Scholar',
    'Frontend Developer Intern',
    'React & Full-Stack Builder',
    'Interactive 3D UI Engineer',
    'Problem Solver & Builder'
  ];
  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function typeRole() {
    const current = roles[roleIdx];
    if (isDeleting) {
      charIdx--;
      roleRotator.textContent = current.substring(0, charIdx);
    } else {
      charIdx++;
      roleRotator.textContent = current.substring(0, charIdx);
    }

    let delay = isDeleting ? 35 : 75;

    if (!isDeleting && charIdx === current.length) {
      delay = 2200;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      delay = 400;
    }

    setTimeout(typeRole, delay);
  }

  typeRole();
}

function init3DTilt() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.innerWidth < 768) return;

  const tiltElements = document.querySelectorAll('[data-tilt]:not([data-tilt-bound])');

  tiltElements.forEach((el) => {
    el.setAttribute('data-tilt-bound', '');
    if (!el.querySelector('.card-glare')) {
      const glare = document.createElement('div');
      glare.className = 'card-glare';
      glare.setAttribute('aria-hidden', 'true');
      el.appendChild(glare);
    }

    let targetRx = 0;
    let targetRy = 0;
    let currentRx = 0;
    let currentRy = 0;
    let targetGlareX = 50;
    let targetGlareY = 50;
    let currentGlareX = 50;
    let currentGlareY = 50;
    let rafId = null;
    let isHovered = false;

    function animateTilt() {
      currentRx += (targetRx - currentRx) * 0.12;
      currentRy += (targetRy - currentRy) * 0.12;
      currentGlareX += (targetGlareX - currentGlareX) * 0.12;
      currentGlareY += (targetGlareY - currentGlareY) * 0.12;

      const shadowX = (-currentRy * 1.5).toFixed(1);
      const shadowY = (currentRx * 1.5).toFixed(1);

      el.style.setProperty('--glare-x', `${currentGlareX.toFixed(1)}%`);
      el.style.setProperty('--glare-y', `${currentGlareY.toFixed(1)}%`);

      if (isHovered) {
        el.style.transform = `perspective(1000px) rotateX(${currentRx.toFixed(2)}deg) rotateY(${currentRy.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025)`;
        el.style.boxShadow = `${shadowX}px ${shadowY}px 32px var(--accent-glow)`;
        rafId = requestAnimationFrame(animateTilt);
      } else {
        el.style.transform = `perspective(1000px) rotateX(${currentRx.toFixed(2)}deg) rotateY(${currentRy.toFixed(2)}deg) scale3d(1, 1, 1)`;
        if (Math.abs(currentRx) < 0.05 && Math.abs(currentRy) < 0.05) {
          el.style.transform = '';
          el.style.boxShadow = '';
          rafId = null;
        } else {
          rafId = requestAnimationFrame(animateTilt);
        }
      }
    }

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -11;
      const rotateY = ((x - centerX) / centerX) * 11;
      const glareX = ((x / rect.width) * 100).toFixed(1);
      const glareY = ((y / rect.height) * 100).toFixed(1);
      const shadowX = (-rotateY * 1.5).toFixed(1);
      const shadowY = (rotateX * 1.5).toFixed(1);
      targetRx = ((y - centerY) / centerY) * -12;
      targetRy = ((x - centerX) / centerX) * 12;
      targetGlareX = (x / rect.width) * 100;
      targetGlareY = (y / rect.height) * 100;

      el.style.setProperty('--glare-x', `${glareX}%`);
      el.style.setProperty('--glare-y', `${glareY}%`);
      el.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025)`;
      el.style.boxShadow = `${shadowX}px ${shadowY}px 30px var(--accent-glow)`;
      if (!isHovered) {
        isHovered = true;
        if (!rafId) {
          rafId = requestAnimationFrame(animateTilt);
        }
      }
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      el.style.boxShadow = '';
      targetRx = 0;
      targetRy = 0;
      targetGlareX = 50;
      targetGlareY = 50;
      isHovered = false;
      if (!rafId) {
        rafId = requestAnimationFrame(animateTilt);
      }
    });
  });
}

function initSpotlight() {
  const cards = document.querySelectorAll('.spotlight-card:not([data-spotlight-bound])');
  cards.forEach((card) => {
    card.setAttribute('data-spotlight-bound', '');
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

function initScrollReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.scroll-reveal').forEach((el) => el.classList.add('in-view'));
    return;
  }

  const targets = document.querySelectorAll(
    '.scroll-reveal, .project-card, .timeline-item, .cert-card, .skill-group, .stat-card, .about-bio, .terminal-window, .contact-card, .contact-form-wrap'
  );

  targets.forEach((target) => {
    if (!target.classList.contains('scroll-reveal')) {
      target.classList.add('scroll-reveal');
    }
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          entry.target.classList.remove('scroll-exit-up');
        } else {
          if (entry.boundingClientRect.top < 0) {
            entry.target.classList.remove('in-view');
            entry.target.classList.add('scroll-exit-up');
          } else {
            entry.target.classList.remove('in-view');
            entry.target.classList.remove('scroll-exit-up');
          }
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  targets.forEach((target) => observer.observe(target));
}

function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = (canvas.width = canvas.parentElement.offsetWidth);
  let height = (canvas.height = canvas.parentElement.offsetHeight);

  window.addEventListener('resize', () => {
    if (!canvas.parentElement) return;
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  });

  const mouse = { x: -1000, y: -1000, radius: 140 };
  const heroSection = document.getElementById('home');
  if (heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    heroSection.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });
  }

  const particleCount = Math.min(Math.floor(width / 18), 65);
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      radius: Math.random() * 2 + 1,
      baseAlpha: Math.random() * 0.5 + 0.25
    });
  }

  function getAccentRGB() {
    const theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'gold') return '245, 158, 11';
    if (theme === 'emerald') return '16, 185, 129';
    if (theme === 'sunset') return '244, 63, 94';
    return '0, 229, 255';
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    const rgb = getAccentRGB();

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      else if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      else if (p.y > height) p.y = 0;

      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        p.x -= (dx / dist) * force * 1.5;
        p.y -= (dy / dist) * force * 1.5;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb}, ${p.baseAlpha})`;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dist2 = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (dist2 < 110) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(${rgb}, ${(1 - dist2 / 110) * 0.22})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

function initTerminal() {
  const terminalForm = document.getElementById('terminalForm');
  const terminalInput = document.getElementById('terminalInput');
  const terminalOutput = document.getElementById('terminalOutput');
  const cmdChips = document.querySelectorAll('.cmd-chip');

  if (!terminalOutput || !terminalInput) return;

  const commands = {
    help: () => [
      'Available Commands:',
      '  help        - List all terminal commands',
      '  skills      - View technical skills & stack',
      '  projects    - Summary of featured projects',
      '  experience  - Professional journey & roles',
      '  education   - Academic qualifications',
      '  contact     - Ways to reach out',
      '  whoami      - Discover who Aashish is',
      '  sudo        - Elevate system permissions',
      '  clear       - Reset the terminal output'
    ],
    skills: () => [
      'Languages:     C++, Python, Java, C#, SQL, JavaScript (ES6+)',
      'Frontend:      React.js, Tailwind CSS, Bootstrap 5, HTML5, CSS3',
      'Backend & DB:  Node.js, Express.js, MongoDB, MySQL, REST APIs',
      'AI & Big Data: Machine Learning, Hadoop, MapReduce, HDFS, YARN',
      'Workflow:      Git, GitHub, VS Code, Linux CLI, npm'
    ],
    projects: () => [
      '1. Food-Lover: Modern restaurant landing platform with live timer',
      '2. E-Commerce: Full store flow with dynamic cart and checkout',
      '3. Weather App: Live API meteorological forecasting app',
      '4. Expense Tracker: Local finance logging tool using localStorage',
      '5. ShriJi Agro: Responsive multi-page commercial portal'
    ],
    experience: () => [
      'Frontend Developer Intern @ Webority Technologies (Aug 2026 - Present)',
      '  - Building responsive interfaces & client web solutions',
      'Frontend Developer Intern @ ShriJi Agro Products (Jun 2025 - Jul 2025)',
      '  - Delivered end-to-end commercial website & interactive UI'
    ],
    education: () => [
      'M.C.A. (AI & ML) - Amity University Online (2026 - Present)',
      'B.C.A. (CGPA: 8.31/10) - J.C. Bose UST, YMCA (2023 - 2026)'
    ],
    contact: () => [
      'Email:    iaashishkumar04@gmail.com',
      'Phone:    +91-9205588640',
      'GitHub:   https://github.com/iaashishk',
      'LinkedIn: https://linkedin.com/in/aashish-k-b53778261'
    ],
    whoami: () => [
      'Aashish Kumar — MCA Scholar in AI & ML, Software Engineer & Frontend Developer Intern.',
      'Passionate about crafting 3D interfaces and architecting scalable web applications.'
    ],
    sudo: () => [
      'Permission denied: Guest user is already granted maximum interactive capabilities!'
    ]
  };

  function executeCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    const cmdLine = document.createElement('div');
    cmdLine.className = 'term-line';
    cmdLine.innerHTML = `<span style="color: #27c93f;">guest@ak:~$</span> <span style="color: #fff;">${rawCmd}</span>`;
    terminalOutput.appendChild(cmdLine);

    if (cmd === 'clear') {
      terminalOutput.innerHTML = `
        <div class="term-line term-intro">Terminal cleared. Ready for input.</div>
        <div class="term-line term-sub">Type a command or click a quick shortcut:</div>
        <div class="term-quick-cmds">
          <button class="cmd-chip" data-cmd="help">help</button>
          <button class="cmd-chip" data-cmd="skills">skills</button>
          <button class="cmd-chip" data-cmd="projects">projects</button>
          <button class="cmd-chip" data-cmd="experience">experience</button>
          <button class="cmd-chip" data-cmd="contact">contact</button>
          <button class="cmd-chip" data-cmd="clear">clear</button>
        </div>
      `;
      bindChips();
      terminalInput.value = '';
      return;
    }

    if (commands[cmd]) {
      const outputLines = commands[cmd]();
      outputLines.forEach((line) => {
        const outDiv = document.createElement('div');
        outDiv.className = 'term-line';
        outDiv.style.color = 'var(--text-muted)';
        outDiv.textContent = line;
        terminalOutput.appendChild(outDiv);
      });
    } else {
      const errDiv = document.createElement('div');
      errDiv.className = 'term-line';
      errDiv.style.color = '#ff5f56';
      errDiv.textContent = `Command not recognized: '${cmd}'. Type 'help' for supported commands.`;
      terminalOutput.appendChild(errDiv);
    }

    terminalInput.value = '';
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  function bindChips() {
    terminalOutput.querySelectorAll('.cmd-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        const targetCmd = chip.getAttribute('data-cmd');
        executeCommand(targetCmd);
      });
    });
  }

  bindChips();

  if (terminalForm) {
    terminalForm.addEventListener('submit', () => {
      executeCommand(terminalInput.value);
    });
  }
}

const certLightbox = document.getElementById('certLightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxBackdrop = document.getElementById('lightboxBackdrop');

function openLightbox(src, title) {
  if (!certLightbox || !lightboxImg) return;
  lightboxImg.src = src;
  lightboxImg.alt = title;
  if (lightboxCaption) lightboxCaption.textContent = title;
  certLightbox.classList.add('open');
  certLightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!certLightbox) return;
  certLightbox.classList.remove('open');
  certLightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('.cert-image-wrap').forEach((wrap) => {
  wrap.addEventListener('click', () => {
    const src = wrap.getAttribute('data-cert-src');
    const title = wrap.getAttribute('data-cert-title');
    openLightbox(src, title);
  });
});

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && certLightbox && certLightbox.classList.contains('open')) {
    closeLightbox();
  }
});

let toastTimeout;
function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

document.querySelectorAll('.copy-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const copyText = btn.getAttribute('data-copy');
    if (!copyText) return;
    navigator.clipboard.writeText(copyText).then(
      () => showToast(`Copied: ${copyText}`),
      () => {
        const temp = document.createElement('textarea');
        temp.value = copyText;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        showToast(`Copied: ${copyText}`);
      }
    );
  });
});

const defaultRecommendations = [
  {
    text: "An exceptionally dedicated developer who brings both technical proficiency and a strong work ethic to every project. Delivered outstanding results during their internship.",
    author: "Technical Lead",
    role: "Webority Technologies"
  },
  {
    text: "Their ability to quickly grasp complex concepts like Hadoop ecosystems and apply them practically is highly impressive. A fantastic problem solver.",
    author: "Academic Mentor",
    role: "Department of Computer Applications"
  },
  {
    text: "Consistently produces clean, efficient code. Their approach to building user interfaces is methodical and always prioritizes the end-user experience.",
    author: "Senior Developer",
    role: "Project Mentor"
  }
];

const allRecommendationsContainer = document.getElementById('all_recommendations');
const recommendationForm = document.getElementById('recommendationForm');
const recAuthorInput = document.getElementById('rec_author');
const recRoleInput = document.getElementById('rec_role');
const recTextInput = document.getElementById('new_recommendation');

function getInitials(name) {
  if (!name) return 'AK';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function loadRecommendations() {
  const saved = localStorage.getItem('ak_portfolio_recommendations');
  let list = defaultRecommendations;
  if (saved) {
    try {
      list = JSON.parse(saved);
    } catch (e) {
      list = defaultRecommendations;
    }
  }

  if (!allRecommendationsContainer) return;
  allRecommendationsContainer.innerHTML = '';

  list.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'recommendation spotlight-card';
    card.setAttribute('data-tilt', '');

    const quoteMark = document.createElement('span');
    quoteMark.className = 'quote-mark';
    quoteMark.innerHTML = '&#8220;';

    const p = document.createElement('p');
    p.textContent = item.text;

    const meta = document.createElement('div');
    meta.className = 'rec-meta';

    const avatar = document.createElement('div');
    avatar.className = 'rec-avatar';
    avatar.textContent = getInitials(item.author);

    const info = document.createElement('div');
    const authorEl = document.createElement('h4');
    authorEl.className = 'rec-author';
    authorEl.textContent = item.author;

    const roleEl = document.createElement('p');
    roleEl.className = 'rec-role';
    roleEl.textContent = item.role || 'Colleague / Contributor';

    info.appendChild(authorEl);
    info.appendChild(roleEl);

    meta.appendChild(avatar);
    meta.appendChild(info);

    card.appendChild(quoteMark);
    card.appendChild(p);
    card.appendChild(meta);

    allRecommendationsContainer.appendChild(card);
  });

  setupRecCarousel(list.length);
  init3DTilt();
  initSpotlight();
}

let currentRecSlide = 0;
let recSlideTimer = null;

function setupRecCarousel(cardCount) {
  const prevBtn = document.getElementById('recPrevBtn');
  const nextBtn = document.getElementById('recNextBtn');
  const dotsContainer = document.getElementById('recDots');
  if (!prevBtn || !nextBtn || !dotsContainer || !allRecommendationsContainer) return;

  dotsContainer.innerHTML = '';
  const isDesktop = window.innerWidth >= 768;
  const cardsPerView = isDesktop ? 2 : 1;
  const maxSlides = Math.max(1, Math.ceil(cardCount / cardsPerView));

  for (let i = 0; i < maxSlides; i++) {
    const dot = document.createElement('button');
    dot.className = `rec-dot ${i === 0 ? 'active' : ''}`;
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => goToRecSlide(i));
    dotsContainer.appendChild(dot);
  }

  function updateSlide(index) {
    currentRecSlide = (index + maxSlides) % maxSlides;
    const offset = currentRecSlide * 100;
    allRecommendationsContainer.style.transform = `translateX(-${offset}%)`;
    const dots = dotsContainer.querySelectorAll('.rec-dot');
    dots.forEach((d, idx) => {
      d.classList.toggle('active', idx === currentRecSlide);
    });
  }

  function goToRecSlide(index) {
    updateSlide(index);
    resetRecAutoplay();
  }

  prevBtn.onclick = () => {
    updateSlide(currentRecSlide - 1);
    resetRecAutoplay();
  };

  nextBtn.onclick = () => {
    updateSlide(currentRecSlide + 1);
    resetRecAutoplay();
  };

  function startRecAutoplay() {
    stopRecAutoplay();
    if (maxSlides > 1) {
      recSlideTimer = setInterval(() => {
        updateSlide(currentRecSlide + 1);
      }, 5500);
    }
  }

  function stopRecAutoplay() {
    if (recSlideTimer) clearInterval(recSlideTimer);
  }

  function resetRecAutoplay() {
    startRecAutoplay();
  }

  const viewport = allRecommendationsContainer.parentElement;
  if (viewport) {
    viewport.onmouseenter = stopRecAutoplay;
    viewport.onmouseleave = startRecAutoplay;
  }

  updateSlide(0);
  startRecAutoplay();
}

if (recommendationForm) {
  recommendationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = recTextInput ? recTextInput.value.trim() : '';
    const author = recAuthorInput ? recAuthorInput.value.trim() : '';
    const role = recRoleInput ? recRoleInput.value.trim() : '';

    if (!text || !author) {
      if (!author && recAuthorInput) recAuthorInput.focus();
      else if (!text && recTextInput) recTextInput.focus();
      return;
    }

    const saved = localStorage.getItem('ak_portfolio_recommendations');
    let list = defaultRecommendations;
    if (saved) {
      try {
        list = JSON.parse(saved);
      } catch (err) {
        list = [...defaultRecommendations];
      }
    } else {
      list = [...defaultRecommendations];
    }

    list.unshift({
      text,
      author,
      role: role || 'Peer / Collaborator'
    });

    localStorage.setItem('ak_portfolio_recommendations', JSON.stringify(list));
    loadRecommendations();

    if (recTextInput) recTextInput.value = '';
    if (recAuthorInput) recAuthorInput.value = '';
    if (recRoleInput) recRoleInput.value = '';

    showToast('Thank you! Recommendation added.');
  });
}

function initCustomCursor() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cursor = document.getElementById('customCursor');
  const label = document.getElementById('customCursorLabel');
  if (!cursor) return;

  let mouseX = -100;
  let mouseY = -100;
  let currentX = -100;
  let currentY = -100;
  let isVisible = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!isVisible) {
      isVisible = true;
      cursor.style.opacity = '1';
    }
  });

  document.addEventListener('mouseleave', () => {
    isVisible = false;
    cursor.style.opacity = '0';
  });

  function renderCursor() {
    currentX += (mouseX - currentX) * 0.2;
    currentY += (mouseY - currentY) * 0.2;
    cursor.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;
    requestAnimationFrame(renderCursor);
  }

  requestAnimationFrame(renderCursor);

  const interactiveElements = document.querySelectorAll(
    'a, button, input, textarea, .project-card, .cert-card, .marquee-chip, .theme-btn, .filter-btn, .cmd-chip'
  );

  interactiveElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('is-hovered');
      if (el.getAttribute('data-cursor-label') && label) {
        label.textContent = el.getAttribute('data-cursor-label');
      } else if (label) {
        label.textContent = '';
      }
    });

    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('is-hovered');
      if (label) label.textContent = '';
    });
  });
}

function initProjectSlider() {
  const track = document.getElementById('projectsGrid');
  const viewport = document.getElementById('projViewport');
  const prevBtn = document.getElementById('projPrevBtn');
  const nextBtn = document.getElementById('projNextBtn');
  const progressFill = document.getElementById('projProgressFill');
  const counter = document.getElementById('projCounter');
  const filterBtns = document.querySelectorAll('.filter-btn');

  if (!track || !viewport) return;

  const allCards = Array.from(track.querySelectorAll('.project-card, .proj-card'));
  let visibleCards = [...allCards];
  let currentIndex = 0;
  let isDown = false;
  let startX = 0;
  let scrollStart = 0;
  let hasDragged = false;
  let wheelTimeout = null;

  function getCardOffset(index) {
    if (!visibleCards[index]) return 0;
    return visibleCards[index].offsetLeft;
  }

  function getMaxScroll() {
    return Math.max(0, track.scrollWidth - viewport.clientWidth);
  }

  function updateSlider(index, animate = true) {
    if (visibleCards.length === 0) return;
    currentIndex = Math.max(0, Math.min(index, visibleCards.length - 1));

    if (window.innerWidth > 900) {
      const maxScroll = getMaxScroll();
      const targetOffset = Math.min(getCardOffset(currentIndex), maxScroll);
      track.style.transition = animate ? 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)' : 'none';
      track.style.transform = `translate3d(-${targetOffset}px, 0, 0)`;
    } else {
      track.style.transform = '';
      track.style.transition = '';
    }

    const progress = visibleCards.length > 1 ? (currentIndex + 1) / visibleCards.length : 1;
    if (progressFill) {
      progressFill.style.transform = `scaleX(${progress})`;
    }

    if (counter) {
      const currentStr = String(currentIndex + 1).padStart(2, '0');
      const totalStr = String(visibleCards.length).padStart(2, '0');
      counter.textContent = `${currentStr} / ${totalStr}`;
    }

    if (prevBtn) prevBtn.disabled = currentIndex === 0;
    if (nextBtn) nextBtn.disabled = currentIndex >= visibleCards.length - 1;

    visibleCards.forEach((card, i) => {
      if (i === currentIndex) {
        card.classList.add('is-active-slide');
      } else {
        card.classList.remove('is-active-slide');
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        updateSlider(currentIndex - 1);
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentIndex < visibleCards.length - 1) {
        updateSlider(currentIndex + 1);
      }
    });
  }

  viewport.addEventListener('mousedown', (e) => {
    if (window.innerWidth <= 900) return;
    isDown = true;
    hasDragged = false;
    startX = e.pageX;
    scrollStart = getCardOffset(currentIndex);
    track.style.transition = 'none';
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    const walk = e.pageX - startX;
    if (Math.abs(walk) > 6) {
      hasDragged = true;
    }
    const maxScroll = getMaxScroll();
    const currentTranslate = Math.max(0, Math.min(scrollStart - walk, maxScroll));
    track.style.transform = `translate3d(-${currentTranslate}px, 0, 0)`;
  });

  function endDrag(e) {
    if (!isDown) return;
    isDown = false;
    if (hasDragged && e) {
      const walk = (e.pageX || startX) - startX;
      if (walk < -50 && currentIndex < visibleCards.length - 1) {
        updateSlider(currentIndex + 1);
      } else if (walk > 50 && currentIndex > 0) {
        updateSlider(currentIndex - 1);
      } else {
        updateSlider(currentIndex);
      }
    } else {
      updateSlider(currentIndex);
    }
  }

  window.addEventListener('mouseup', endDrag);
  viewport.addEventListener('mouseleave', endDrag);

  viewport.addEventListener('click', (e) => {
    if (hasDragged) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);

  viewport.addEventListener('wheel', (e) => {
    if (window.innerWidth <= 900) return;
    const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    if (Math.abs(delta) < 20) return;

    if (delta > 0 && currentIndex < visibleCards.length - 1) {
      e.preventDefault();
      if (!wheelTimeout) {
        updateSlider(currentIndex + 1);
        wheelTimeout = setTimeout(() => {
          wheelTimeout = null;
        }, 400);
      }
    } else if (delta < 0 && currentIndex > 0) {
      e.preventDefault();
      if (!wheelTimeout) {
        updateSlider(currentIndex - 1);
        wheelTimeout = setTimeout(() => {
          wheelTimeout = null;
        }, 400);
      }
    }
  }, { passive: false });

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter') || 'all';
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      visibleCards = [];
      allCards.forEach((card) => {
        const cat = card.getAttribute('data-category') || '';
        if (filter === 'all' || cat.includes(filter)) {
          card.style.display = 'flex';
          visibleCards.push(card);
        } else {
          card.style.display = 'none';
        }
      });

      updateSlider(0, false);
    });
  });

  window.addEventListener('resize', () => {
    updateSlider(currentIndex, false);
  });

  updateSlider(0, false);
}

init3DTilt();
initSpotlight();
initHeroCanvas();
initTerminal();
loadRecommendations();
initScrollReveal();
initCustomCursor();
initProjectSlider();