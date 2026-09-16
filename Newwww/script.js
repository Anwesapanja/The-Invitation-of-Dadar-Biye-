/* ====================================================
   ROYAL WEDDING RECEPTION JAVASCRIPT
   ANIK & DEBALEENA — 23.11.2026
   ==================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ==================================================
     1. GLOBAL AMBIENT CANVAS (Soft Petals & Gold Sparkles)
     ================================================== */
  const canvas = document.getElementById('ambient-canvas');
  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const PARTICLE_COUNT = Math.min(window.innerWidth < 768 ? 18 : 32, 40);

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -30;
      this.type = Math.random() > 0.4 ? 'petal' : (Math.random() > 0.5 ? 'sparkle' : 'goldDust');
      
      if (this.type === 'petal') {
        this.size = 9 + Math.random() * 11;
        this.speedY = 0.6 + Math.random() * 1.2;
        this.speedX = (Math.random() - 0.5) * 0.8;
        this.rotation = Math.random() * 360;
        this.rotSpeed = (Math.random() - 0.5) * 1.5;
        this.color = Math.random() > 0.4 
          ? `rgba(${210 + Math.floor(Math.random() * 30)}, ${20 + Math.floor(Math.random() * 25)}, ${40 + Math.floor(Math.random() * 25)}, ${0.55 + Math.random() * 0.2})`
          : `rgba(${255}, ${170 + Math.floor(Math.random() * 50)}, 0, ${0.55 + Math.random() * 0.2})`;
      } else if (this.type === 'sparkle') {
        this.size = 2 + Math.random() * 2.5;
        this.speedY = 0.3 + Math.random() * 0.6;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.alpha = 0.2 + Math.random() * 0.6;
        this.alphaSpeed = 0.015 + Math.random() * 0.025;
        this.color = '#ffd700';
      } else {
        this.size = 1 + Math.random() * 1.8;
        this.speedY = 0.25 + Math.random() * 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.alpha = 0.25 + Math.random() * 0.5;
        this.color = '#ffe484';
      }
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.y * 0.015) * 0.3;

      if (this.type === 'petal') {
        this.rotation += this.rotSpeed;
      } else if (this.type === 'sparkle') {
        this.alpha += this.alphaSpeed;
        if (this.alpha > 0.9 || this.alpha < 0.2) {
          this.alphaSpeed = -this.alphaSpeed;
        }
      }

      if (this.y > height + 30 || this.x < -30 || this.x > width + 30) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      if (this.type === 'petal') {
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(this.size * 0.6, -this.size * 0.4, this.size, this.size * 0.3, 0, this.size);
        ctx.bezierCurveTo(-this.size, this.size * 0.3, -this.size * 0.6, -this.size * 0.4, 0, 0);
        ctx.fill();
      } else if (this.type === 'sparkle') {
        ctx.globalAlpha = Math.max(0, Math.min(1, this.alpha));
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#ffd700';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  function animateAmbient() {
    ctx.clearRect(0, 0, width, height);
    for (let p of particles) {
      p.update();
      p.draw();
    }
    requestAnimationFrame(animateAmbient);
  }
  animateAmbient();

  window.triggerPetalShower = function(amount = 35) {
    for (let i = 0; i < amount; i++) {
      const p = new Particle();
      p.y = -20 - Math.random() * 50;
      p.x = Math.random() * width;
      p.speedY = 2 + Math.random() * 3.5;
      particles.push(p);
    }
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 40,
        spread: 75,
        origin: { y: 0.25 },
        colors: ['#ffd700', '#e60026', '#ff8da1', '#ffffff']
      });
    }
  };

  /* ==================================================
     2. CURSOR GLITTER & CLICK BURST ENGINE
     ================================================== */
  const glitterCanvas = document.getElementById('glitter-canvas');
  const gctx = glitterCanvas.getContext('2d');
  let gWidth = (glitterCanvas.width = window.innerWidth);
  let gHeight = (glitterCanvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    gWidth = glitterCanvas.width = window.innerWidth;
    gHeight = glitterCanvas.height = window.innerHeight;
  });

  const glitterSparks = [];

  class GlitterSpark {
    constructor(x, y, isClick = false) {
      this.x = x;
      this.y = y;
      this.isClick = isClick;
      
      const angle = Math.random() * Math.PI * 2;
      const speed = isClick ? 1.5 + Math.random() * 5.5 : 0.4 + Math.random() * 1.8;
      
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed + (isClick ? 0.3 : -0.2);
      this.size = isClick ? 3 + Math.random() * 5 : 2 + Math.random() * 3.5;
      this.life = 1;
      this.decay = isClick ? 0.02 + Math.random() * 0.025 : 0.03 + Math.random() * 0.04;
      this.type = Math.random() > 0.4 ? 'star' : 'circle';
      
      const goldTones = ['#ffd700', '#fff4cc', '#e5c158', '#ffffff', '#ff9900'];
      this.color = goldTones[Math.floor(Math.random() * goldTones.length)];
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= 0.96;
      this.vy *= 0.96;
      this.life -= this.decay;
    }

    draw() {
      if (this.life <= 0) return;
      gctx.save();
      gctx.globalAlpha = Math.max(0, this.life);
      gctx.fillStyle = this.color;
      gctx.shadowColor = '#ffd700';
      gctx.shadowBlur = this.isClick ? 8 : 4;

      if (this.type === 'star') {
        gctx.beginPath();
        const s = this.size * this.life;
        gctx.moveTo(this.x, this.y - s * 1.5);
        gctx.lineTo(this.x + s * 0.4, this.y - s * 0.4);
        gctx.lineTo(this.x + s * 1.5, this.y);
        gctx.lineTo(this.x + s * 0.4, this.y + s * 0.4);
        gctx.lineTo(this.x, this.y + s * 1.5);
        gctx.lineTo(this.x - s * 0.4, this.y + s * 0.4);
        gctx.lineTo(this.x - s * 1.5, this.y);
        gctx.lineTo(this.x - s * 0.4, this.y - s * 0.4);
        gctx.closePath();
        gctx.fill();
      } else {
        gctx.beginPath();
        gctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
        gctx.fill();
      }
      gctx.restore();
    }
  }

  function addGlitterBurst(x, y, count = 25) {
    for (let i = 0; i < count; i++) {
      glitterSparks.push(new GlitterSpark(x, y, true));
    }
  }

  function addGlitterTrail(x, y, count = 2) {
    for (let i = 0; i < count; i++) {
      glitterSparks.push(new GlitterSpark(x, y, false));
    }
  }

  window.addEventListener('mousemove', (e) => {
    addGlitterTrail(e.clientX, e.clientY, 1);
  });

  window.addEventListener('click', (e) => {
    addGlitterBurst(e.clientX, e.clientY, 25);
  });

  window.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches[0]) {
      addGlitterBurst(e.touches[0].clientX, e.touches[0].clientY, 20);
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      addGlitterTrail(e.touches[0].clientX, e.touches[0].clientY, 1);
    }
  }, { passive: true });

  function animateGlitter() {
    gctx.clearRect(0, 0, gWidth, gHeight);
    for (let i = glitterSparks.length - 1; i >= 0; i--) {
      const spark = glitterSparks[i];
      spark.update();
      spark.draw();
      if (spark.life <= 0) {
        glitterSparks.splice(i, 1);
      }
    }
    requestAnimationFrame(animateGlitter);
  }
  animateGlitter();

  /* ==================================================
     3. SCENE TRANSITION: INTRO -> ENVELOPE -> INVITATION
     ================================================== */
  const sceneIntro = document.getElementById('scene-intro');
  const sceneEnvelope = document.getElementById('scene-envelope');
  const mainInvitation = document.getElementById('main-invitation');
  const envelope3D = document.getElementById('envelope-3d');
  const waxSeal = document.getElementById('wax-seal');
  const openEnvelopeBtn = document.getElementById('open-envelope-btn');

  setTimeout(() => {
    if (sceneIntro) {
      sceneIntro.classList.add('fade-out');
      setTimeout(() => {
        sceneIntro.style.display = 'none';
        sceneEnvelope.classList.add('active-scene');
      }, 1100);
    }
  }, 2400);

  let isEnvelopeOpened = false;
  function triggerEnvelopeOpening() {
    if (isEnvelopeOpened) return;
    isEnvelopeOpened = true;

    waxSeal.classList.add('cracking');

    if (typeof confetti === 'function') {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.55 },
        colors: ['#ffd700', '#f4d03f', '#c0392b', '#ffffff']
      });
    }

    setTimeout(() => {
      envelope3D.classList.add('opened');
      sceneEnvelope.classList.add('opening-sequence');
      triggerPetalShower(30);
    }, 400);

    setTimeout(() => {
      sceneEnvelope.style.transition = 'opacity 1.2s ease, transform 1.2s ease';
      sceneEnvelope.style.opacity = '0';
      sceneEnvelope.style.transform = 'scale(1.08)';

      setTimeout(() => {
        sceneEnvelope.style.display = 'none';
        mainInvitation.classList.remove('main-invitation-hidden');
        mainInvitation.classList.add('main-invitation-revealed');
        document.body.classList.remove('loading-state');

        const coupleSection = document.getElementById('scene-couple');
        if (coupleSection) {
          coupleSection.scrollIntoView({ behavior: 'smooth' });
        }
        initScrollReveals();
      }, 1000);

    }, 2000);
  }

  if (waxSeal) waxSeal.addEventListener('click', triggerEnvelopeOpening);
  if (openEnvelopeBtn) openEnvelopeBtn.addEventListener('click', triggerEnvelopeOpening);

  /* ==================================================
     4. LIVE WEDDING COUNTDOWN (Dynamic to 23 Nov 2026 6PM IST)
     ================================================== */
  const daysEl = document.getElementById('days-count');
  const hoursEl = document.getElementById('hours-count');
  const minsEl = document.getElementById('minutes-count');
  const secsEl = document.getElementById('seconds-count');
  const statusMsgEl = document.getElementById('countdown-status-msg');

  const targetDate = new Date('2026-11-23T18:00:00+05:30').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      if (daysEl) daysEl.innerText = '00';
      if (hoursEl) hoursEl.innerText = '00';
      if (minsEl) minsEl.innerText = '00';
      if (secsEl) secsEl.innerText = '00';
      if (statusMsgEl) {
        statusMsgEl.innerHTML = '✨ Tonight We Celebrate Love & Joy! ✨';
        statusMsgEl.style.color = '#ffd700';
      }
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    if (daysEl) daysEl.innerText = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.innerText = String(hours).padStart(2, '0');
    if (minsEl) minsEl.innerText = String(mins).padStart(2, '0');
    if (secsEl) secsEl.innerText = String(secs).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ==================================================
     5. REAL INTERACTIVE CANVAS MYSTERY SCRATCH CARD (Reveals Date & Time Only)
     ================================================== */
  const scratchCanvas = document.getElementById('scratch-canvas');
  const scratchHint = document.getElementById('scratch-hint');
  const progressBar = document.getElementById('scratch-progress-bar');
  const progressText = document.getElementById('scratch-progress-text');
  const instantRevealBtn = document.getElementById('instant-reveal-btn');
  let scratchCtx, isScratching = false, isRevealedFully = false;

  if (scratchCanvas) {
    scratchCtx = scratchCanvas.getContext('2d', { willReadFrequently: true });
    initScratchFoil();

    function initScratchFoil() {
      const w = scratchCanvas.width;
      const h = scratchCanvas.height;

      const foilGrad = scratchCtx.createLinearGradient(0, 0, w, h);
      foilGrad.addColorStop(0, '#e5c158');
      foilGrad.addColorStop(0.25, '#fff4cc');
      foilGrad.addColorStop(0.5, '#d4af37');
      foilGrad.addColorStop(0.75, '#e8a598');
      foilGrad.addColorStop(1, '#b89326');
      
      scratchCtx.fillStyle = foilGrad;
      scratchCtx.fillRect(0, 0, w, h);

      scratchCtx.fillStyle = 'rgba(88, 12, 20, 0.12)';
      scratchCtx.font = 'bold 24px "Playfair Display", serif';
      for (let y = 30; y < h; y += 50) {
        for (let x = 20; x < w; x += 110) {
          scratchCtx.fillText('A ♡ D', x, y);
        }
      }

      scratchCtx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      scratchCtx.font = '18px serif';
      for (let y = 55; y < h; y += 50) {
        for (let x = 60; x < w; x += 110) {
          scratchCtx.fillText('✨ 🪷 💍', x, y);
        }
      }

      scratchCtx.fillStyle = 'rgba(70, 6, 14, 0.9)';
      scratchCtx.beginPath();
      scratchCtx.roundRect(w / 2 - 160, h / 2 - 45, 320, 90, 18);
      scratchCtx.fill();
      scratchCtx.strokeStyle = '#ffd700';
      scratchCtx.lineWidth = 2.5;
      scratchCtx.stroke();

      scratchCtx.fillStyle = '#fffdf5';
      scratchCtx.font = 'bold 17px "Cinzel", serif';
      scratchCtx.textAlign = 'center';
      scratchCtx.fillText('✨ SCRATCH TO REVEAL DATE ✨', w / 2, h / 2 - 10);

      scratchCtx.fillStyle = '#ffd700';
      scratchCtx.font = 'italic 13.5px "Cormorant Garamond", serif';
      scratchCtx.fillText('Touch or drag to reveal celebration date & time', w / 2, h / 2 + 18);
    }

    function getCanvasCoords(e) {
      const rect = scratchCanvas.getBoundingClientRect();
      const scaleX = scratchCanvas.width / rect.width;
      const scaleY = scratchCanvas.height / rect.height;
      let clientX, clientY;

      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
      };
    }

    function scratchAt(pos) {
      if (isRevealedFully) return;
      if (scratchHint && !scratchHint.classList.contains('hidden')) {
        scratchHint.classList.add('hidden');
      }

      scratchCtx.globalCompositeOperation = 'destination-out';
      scratchCtx.beginPath();
      scratchCtx.arc(pos.x, pos.y, 34, 0, Math.PI * 2);
      scratchCtx.fill();

      checkScratchPercentage();
    }

    function checkScratchPercentage() {
      if (isRevealedFully) return;
      
      const w = scratchCanvas.width;
      const h = scratchCanvas.height;
      const imgData = scratchCtx.getImageData(0, 0, w, h);
      const data = imgData.data;
      let transparentCount = 0;
      const step = 16;
      let totalSampled = 0;

      for (let i = 3; i < data.length; i += 4 * step) {
        totalSampled++;
        if (data[i] === 0) {
          transparentCount++;
        }
      }

      const percent = Math.round((transparentCount / totalSampled) * 100);
      if (progressBar) progressBar.style.width = `${percent}%`;
      if (progressText) progressText.innerText = `Scratched: ${percent}%`;

      if (percent >= 40) {
        celebrateReveal();
      }
    }

    function celebrateReveal() {
      if (isRevealedFully) return;
      isRevealedFully = true;

      scratchCanvas.classList.add('revealed-complete');
      if (progressBar) progressBar.style.width = '100%';
      if (progressText) progressText.innerText = 'Date Revealed! 🎉';
      if (instantRevealBtn) instantRevealBtn.style.display = 'none';

      // Hide teaser badge
      const teaserBadge = document.getElementById('scratch-unlock-teaser');
      if (teaserBadge) {
        teaserBadge.classList.add('hidden');
      }

      // Unlock and gradually reveal the Live Countdown Section
      const countdownSection = document.getElementById('scene-countdown');
      if (countdownSection) {
        countdownSection.classList.remove('countdown-locked-state');
        countdownSection.classList.add('countdown-unlocked');
        
        // Ensure child reveal items in countdown section animate in
        const revealItems = countdownSection.querySelectorAll('[data-reveal]');
        revealItems.forEach(item => item.classList.add('is-revealed'));

        // Smoothly scroll down to countdown section after a brief celebratory delay
        setTimeout(() => {
          countdownSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 1400);
      }

      if (typeof confetti === 'function') {
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#ffd700', '#ff6b81', '#ff4757', '#ffffff', '#e5c158']
        });
      }
      triggerPetalShower(30);
    }

    scratchCanvas.addEventListener('mousedown', (e) => {
      isScratching = true;
      scratchAt(getCanvasCoords(e));
    });

    scratchCanvas.addEventListener('mousemove', (e) => {
      if (!isScratching) return;
      scratchAt(getCanvasCoords(e));
    });

    window.addEventListener('mouseup', () => { isScratching = false; });
    scratchCanvas.addEventListener('mouseleave', () => { isScratching = false; });

    scratchCanvas.addEventListener('touchstart', (e) => {
      isScratching = true;
      scratchAt(getCanvasCoords(e));
    }, { passive: false });

    scratchCanvas.addEventListener('touchmove', (e) => {
      if (!isScratching) return;
      e.preventDefault();
      scratchAt(getCanvasCoords(e));
    }, { passive: false });

    scratchCanvas.addEventListener('touchend', () => { isScratching = false; });

    if (instantRevealBtn) {
      instantRevealBtn.addEventListener('click', celebrateReveal);
    }
  }

  /* ==================================================
     6. SCROLL REVEAL OBSERVER
     ================================================== */
  function initScrollReveals() {
    const revealEls = document.querySelectorAll('[data-reveal]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(el => observer.observe(el));
  }

  /* ==================================================
     7. ADD TO CALENDAR & .ICS GENERATOR
     ================================================== */
  window.addToGoogleCalendar = function() {
    const title = encodeURIComponent("Wedding Reception of Anik & Debaleena");
    const details = encodeURIComponent(
      "You are warmly invited to the Wedding Reception of Anik & Debaleena!\n\n" +
      "Venue: Bandhani Bayam Samity, 13, Gadadher Mistery Lane, Howrah-711104\n" +
      "Google Maps: https://maps.app.goo.gl/cSHd2HwhdN6tko2a7\n\n" +
      "Time: 6:00 PM Onwards"
    );
    const location = encodeURIComponent("Bandhani Bayam Samity, 13, Gadadher Mistery Lane, Howrah-711104");
    const dates = "20261123T123000Z/20261123T183000Z";
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
    window.open(url, '_blank');
  };

  window.downloadIcsFile = function() {
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Anik and Debaleena Wedding Reception//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      "UID:anik-debaleena-reception-20261123@wedding.com",
      "DTSTAMP:20260905T000000Z",
      "DTSTART:20261123T123000Z",
      "DTEND:20261123T183000Z",
      "SUMMARY:Wedding Reception of Anik & Debaleena",
      "DESCRIPTION:Together with their families, Anik & Debaleena invite you to celebrate their wedding reception at Bandhani Bayam Samity, 13, Gadadher Mistery Lane, Howrah-711104.",
      "LOCATION:Bandhani Bayam Samity, 13, Gadadher Mistery Lane, Howrah-711104",
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'Anik_Debaleena_Wedding_Reception.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  window.openGoogleMaps = function() {
    window.open('https://maps.app.goo.gl/cSHd2HwhdN6tko2a7', '_blank');
  };

  /* ==================================================
     8. MOBILE NAVIGATION TOGGLE
     ================================================== */
  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navToggleIcon = document.getElementById('nav-toggle-icon');

  if (mobileNavToggle && navMenu) {
    mobileNavToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.toggle('nav-menu-open');
      mobileNavToggle.setAttribute('aria-expanded', String(isOpen));
      if (navToggleIcon) {
        if (isOpen) {
          navToggleIcon.classList.remove('fa-bars');
          navToggleIcon.classList.add('fa-xmark');
        } else {
          navToggleIcon.classList.remove('fa-xmark');
          navToggleIcon.classList.add('fa-bars');
        }
      }
    });

    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('nav-menu-open');
        mobileNavToggle.setAttribute('aria-expanded', 'false');
        if (navToggleIcon) {
          navToggleIcon.classList.remove('fa-xmark');
          navToggleIcon.classList.add('fa-bars');
        }
      });
    });

    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileNavToggle.contains(e.target)) {
        navMenu.classList.remove('nav-menu-open');
        mobileNavToggle.setAttribute('aria-expanded', 'false');
        if (navToggleIcon) {
          navToggleIcon.classList.remove('fa-xmark');
          navToggleIcon.classList.add('fa-bars');
        }
      }
    });
  }

});
