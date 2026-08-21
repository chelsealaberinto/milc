/**
 * MILC Premium Website — Core JavaScript Interactions
 * Brand: Multiple Intelligence Learning Center (MILC)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modular components
  initNavbar();
  initHeroParallax();
  initScrollAnimations();
  initCounter();
  initLightbox();
  initAboutTabs();
});

/* ==========================================================================
   1. NAVBAR FUNCTIONALITY (Sticky transition & Mobile menu toggle)
   ========================================================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const toggleBtn = document.getElementById('navbar-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.navbar-link');

  // Sticky header transition on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    // Active navigation link update based on scroll position
    updateActiveNavLink();
  });

  // Mobile Hamburger Toggle
  toggleBtn.addEventListener('click', () => {
    toggleBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close mobile drawer when clicking menu links
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleBtn.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // Update active navigation link based on current page anchor
  function updateActiveNavLink() {
    let currentSection = 'home';
    const sections = document.querySelectorAll('section, main > section');
    const scrollPosition = window.scrollY + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }
}

/* ==========================================================================
   2. HERO SCROLL PARALLAX EFFECT
   ========================================================================== */
function initHeroParallax() {
  const heroBg = document.getElementById('hero-bg');
  const heroContent = document.querySelector('.hero-content');
  const scrollIndicator = document.getElementById('scroll-indicator');

  // Check if system prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const heroHeight = document.getElementById('home').offsetHeight;

    if (scrollY <= heroHeight) {
      // Scale image slightly from 1.0 to 1.08
      const scaleValue = 1 + (scrollY / heroHeight) * 0.08;
      heroBg.style.transform = `scale(${scaleValue}) translateY(${scrollY * 0.2}px)`;

      // Fade out hero content gradually
      const opacityValue = 1 - (scrollY / (heroHeight * 0.6));
      heroContent.style.opacity = Math.max(opacityValue, 0);
      heroContent.style.transform = `translateY(${scrollY * 0.15}px)`;

      // Hide scroll mouse indicator quickly on scroll
      if (scrollY > 100) {
        scrollIndicator.style.opacity = '0';
        scrollIndicator.style.pointerEvents = 'none';
      } else {
        scrollIndicator.style.opacity = '0.8';
        scrollIndicator.style.pointerEvents = 'all';
      }
    }
  });
}

/* ==========================================================================
   3. CAMPUS LIFE GALLERY LOGIC (Unified Lightbox Handler)
   ========================================================================== */

/* ==========================================================================
   4. SCROLL ANIMATION OBSERVER (CSS Reveal Triggers)
   ========================================================================== */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-clip');
  
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    animatedElements.forEach(el => el.classList.add('animated'));
    initGsapScrollAnimations(true);
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.12 // Element is 12% visible
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add animated class to trigger CSS transition rules
        entry.target.classList.add('animated');
        
        // Unobserve to keep site performant after revealing
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(element => {
    observer.observe(element);
  });

  // Launch GSAP scroll animations
  initGsapScrollAnimations(false);
}

function initGsapScrollAnimations(prefersReducedMotion) {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('GSAP or ScrollTrigger is not loaded.');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  if (prefersReducedMotion) {
    // Accessible, simple fade-in animations for all cards triggered once when visible
    const allCards = document.querySelectorAll('.moments-editorial .moment-card, .gallery-editorial .gallery-card, .w-card-20-caption');
    allCards.forEach(card => {
      gsap.fromTo(card, 
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            once: true
          }
        }
      );
    });
    return;
  }

  // Section 1: OUR MOMENTS, OUR MEMORIES (Clean staggered masonry animations with reverse scroll)
  const momentsWrappers = document.querySelectorAll('.moments-editorial .moment-card-wrapper');
  if (momentsWrappers.length > 0) {
    ScrollTrigger.batch(momentsWrappers, {
      onEnter: batch => gsap.fromTo(batch, 
        { opacity: 0, y: 70, scale: 0.94 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 0.8, 
          ease: "power2.out", 
          stagger: 0.15,
          overwrite: "auto"
        }
      ),
      onLeaveBack: batch => gsap.to(batch, { 
        opacity: 0, 
        y: 70, 
        scale: 0.94, 
        duration: 0.6, 
        ease: "power2.inOut", 
        stagger: 0.1,
        overwrite: "auto"
      }),
      onEnterBack: batch => gsap.to(batch, { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        duration: 0.8, 
        ease: "power2.out", 
        stagger: 0.1,
        overwrite: "auto"
      }),
      start: "top 92%",
      end: "bottom 8%"
    });
  }

  // Section 2: Campus Gallery — staggered batch reveal
  const galleryCards = document.querySelectorAll('.gallery-editorial .gallery-card');
  if (galleryCards.length > 0) {
    ScrollTrigger.batch(galleryCards, {
      onEnter: batch => gsap.fromTo(batch,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.05,
          overwrite: 'auto'
        }
      ),
      onEnterBack: batch => gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.04,
        overwrite: 'auto'
      }),
      onLeaveBack: batch => gsap.to(batch, {
        opacity: 0,
        y: 30,
        duration: 0.4,
        ease: 'power2.inOut',
        stagger: 0.03,
        overwrite: 'auto'
      }),
      start: 'top 98%',
      end: 'bottom 2%'
    });
  }


  // Parallax background decorative shapes
  const parallaxItems = document.querySelectorAll('.decor-parallax');
  parallaxItems.forEach(item => {
    const speed = parseFloat(item.getAttribute('data-speed')) || 0.1;
    gsap.fromTo(item, 
      { y: -80 * speed },
      {
        y: 80 * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: item.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      }
    );
  });
}

/* ==========================================================================
   5. COUNT-UP STATS ANIMATION
   ========================================================================== */
function initCounter() {
  const counterElement = document.getElementById('counter-years');
  if (!counterElement) return;

  const targetValue = 23; // Years established (2003 to 2026)
  const duration = 2000; // 2 seconds animation duration

  const observerOptions = {
    root: null,
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startCounting(counterElement, targetValue, duration);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  observer.observe(counterElement);

  function startCounting(element, target, duration) {
    let startTimestamp = null;
    
    function step(timestamp) {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      element.innerText = Math.floor(progress * target);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        element.innerText = target + "+";
      }
    }
    
    window.requestAnimationFrame(step);
  }
}

/* ==========================================================================
   6. PREMIUM PHOTO GALLERY LIGHTBOX COMPONENT
   ========================================================================== */
// Gallery array config for all 12 Moments grid photos
const galleryData = [
  {
    src: "assets/O1.jpg",
    caption: "Collaborative Science Projects — Active, hands-on classroom experiments."
  },
  {
    src: "assets/O2.jpg",
    caption: "Visual Arts Studio — Nurturing spatial creativity through sculpting and painting."
  },
  {
    src: "assets/O3.jpg",
    caption: "Orchestral Training — Group instrumental and music performance training."
  },
  {
    src: "assets/O4.jpg",
    caption: "Physical Development Program — Physical education and active outdoor sports."
  },
  {
    src: "assets/O5.jpg",
    caption: "Eco-Garden Studies — Outdoors planting and environmental nature studies."
  },
  {
    src: "assets/O6.jpg",
    caption: "Student Interaction Fields — Enhancing social skills during active recreation breaks."
  },
  {
    src: "assets/O7.jpg",
    caption: "Classroom Arts Showcase — Students exhibiting their creative works."
  },
  {
    src: "assets/O8.jpg",
    caption: "Outdoor Activities — Playful physical learning in a warm school yard."
  },
  {
    src: "assets/O9.jpg",
    caption: "Excellence & Achievements — Celebrating core student learning milestones."
  },
  {
    src: "assets/O10.jpg",
    caption: "Primary Library Studies — Enhancing language and research capabilities."
  },
  {
    src: "assets/O11.jpg",
    caption: "Educational Excursions — Learning via outdoor environment discovery."
  },
  {
    src: "assets/O12.jpg",
    caption: "Creative Classrooms — Integrating group cooperation and design projects."
  }
];

let currentImageIndex = 0;
let lightboxImagesList = [];
let isLightboxPlain = false;

function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  
  // Close lightbox when clicking outside content wrapper
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard navigation support
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') changeLightboxImage(1);
    if (e.key === 'ArrowLeft') changeLightboxImage(-1);
  });
}

function openLightbox(elementOrIndex) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');

  if (typeof elementOrIndex === 'number') {
    // Index mapping from global galleryData array
    lightboxImagesList = galleryData;
    currentImageIndex = elementOrIndex;
    isLightboxPlain = false;
  } else {
    // Dynamic extraction from clicked DOM card
    const galleryBlock = elementOrIndex.closest('.student-life-gallery, .moments-grid, .moments-editorial, .gallery-grid, .gallery-editorial');
    isLightboxPlain = !!elementOrIndex.closest('#gallery');
    
    if (galleryBlock) {
      const items = Array.from(galleryBlock.querySelectorAll('.gallery-grid-item, .moment-card, .gallery-card'));
      lightboxImagesList = items.map(item => {
        const img = item.querySelector('img');
        const titleEl = item.querySelector('.gallery-grid-item-title, h4, h5');
        const catEl = item.querySelector('.gallery-grid-item-category, span, .core-card-badge');
        
        const src = img ? img.src : '';
        const category = catEl ? catEl.innerText.trim() : '';
        const title = titleEl ? titleEl.innerText.trim() : '';
        let caption = category && title ? `${category} — ${title}` : (title || category || '');
        
        if (!caption && img && img.alt) {
          caption = img.alt;
        }
        
        return { src, caption };
      });
      currentImageIndex = items.indexOf(elementOrIndex);
    } else {
      // Fallback
      lightboxImagesList = galleryData;
      currentImageIndex = 0;
    }
  }

  const currentItem = lightboxImagesList[currentImageIndex];
  if (currentItem) {
    lightboxImg.src = currentItem.src;
    lightboxCaption.innerText = currentItem.caption;
  }

  // Display or hide caption depending on isLightboxPlain
  if (isLightboxPlain) {
    lightboxCaption.style.display = 'none';
  } else {
    lightboxCaption.style.display = 'block';
  }
  
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden'; // Lock page scroll
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('active');
  document.body.style.overflow = ''; // Unlock page scroll
}

function changeLightboxImage(direction) {
  if (lightboxImagesList.length === 0) return;
  currentImageIndex = (currentImageIndex + direction + lightboxImagesList.length) % lightboxImagesList.length;
  
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  
  // Soft fade transitions
  lightboxImg.style.opacity = '0.3';
  lightboxImg.style.transform = 'scale(0.97)';
  
  setTimeout(() => {
    const currentItem = lightboxImagesList[currentImageIndex];
    if (currentItem) {
      lightboxImg.src = currentItem.src;
      lightboxCaption.innerText = currentItem.caption;
    }
    
    // Display or hide caption depending on isLightboxPlain
    if (isLightboxPlain) {
      lightboxCaption.style.display = 'none';
    } else {
      lightboxCaption.style.display = 'block';
    }
    
    lightboxImg.style.opacity = '1';
    lightboxImg.style.transform = 'scale(1)';
  }, 180);
}

/* ==========================================================================
   7. INTERACTIVE MAP DYNAMIC LOAD (Performance Optimizer)
   ========================================================================== */
function loadMap() {
  const mapBox = document.getElementById('contact-map-box');
  mapBox.classList.add('loaded');
}

/* ==========================================================================
   8. CLIENT-SIDE INQUIRY FORM SUCCESS STATUS SUBMIT
   ========================================================================== */
function handleInquirySubmit(event) {
  event.preventDefault();
  
  const parentName = document.getElementById('parent-name').value;
  const statusMsg = document.getElementById('form-status-msg');
  const form = document.getElementById('inquiry-form');
  
  // Simple validation block
  if (!parentName) return;

  // Show status success message banner
  statusMsg.style.display = 'block';
  statusMsg.innerHTML = `<strong>Inquiry Sent Successfully!</strong> Thank you ${parentName}. An admissions registrar will email you back within 24 hours.`;

  // Reset form after delay
  setTimeout(() => {
    form.reset();
    // Fade out message after 8s
    setTimeout(() => {
      statusMsg.style.display = 'none';
    }, 8000);
  }, 500);
}

/* ==========================================================================
   7. INSTITUTIONAL CORE TABBED EXPLORER (About Us content)
   ========================================================================== */
function initAboutTabs() {
  const tabButtons = document.querySelectorAll('.about-tab-btn');
  const tabPanels = document.querySelectorAll('.about-tab-panel');

  if (tabButtons.length === 0) return;

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-about-tab');

      // Update button active state
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // Update panel display
      tabPanels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === `about-panel-${targetTab}`) {
          panel.classList.add('active');
        }
      });
    });
  });
}
