document.addEventListener('DOMContentLoaded', () => {

  
  const langDropdown = document.getElementById('lang-dropdown');
  const langToggleBtn = document.getElementById('lang-toggle');
  const langOptions = document.querySelectorAll('.lang-opt');

  function initLanguage() {
    const savedLang = localStorage.getItem('portfolio-lang');
    const systemPrefersEn = navigator.language.startsWith('en');
    const systemPrefersDe = navigator.language.startsWith('de');
    const systemPrefersZh = navigator.language.startsWith('zh');
    const systemPrefersRu = navigator.language.startsWith('ru');

    let initialLang = 'tr';
    if (savedLang) {
      initialLang = savedLang;
    } else if (systemPrefersEn) {
      initialLang = 'en';
    } else if (systemPrefersDe) {
      initialLang = 'de';
    } else if (systemPrefersZh) {
      initialLang = 'zh';
    } else if (systemPrefersRu) {
      initialLang = 'ru';
    }

    setLanguage(initialLang);
  }

  function setLanguage(lang) {
    document.documentElement.lang = lang;
    document.documentElement.classList.remove('lang-en', 'lang-de', 'lang-zh', 'lang-ru');

    if (lang === 'en') {
      document.documentElement.classList.add('lang-en');
    } else if (lang === 'de') {
      document.documentElement.classList.add('lang-de');
    } else if (lang === 'zh') {
      document.documentElement.classList.add('lang-zh');
    } else if (lang === 'ru') {
      document.documentElement.classList.add('lang-ru');
    }

    localStorage.setItem('portfolio-lang', lang);
    updateLangBtnText(lang.toUpperCase());
    updatePlaceholders();
    updateDropdownActiveState(lang);

    
    if (typingTextElement) {
      charIndex = 0;
      isDeleting = false;
      typingTextElement.textContent = '';
    }
  }

  function updateLangBtnText(lang) {
    if (langToggleBtn) {
      const activeSpan = langToggleBtn.querySelector('.active-lang');
      if (activeSpan) activeSpan.textContent = lang;
    }
  }

  function updateDropdownActiveState(lang) {
    langOptions.forEach(opt => {
      if (opt.getAttribute('data-lang-val') === lang) {
        opt.classList.add('selected');
      } else {
        opt.classList.remove('selected');
      }
    });
  }

  function updatePlaceholders() {
    const isEn = document.documentElement.classList.contains('lang-en');
    const isDe = document.documentElement.classList.contains('lang-de');
    const isZh = document.documentElement.classList.contains('lang-zh');
    const isRu = document.documentElement.classList.contains('lang-ru');
    const inputs = document.querySelectorAll('[data-placeholder-tr]');
    inputs.forEach(input => {
      const trPlaceholder = input.getAttribute('data-placeholder-tr');
      const enPlaceholder = input.getAttribute('data-placeholder-en');
      const dePlaceholder = input.getAttribute('data-placeholder-de');
      const zhPlaceholder = input.getAttribute('data-placeholder-zh');
      const ruPlaceholder = input.getAttribute('data-placeholder-ru');

      let placeholder = trPlaceholder;
      if (isEn) {
        placeholder = enPlaceholder;
      } else if (isDe) {
        placeholder = dePlaceholder;
      } else if (isZh) {
        placeholder = zhPlaceholder;
      } else if (isRu) {
        placeholder = ruPlaceholder || enPlaceholder;
      }
      input.setAttribute('placeholder', placeholder);
    });
  }

  
  if (langToggleBtn && langDropdown) {
    langToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      langDropdown.classList.toggle('open');
    });
  }

  
  langOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      const selectedLang = opt.getAttribute('data-lang-val');
      setLanguage(selectedLang);
      if (langDropdown) langDropdown.classList.remove('open');
    });
  });

  
  document.addEventListener('click', (e) => {
    if (langDropdown && !langDropdown.contains(e.target)) {
      langDropdown.classList.remove('open');
    }
  });

  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const header = document.querySelector('header');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.classList.toggle('nav-active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.classList.remove('nav-active');
    });
  });

  let sectionOffsets = [];
  let offsetsCalculated = false;

  function calculateOffsets() {
    sectionOffsets = [];
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      sectionOffsets.push({
        id: section.getAttribute('id'),
        top: section.offsetTop,
        height: section.clientHeight
      });
    });
    offsetsCalculated = true;
  }

  window.addEventListener('resize', () => {
    if (offsetsCalculated) {
      calculateOffsets();
    }
  });

  window.addEventListener('scroll', () => {
    if (!offsetsCalculated) {
      calculateOffsets();
    }

    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    let current = '';
    for (let i = 0; i < sectionOffsets.length; i++) {
      if (window.scrollY >= (sectionOffsets[i].top - 200)) {
        current = sectionOffsets[i].id;
      }
    }

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('active');
      }
    });
  });

  const typingTextElement = document.getElementById('typing-text');

  function getRoles() {
    if (document.documentElement.classList.contains('lang-en')) {
      return [
        "Cybersecurity Specialist"
      ];
    } else if (document.documentElement.classList.contains('lang-de')) {
      return [
        "Spezialist für Cybersicherheit."
      ];
    } else if (document.documentElement.classList.contains('lang-zh')) {
      return [
        "网络安全专家。"
      ];
    } else if (document.documentElement.classList.contains('lang-ru')) {
      return [
        "Специалист по кибербезопасности"
      ];
    } else {
      return [
        "Siber Güvenlik Uzmanı"
      ];
    }
  }

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeEffect() {
    const currentRoles = getRoles();
    const currentRole = currentRoles[roleIndex % currentRoles.length];

    if (isDeleting) {

      typingTextElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {

      typingTextElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 120;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % currentRoles.length;
      typingSpeed = 500;
    }

    setTimeout(typeEffect, typingSpeed);
  }

  if (typingTextElement) {
    typeEffect();
  }

  
  initLanguage();

  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let packetsArray = [];
    let radarAngle = 0;

    const colors = ['#0d9488', '#0284c7', '#10b981'];
    const cyberTerms = ['SECURE', '80', '443', 'EDR', 'API', 'LOG', 'NET', 'APT', '22', '445', '3389', 'CVE', '2FA', 'SQL', 'EPP', 'FW', 'NDR', 'VPN', 'NAC', 'PAM', 'C2'];

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const mouse = {
      x: null,
      y: null,
      radius: 130
    };

    window.addEventListener('mousemove', (event) => {
      mouse.x = event.x;
      mouse.y = event.y;
    });

    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    class DataPacket {
      constructor(startNode, endNode) {
        this.startNode = startNode;
        this.endNode = endNode;
        this.progress = 0;
        this.speed = Math.random() * 0.015 + 0.005;
      }

      update() {
        this.progress += this.speed;
      }

      draw() {
        if (this.progress > 1) return;

        const x = this.startNode.x + (this.endNode.x - this.startNode.x) * this.progress;
        const y = this.startNode.y + (this.endNode.y - this.startNode.y) * this.progress;

        let isSecure = false;
        if (mouse.x !== null && mouse.y !== null) {
          let dx = mouse.x - x;
          let dy = mouse.y - y;
          if (Math.sqrt(dx * dx + dy * dy) < mouse.radius) {
            isSecure = true;
          }
        }

        ctx.fillStyle = isSecure ? '#10b981' : '#0284c7';
        ctx.shadowBlur = 10;
        ctx.shadowColor = isSecure ? '#10b981' : '#0284c7';

        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
      }
    }

    class Particle {
      constructor(labelType = 'none', assignedTerm = null) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1.2;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.color = colors[Math.floor(Math.random() * colors.length)];

        this.labelType = labelType;
        if (labelType === 'term') {
          this.cyberTerm = assignedTerm;
          if (assignedTerm === 'APT') {
            this.color = '#ef4444'; 
          }
        }
        this.binaryVal = Math.random() < 0.5 ? '0' : '1';
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
        if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;

        if (mouse.x != null && mouse.y != null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            this.x -= dx * force * 0.02;
            this.y -= dy * force * 0.02;
          }
        }
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        if (this.labelType !== 'none') {
          ctx.font = '8px monospace';
          const isDarkMode = document.body.classList.contains('dark-mode');
          ctx.fillStyle = isDarkMode ? 'rgba(20, 184, 166, 0.4)' : 'rgba(13, 148, 136, 0.55)';

          if (this.labelType === 'binary') {
            ctx.fillText(this.binaryVal, this.x + 8, this.y + 3);

            if (Math.random() < 0.003) {
              this.binaryVal = this.binaryVal === '0' ? '1' : '0';
            }
          } else if (this.labelType === 'term') {
            ctx.fillText(this.cyberTerm, this.x + 8, this.y + 3);
          }
        }
      }
    }

    function init() {
      particlesArray = [];
      packetsArray = [];
      const numberOfParticles = Math.min((canvas.width * canvas.height) / 11500, 90);

      
      const remainingTerms = cyberTerms.filter(t => t !== 'APT');
      const shuffledTerms = [...remainingTerms].sort(() => Math.random() - 0.5);
      shuffledTerms.unshift('APT'); 

      let termIndex = 0;

      for (let i = 0; i < numberOfParticles; i++) {
        let labelType = 'none';
        let term = null;

        if (i === 0 && numberOfParticles > 0) {
          
          labelType = 'term';
          term = shuffledTerms[termIndex++];
        } else {
          const rand = Math.random();
          if (rand < 0.25 && termIndex < shuffledTerms.length) {
            labelType = 'term';
            term = shuffledTerms[termIndex++];
          } else if (rand < 0.25 + 0.35) { 
            labelType = 'binary';
          } else {
            labelType = 'none'; 
          }
        }

        particlesArray.push(new Particle(labelType, term));
      }
    }
    init();
    window.addEventListener('resize', init);

    function connect() {
      let opacityValue = 1;
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a + 1; b < particlesArray.length; b++) {
          let dx = particlesArray[a].x - particlesArray[b].x;
          let dy = particlesArray[a].y - particlesArray[b].y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 110) {
            opacityValue = 1 - (distance / 110);

            let isSecuredLine = false;
            if (mouse.x !== null && mouse.y !== null) {
              let dxMouseA = mouse.x - particlesArray[a].x;
              let dyMouseA = mouse.y - particlesArray[a].y;
              let distMouseA = Math.sqrt(dxMouseA * dxMouseA + dyMouseA * dyMouseA);

              let dxMouseB = mouse.x - particlesArray[b].x;
              let dyMouseB = mouse.y - particlesArray[b].y;
              let distMouseB = Math.sqrt(dxMouseB * dxMouseB + dyMouseB * dyMouseB);

              if (distMouseA < mouse.radius || distMouseB < mouse.radius) {
                isSecuredLine = true;
              }
            }

            const isDarkMode = document.body.classList.contains('dark-mode');
            if (isSecuredLine) {
              ctx.strokeStyle = isDarkMode
                ? `rgba(16, 185, 129, ${opacityValue * 0.35})`
                : `rgba(5, 150, 105, ${opacityValue * 0.6})`;
              ctx.lineWidth = isDarkMode ? 1.2 : 1.4;
            } else {
              ctx.strokeStyle = isDarkMode
                ? `rgba(13, 148, 136, ${opacityValue * 0.16})`
                : `rgba(13, 148, 136, ${opacityValue * 0.35})`;
              ctx.lineWidth = isDarkMode ? 0.8 : 1.0;
            }

            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }

      connect();

      if (packetsArray.length < 12 && Math.random() < 0.015) {
        const closeNodes = [];
        for (let a = 0; a < particlesArray.length; a++) {
          for (let b = a + 1; b < particlesArray.length; b++) {
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 110) {
              closeNodes.push({ a: particlesArray[a], b: particlesArray[b] });
            }
          }
        }
        if (closeNodes.length > 0) {
          const pair = closeNodes[Math.floor(Math.random() * closeNodes.length)];
          packetsArray.push(new DataPacket(pair.a, pair.b));
        }
      }

      for (let i = packetsArray.length - 1; i >= 0; i--) {
        packetsArray[i].update();
        packetsArray[i].draw();

        if (packetsArray[i].progress > 1) {
          packetsArray.splice(i, 1);
        }
      }

      if (mouse.x !== null && mouse.y !== null) {
        const isDarkMode = document.body.classList.contains('dark-mode');

        ctx.strokeStyle = isDarkMode ? 'rgba(16, 185, 129, 0.12)' : 'rgba(5, 150, 105, 0.28)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2);
        ctx.stroke();

        radarAngle += 0.012;
        ctx.strokeStyle = isDarkMode ? 'rgba(16, 185, 129, 0.22)' : 'rgba(5, 150, 105, 0.42)';
        ctx.lineWidth = isDarkMode ? 1 : 1.2;
        ctx.beginPath();
        ctx.moveTo(mouse.x, mouse.y);
        ctx.lineTo(
          mouse.x + Math.cos(radarAngle) * mouse.radius,
          mouse.y + Math.sin(radarAngle) * mouse.radius
        );
        ctx.stroke();

        ctx.strokeStyle = isDarkMode ? 'rgba(16, 185, 129, 0.08)' : 'rgba(5, 150, 105, 0.2)';
        ctx.beginPath();
        ctx.moveTo(mouse.x - 10, mouse.y);
        ctx.lineTo(mouse.x + 10, mouse.y);
        ctx.moveTo(mouse.x, mouse.y - 10);
        ctx.lineTo(mouse.x, mouse.y + 10);
        ctx.stroke();
      }

      requestAnimationFrame(animate);
    }
    animate();
  }

  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  const progressBars = document.querySelectorAll('.skill-progress-bar');

  function animateProgressBars() {
    progressBars.forEach(bar => {
      const progress = bar.getAttribute('data-progress');
      bar.style.width = progress;
    });
  }

  setTimeout(animateProgressBars, 300);

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.getAttribute('id') === targetTab) {
          content.classList.add('active');

          if (targetTab === 'skills') {
            progressBars.forEach(bar => bar.style.width = '0');
            setTimeout(animateProgressBars, 100);
          }
        }
      });
    });
  });

  const cards = document.querySelectorAll('.project-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const cardRect = card.getBoundingClientRect();
      const cardWidth = cardRect.width;
      const cardHeight = cardRect.height;

      const mouseX = e.clientX - cardRect.left - cardWidth / 2;
      const mouseY = e.clientY - cardRect.top - cardHeight / 2;

      const rotateX = -(mouseY / cardHeight) * 16;
      const rotateY = (mouseX / cardWidth) * 16;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filterValue = btn.getAttribute('data-filter');

      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');

        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.8)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  const modalTriggers = document.querySelectorAll('.project-card');
  const modalCloses = document.querySelectorAll('.modal-close');
  const modalBgCloses = document.querySelectorAll('.modal-overlay');
  const modalBtnCloses = document.querySelectorAll('.modal-btn-close');

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      const projectId = trigger.getAttribute('data-project-id');
      const targetModal = document.getElementById(`modal-${projectId}`);
      if (targetModal) {
        targetModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeModal() {
    const activeModals = document.querySelectorAll('.modal.active');
    activeModals.forEach(modal => {
      modal.classList.remove('active');
    });
    document.body.style.overflow = 'auto';
  }

  modalCloses.forEach(closeBtn => {
    closeBtn.addEventListener('click', closeModal);
  });

  modalBgCloses.forEach(bg => {
    bg.addEventListener('click', closeModal);
  });

  modalBtnCloses.forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });

  const contactForm = document.getElementById('portfolio-contact-form');
  const formResponseStatus = document.getElementById('form-response-status');

  if (contactForm) {
    function getFormMessage(key) {
      const isEn = document.documentElement.classList.contains('lang-en');
      const isDe = document.documentElement.classList.contains('lang-de');
      const isZh = document.documentElement.classList.contains('lang-zh');

      const messages = {
        sending: isEn ? "Sending..." : (isDe ? "Wird gesendet..." : (isZh ? "发送中..." : "Gönderiliyor...")),
        success: isEn ? "Your message has been sent successfully! I will get back to you soon." : (isDe ? "Ihre Nachricht wurde erfolgreich gesendet! Ich werde mich in Kürze bei Ihnen melden." : (isZh ? "您的留言已成功发送！我会尽快回复您。" : "Mesajınız başarıyla iletildi! En kısa sürede geri döneceğim.")),
        networkError: isEn ? "A network error occurred. Please check your connection and try again." : (isDe ? "Ein Netzwerkfehler ist aufgetreten. Bitte überprüfen Sie Ihre Verbindung und versuchen Sie es erneut." : (isZh ? "网络发生错误，请检查您的连接并重试。" : "Bir ağ bağlantısı hatası oluştu. Lütfen bağlantınızı kontrol edip tekrar deneyin.")),
        serverError: isEn ? "A server error occurred while sending your message." : (isDe ? "Beim Senden Ihrer Nachricht ist ein Serverfehler aufgetreten." : (isZh ? "发送消息时服务器发生错误。" : "Mesajınız gönderilirken bir sunucu hatası oluştu.")),
        defaultError: isEn ? "Your message could not be delivered. Please try again later." : (isDe ? "Ihre Nachricht konnte nicht zugestellt werden. Bitte versuchen Sie es später noch einmal." : (isZh ? "您的消息未能送达，请稍后重试。" : "Mesajınız iletilemedi. Lütfen daha sonra tekrar deneyiniz."))
      };
      return messages[key];
    }

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span>${getFormMessage('sending')}</span>
        <svg class="spinner" viewBox="0 0 50 50" width="18" height="18" fill="none" stroke="currentColor" stroke-width="5" style="animation: spin 1s infinite linear;">
          <circle cx="25" cy="25" r="20" stroke-dasharray="80 200" stroke-dashoffset="0"></circle>
        </svg>
      `;

      if (!document.getElementById('spinner-style')) {
        const style = document.createElement('style');
        style.id = 'spinner-style';
        style.textContent = `
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          .spinner circle { stroke-linecap: round; }
        `;
        document.head.appendChild(style);
      }

      function showError(msg) {
        if (formResponseStatus) {
          formResponseStatus.className = "form-status error";
          formResponseStatus.textContent = msg;
          formResponseStatus.style.display = "block";

          setTimeout(() => {
            formResponseStatus.style.display = "none";
          }, 6000);
        }
      }

      const formData = new FormData(contactForm);

      fetch(contactForm.action || 'https://formspree.io/f/mjgzeewj', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
        .then(response => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;

          if (response.ok) {
            contactForm.reset();
            if (formResponseStatus) {
              formResponseStatus.className = "form-status success";
              formResponseStatus.textContent = getFormMessage('success');
              formResponseStatus.style.display = "block";

              setTimeout(() => {
                formResponseStatus.style.display = "none";
              }, 6000);
            }
          } else {
            response.json().then(data => {
              if (data && data.errors) {
                const isEn = document.documentElement.classList.contains('lang-en');
                const isDe = document.documentElement.classList.contains('lang-de');
                const isZh = document.documentElement.classList.contains('lang-zh');
                const errorMsg = data.errors.map(err => {
                  if (isEn) {
                    return `${err.field}: ${err.message}`;
                  } else if (isDe) {
                    let fieldName = err.field === 'email' ? 'E-Mail' : (err.field === 'message' ? 'Nachricht' : (err.field === 'name' ? 'Name' : err.field));
                    let msg = err.message;
                    if (msg === 'must be a valid email address') msg = 'muss eine gültige E-Mail-Adresse sein';
                    if (msg === 'is required') msg = 'ist erforderlich';
                    return `${fieldName} ${msg}`;
                  } else if (isZh) {
                    let fieldName = err.field === 'email' ? '电子邮箱' : (err.field === 'message' ? '留言内容' : (err.field === 'name' ? '姓名' : err.field));
                    let msg = err.message;
                    if (msg === 'must be a valid email address') msg = '必须是有效的电子邮箱地址';
                    if (msg === 'is required') msg = '是必填项';
                    return `${fieldName}${msg}`;
                  } else {
                    let fieldName = err.field === 'email' ? 'E-posta' : (err.field === 'message' ? 'Mesaj' : (err.field === 'name' ? 'Ad Soyad' : err.field));
                    let msg = err.message;
                    if (msg === 'must be a valid email address') msg = 'geçerli bir e-posta adresi olmalıdır';
                    if (msg === 'is required') msg = 'zorunludur';
                    return `${fieldName} ${msg}`;
                  }
                }).join(', ');

                let prefix = 'Form hatası';
                if (isEn) prefix = 'Form error';
                else if (isDe) prefix = 'Formfehler';
                else if (isZh) prefix = '表单错误';
                showError(`${prefix}: ${errorMsg}`);
              } else {
                showError(getFormMessage('defaultError'));
              }
            }).catch(() => {
              showError(getFormMessage('serverError'));
            });
          }
        })
        .catch(error => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
          showError(getFormMessage('networkError'));
        });
    });
  }

  const revealElements = document.querySelectorAll('.reveal');

  const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');

        if (entry.target.id === 'about') {
          setTimeout(animateProgressBars, 200);
        }

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });

  revealElements.forEach(element => {
    revealOnScroll.observe(element);
  });

  const themeToggleBtn = document.getElementById('theme-toggle');

  const savedTheme = localStorage.getItem('portfolio-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');

      if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('portfolio-theme', 'dark');
      } else {
        localStorage.setItem('portfolio-theme', 'light');
      }
    });
  }

  const easterEggTrigger = document.getElementById('easter-egg-trigger');
  const gamePanel = document.getElementById('game-panel');
  if (easterEggTrigger && gamePanel) {
    const originalGameHTML = gamePanel.innerHTML;
    let health = 100;
    let score = 0;
    let activeAlert = null;
    let alerts = [];
    let alertsInterval = null;
    let gameLoopActive = false;
    let nextAlertId = 1;

    const threatLibraryTR = [
      {
        type: 'critical',
        title: 'Mimikatz Bellek Taraması',
        desc: 'LSA sırları ve parola karmalarını elde etmek için bellek taraması (mimikatz.exe) tespit edildi.',
        source: 'Uç Nokta: DB-SUNUCU-01',
        category: 'EDR'
      },
      {
        type: 'critical',
        title: 'WannaCry Ransomware',
        desc: 'Uç noktada dosyalar şifreleniyor ve .wnry uzantılı şifreli dosyalar oluşturuluyor.',
        source: 'Uç Nokta: YONETICI-PC',
        category: 'EDR'
      },
      {
        type: 'high',
        title: 'Yetkisiz PowerShell Komutu',
        desc: 'Gizlenmiş (obfuscated) powershell.exe komut satırı parametreleri yürütüldü.',
        source: 'Uç Nokta: KULLANICI-12',
        category: 'EDR'
      },
      {
        type: 'high',
        title: 'DDoS SYN Flood',
        desc: 'Harici bir IP adresinden web sunucusuna saniyede 15.000 adet TCP SYN paketi gönderiliyor.',
        source: 'Ağ Arayüzü: Dış Bacak-FW',
        category: 'FW'
      },
      {
        type: 'high',
        title: 'SQL Injection Girişimi',
        desc: 'Müşteri sorgu ekranından SQL veritabanını bozmaya yönelik UNION SELECT enjeksiyonu denendi.',
        source: 'WAF: Uygulama Sunucusu',
        category: 'FW'
      },
      {
        type: 'medium',
        title: 'Şüpheli Port Taraması',
        desc: 'Tek bir kaynak IP adresinden sırayla tüm TCP portlarına yönelik SYN taraması yapılıyor.',
        source: 'Firewall: İç Ağ Ağ Geçidi',
        category: 'FW'
      },
      {
        type: 'high',
        title: 'Mesai Dışı Yönetici Girişi',
        desc: 'Gece saat 03:15\'te Domain Admin yetkisine sahip bir hesap ile yetkisiz oturum açıldı.',
        source: 'Active Directory: Domain Controller',
        category: 'AD'
      },
      {
        type: 'medium',
        title: 'Kaba Kuvvet (Brute Force) Başarısı',
        desc: 'Aynı kullanıcı hesabına 45 başarısız denemeden sonra başarılı bir giriş saptandı.',
        source: 'Active Directory: Domain Controller',
        category: 'AD'
      },
      {
        type: 'medium',
        title: 'Kerberoasting Girişimi',
        desc: 'Servis hesapları için olağan dışı sayıda Kerberos TGS bilet isteği yapıldığı tespit edildi.',
        source: 'Active Directory: Domain Controller',
        category: 'AD'
      },
      {
        type: 'info',
        title: 'Planlı Günlük Yedekleme',
        desc: 'Veritabanı sunucusunda planlı yedekleme scripti çalıştırıldı ve arşiv diski ile senkronize edildi.',
        source: 'Yedekleme Sunucusu',
        category: 'SOC'
      },
      {
        type: 'info',
        title: 'BT Güvenlik Taraması',
        desc: 'Onaylı Nessus IP adresinden rutin iç zafiyet taraması gerçekleştiriliyor.',
        source: 'Zafiyet Tarayıcı: Nessus-01',
        category: 'SOC'
      },
      {
        type: 'info',
        title: 'Sunucu Sağlık Kontrolü',
        desc: 'Zabbix izleme aracı tarafından servislerin yanıt süreleri kontrol ediliyor.',
        source: 'İzleme Sunucusu: Zabbix',
        category: 'SOC'
      }
    ];

    const threatLibraryEN = [
      {
        type: 'critical',
        title: 'Mimikatz Memory Dump',
        desc: 'Active memory scan (mimikatz.exe) detected to extract LSA secrets and password hashes.',
        source: 'Endpoint: DB-SERVER-01',
        category: 'EDR'
      },
      {
        type: 'critical',
        title: 'WannaCry Ransomware',
        desc: 'Files are being encrypted on the endpoint; encrypted files with the .wnry extension are being created.',
        source: 'Endpoint: ADMIN-PC',
        category: 'EDR'
      },
      {
        type: 'high',
        title: 'Unauthorized PowerShell Command',
        desc: 'Obfuscated powershell.exe command-line parameters were executed.',
        source: 'Endpoint: USER-12',
        category: 'EDR'
      },
      {
        type: 'high',
        title: 'DDoS SYN Flood',
        desc: '15,000 TCP SYN packets per second are being sent to the web server from an external IP address.',
        source: 'Network Interface: Outer-FW',
        category: 'FW'
      },
      {
        type: 'high',
        title: 'SQL Injection Attempt',
        desc: 'UNION SELECT injection attempted through the customer query panel to breach the SQL database.',
        source: 'WAF: Application Server',
        category: 'FW'
      },
      {
        type: 'medium',
        title: 'Suspicious Port Scan',
        desc: 'Consecutive SYN port scans target all TCP ports from a single source IP address.',
        source: 'Firewall: Internal Gateway',
        category: 'FW'
      },
      {
        type: 'high',
        title: 'After-Hours Admin Login',
        desc: 'Unauthorized domain administrator session established at 03:15 AM.',
        source: 'Active Directory: Domain Controller',
        category: 'AD'
      },
      {
        type: 'medium',
        title: 'Successful Brute Force',
        desc: 'Successful authentication detected after 45 consecutive failed attempts on the same user account.',
        source: 'Active Directory: Domain Controller',
        category: 'AD'
      },
      {
        type: 'medium',
        title: 'Kerberoasting Attempt',
        desc: 'Anomalous number of Kerberos TGS ticket requests detected for service accounts.',
        source: 'Active Directory: Domain Controller',
        category: 'AD'
      },
      {
        type: 'info',
        title: 'Scheduled Backup Logs',
        desc: 'Scheduled backup script ran on database server and synchronized with archiving disk.',
        source: 'Backup Server',
        category: 'SOC'
      },
      {
        type: 'info',
        title: 'IT Vulnerability Scan',
        desc: 'Routine internal vulnerability scan initiated from authorized Nessus scanner IP.',
        source: 'Vulnerability Scanner: Nessus-01',
        category: 'SOC'
      },
      {
        type: 'info',
        title: 'Server Health Check',
        desc: 'Zabbix monitoring tool checking service response times and disk space metrics.',
        source: 'Monitoring Server: Zabbix',
        category: 'SOC'
      }
    ];

    const threatLibraryDE = [
      {
        type: 'critical',
        title: 'Mimikatz-Speicherabbild',
        desc: 'Aktiver Arbeitsspeicherscan (mimikatz.exe) zur Extraktion von LSA-Geheimnissen und Passwort-Hashes erkannt.',
        source: 'Endpunkt: DB-SERVER-01',
        category: 'EDR'
      },
      {
        type: 'critical',
        title: 'WannaCry Ransomware',
        desc: 'Dateien auf dem Endpunkt werden verschlüsselt; verschlüsselte Dateien mit der Endung .wnry werden erstellt.',
        source: 'Endpunkt: ADMIN-PC',
        category: 'EDR'
      },
      {
        type: 'high',
        title: 'Nicht autorisierter PowerShell-Befehl',
        desc: 'Verschleierte (obfuscated) powershell.exe Befehlszeilenparameter wurden ausgeführt.',
        source: 'Endpunkt: BENUTZER-12',
        category: 'EDR'
      },
      {
        type: 'high',
        title: 'DDoS SYN Flood',
        desc: '15.000 TCP-SYN-Pakete pro Sekunde werden von einer externen IP-Adresse an den Webserver gesendet.',
        source: 'Netzwerkschnittstelle: External-FW',
        category: 'FW'
      },
      {
        type: 'high',
        title: 'SQL-Injection-Versuch',
        desc: 'UNION SELECT-Injektion über das Kundenabfrage-Panel versucht, um die SQL-Datenbank zu kompromittieren.',
        source: 'WAF: Anwendungsserver',
        category: 'FW'
      },
      {
        type: 'medium',
        title: 'Verdächtiger Portscan',
        desc: 'Aufeinanderfolgende SYN-Portscans zielen von einer einzelnen Quell-IP-Adresse auf alle TCP-Ports ab.',
        source: 'Firewall: Internes Gateway',
        category: 'FW'
      },
      {
        type: 'high',
        title: 'Admin-Anmeldung nach Feierabend',
        desc: 'Nicht autorisierte Domain-Administrator-Sitzung um 03:15 Uhr morgens aufgebaut.',
        source: 'Active Directory: Domain Controller',
        category: 'AD'
      },
      {
        type: 'medium',
        title: 'Erfolgreicher Brute-Force-Angriff',
        desc: 'Erfolgreiche Authentifizierung nach 45 aufeinanderfolgenden fehlgeschlagenen Versuchen für dasselbe Benutzerkonto erkannt.',
        source: 'Active Directory: Domain Controller',
        category: 'AD'
      },
      {
        type: 'medium',
        title: 'Kerberoasting-Versuch',
        desc: 'Ungewöhnliche Anzahl von Kerberos-TGS-Ticketanforderungen für Dienstkonten erkannt.',
        source: 'Active Directory: Domain Controller',
        category: 'AD'
      },
      {
        type: 'info',
        title: 'Geplantes Backup-Protokoll',
        desc: 'Geplantes Backup-Skript lief auf dem Datenbankserver und wurde mit der Archivierungsfestplatte synchronisiert.',
        source: 'Backup-Server',
        category: 'SOC'
      },
      {
        type: 'info',
        title: 'IT-Schwachstellenscan',
        desc: 'Routinemäßiger interner Schwachstellenscan von einer autorisierten Nessus-Scanner-IP initiiert.',
        source: 'Schwachstellen-Scanner: Nessus-01',
        category: 'SOC'
      },
      {
        type: 'info',
        title: 'Server-Gesundheitscheck',
        desc: 'Zabbix-Überwachungstool überprüft Dienstantwortzeiten und Festplattenspeicher-Metriken.',
        source: 'Überwachungsserver: Zabbix',
        category: 'SOC'
      }
    ];

    const threatLibraryZH = [
      {
        type: 'critical',
        title: 'Mimikatz 内存转储',
        desc: '检测到活动内存扫描 (mimikatz.exe) 以提取 LSA 机密和密码哈希。',
        source: '端点: DB-SERVER-01',
        category: 'EDR'
      },
      {
        type: 'critical',
        title: 'WannaCry 勒索软件',
        desc: '端点上的文件正在被加密；正在生成扩展名为 .wnry 的加密文件。',
        source: '端点: ADMIN-PC',
        category: 'EDR'
      },
      {
        type: 'high',
        title: '未经授权的 PowerShell 命令',
        desc: '执行了混淆的 powershell.exe 命令行参数。',
        source: '端点: USER-12',
        category: 'EDR'
      },
      {
        type: 'high',
        title: 'DDoS SYN Flood',
        desc: '每秒向 Web 服务器发送 15,000 个来自外部 IP 地址的 TCP SYN 包。',
        source: '网络接口: 外部防火墙',
        category: 'FW'
      },
      {
        type: 'high',
        title: 'SQL 注入企图',
        desc: '尝试通过客户查询面板进行 UNION SELECT 注入，以破坏 SQL 数据库。',
        source: 'WAF: 应用服务器',
        category: 'FW'
      },
      {
        type: 'medium',
        title: '可疑端口扫描',
        desc: '来自单个源 IP 地址 of 连续 SYN 端口扫描指向所有 TCP 端口。',
        source: '防火墙: 内网网关',
        category: 'FW'
      },
      {
        type: 'high',
        title: '非工作时间管理员登录',
        desc: '凌晨 03:15 建立了未经授权的域管理员会话。',
        source: '活动目录: 域控制器',
        category: 'AD'
      },
      {
        type: 'medium',
        title: '暴力破解成功',
        desc: '在同一用户账号连续 45 次尝试失败后，检测到成功登录。',
        source: '活动目录: 域控制器',
        category: 'AD'
      },
      {
        type: 'medium',
        title: 'Kerberoasting 企图',
        desc: '检测到服务账号的异常数量的 Kerberos TGS 票证请求。',
        source: '活动目录: 域控制器',
        category: 'AD'
      },
      {
        type: 'info',
        title: '计划备份日志',
        desc: '在数据库服务器上运行了计划备份脚本，并与归档磁盘同步。',
        source: '备份服务器',
        category: 'SOC'
      },
      {
        type: 'info',
        title: 'IT 漏洞扫描',
        desc: '从授权的 Nessus 扫描器 IP 发起例行内部漏洞扫描。',
        source: '漏洞扫描器: Nessus-01',
        category: 'SOC'
      },
      {
        type: 'info',
        title: '服务器健康检查',
        desc: 'Zabbix 监控工具正在检查服务响应时间和磁盘空间指标。',
        source: '监控服务器: Zabbix',
        category: 'SOC'
      }
    ];

    const threatLibraryRU = [
      {
        type: 'critical',
        title: 'Дамп памяти Mimikatz',
        desc: 'Обнаружено сканирование оперативной памяти (mimikatz.exe) для извлечения LSA-секретов и хэшей паролей.',
        source: 'Узел: DB-SERVER-01',
        category: 'EDR'
      },
      {
        type: 'critical',
        title: 'Шифровальщик WannaCry',
        desc: 'На узле происходит шифрование файлов; создаются зашифрованные файлы с расширением .wnry.',
        source: 'Узел: ADMIN-PC',
        category: 'EDR'
      },
      {
        type: 'high',
        title: 'Несанкционированная команда PowerShell',
        desc: 'Выполнены обфусцированные параметры командной строки powershell.exe.',
        source: 'Узел: USER-12',
        category: 'EDR'
      },
      {
        type: 'high',
        title: 'DDoS SYN Flood',
        desc: 'На веб-сервер отправляется 15 000 пакетов TCP SYN в секунду с внешнего IP-адреса.',
        source: 'Сетевой интерфейс: Внешний-FW',
        category: 'FW'
      },
      {
        type: 'high',
        title: 'Попытка SQL-инъекции',
        desc: 'Попытка UNION SELECT инъекции через форму поиска клиентов для компрометации базы данных SQL.',
        source: 'WAF: Сервер приложений',
        category: 'FW'
      },
      {
        type: 'medium',
        title: 'Подозрительное сканирование портов',
        desc: 'Последовательное SYN-сканирование всех портов TCP с одного исходного IP-адреса.',
        source: 'Брандмауэр: Внутренний шлюз',
        category: 'FW'
      },
      {
        type: 'high',
        title: 'Вход администратора во внерабочее время',
        desc: 'Установлен несанкционированный сеанс администратора домена в 03:15 ночи.',
        source: 'Active Directory: Контроллер домена',
        category: 'AD'
      },
      {
        type: 'medium',
        title: 'Успешный подбор пароля (Brute Force)',
        desc: 'Обнаружена успешная аутентификация после 45 последовательных неудачных попыток входа под одной учетной записью.',
        source: 'Active Directory: Контроллер домена',
        category: 'AD'
      },
      {
        type: 'medium',
        title: 'Попытка атаки Kerberoasting',
        desc: 'Обнаружено аномальное количество запросов билетов Kerberos TGS для служебных учетных записей.',
        source: 'Active Directory: Контроллер домена',
        category: 'AD'
      },
      {
        type: 'info',
        title: 'Запланированное резервное копирование',
        desc: 'На сервере баз данных запущен скрипт резервного копирования и синхронизации с архивным диском.',
        source: 'Сервер бэкапа',
        category: 'SOC'
      },
      {
        type: 'info',
        title: 'Сканирование уязвимостей IT',
        desc: 'Запущено плановое сканирование внутренней сети с авторизованного IP-адреса сканера Nessus.',
        source: 'Сканер уязвимостей: Nessus-01',
        category: 'SOC'
      },
      {
        type: 'info',
        title: 'Мониторинг здоровья серверов',
        desc: 'Инструмент мониторинга Zabbix проверяет время отклика сервисов и объем свободного места на дисках.',
        source: 'Сервер мониторинга: Zabbix',
        category: 'SOC'
      }
    ];

    function addGameLog(text, isError = false, isSuccess = false) {
      const logArea = document.getElementById('game-terminal-log');
      if (!logArea) return;
      const logLine = document.createElement('div');
      if (isError) logLine.style.color = '#ef4444';
      if (isSuccess) logLine.style.color = '#10b981';
      const time = new Date().toTimeString().split(' ')[0];
      logLine.textContent = `[${time}] ${text}`;
      logArea.appendChild(logLine);
      logArea.scrollTop = logArea.scrollHeight;
    }

    function shakeGame() {
      gamePanel.classList.add('shake');
      setTimeout(() => {
        gamePanel.classList.remove('shake');
      }, 300);
    }

    function updateHUD() {
      const hBar = document.getElementById('game-health');
      const sVal = document.getElementById('game-score');
      if (hBar) hBar.style.width = `${health}%`;
      if (sVal) sVal.textContent = score;
    }

    function selectAlert(alertObj) {
      if (!gameLoopActive) return;
      activeAlert = alertObj;
      const listItems = document.querySelectorAll('.alert-item');
      listItems.forEach(item => {
        item.classList.remove('active');
        if (parseInt(item.getAttribute('data-id')) === alertObj.id) {
          item.classList.add('active');
        }
      });

      const detailsBox = document.getElementById('active-alert-details');
      if (detailsBox) {
        const isEn = document.documentElement.classList.contains('lang-en');
        const isDe = document.documentElement.classList.contains('lang-de');
        const isZh = document.documentElement.classList.contains('lang-zh');
        const isRu = document.documentElement.classList.contains('lang-ru');

        let labelDesc = 'Açıklama';
        if (isEn) labelDesc = 'Description';
        else if (isDe) labelDesc = 'Beschreibung';
        else if (isZh) labelDesc = '描述';
        else if (isRu) labelDesc = 'Описание';

        let labelSource = 'Kaynak';
        if (isEn) labelSource = 'Source';
        else if (isDe) labelSource = 'Quelle';
        else if (isZh) labelSource = '来源';
        else if (isRu) labelSource = 'Источник';

        detailsBox.innerHTML = `
          <div class="details-content">
            <div class="details-header">
              <span class="details-title">${alertObj.title}</span>
              <span class="alert-type ${alertObj.type}">${alertObj.type.toUpperCase()}</span>
            </div>
            <div class="details-grid" style="display: flex; flex-direction: column; gap: 0.6rem; width: 100%;">
              <div class="detail-field">
                <span class="detail-lbl">${labelDesc}</span>
                <span class="detail-val" style="color: #cbd5e1; font-family: var(--font-body); font-size: 0.82rem; line-height: 1.4;">${alertObj.desc}</span>
              </div>
              <div class="detail-field">
                <span class="detail-lbl">${labelSource}</span>
                <span class="detail-val">${alertObj.source}</span>
              </div>
            </div>
          </div>
        `;
      }

      ['btn-edr', 'btn-fw', 'btn-ad', 'btn-soc'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.disabled = false;
      });
    }

    function deselectAlert() {
      activeAlert = null;
      const detailsBox = document.getElementById('active-alert-details');
      if (detailsBox) {
        const isEn = document.documentElement.classList.contains('lang-en');
        const isDe = document.documentElement.classList.contains('lang-de');
        const isZh = document.documentElement.classList.contains('lang-zh');
        const isRu = document.documentElement.classList.contains('lang-ru');

        let promptText = 'Lütfen müdahale etmek için sol listeden aktif bir alarm seçin.';
        if (isEn) promptText = 'Please select an active alert from the left panel to mitigate.';
        else if (isDe) promptText = 'Bitte wählen Sie einen aktiven Alarm aus dem linken Panel aus, um ihn abzuwehren.';
        else if (isZh) promptText = '请从左侧面板选择一个活动告警进行处置。';
        else if (isRu) promptText = 'Пожалуйста, выберите активный аларм из списка слева для реагирования.';
        detailsBox.innerHTML = `<p class="select-prompt">${promptText}</p>`;
      }
      ['btn-edr', 'btn-fw', 'btn-ad', 'btn-soc'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.disabled = true;
      });
    }

    function generateAlert() {
      if (!gameLoopActive || alerts.length >= 5) return;
      const isEn = document.documentElement.classList.contains('lang-en');
      const isDe = document.documentElement.classList.contains('lang-de');
      const isZh = document.documentElement.classList.contains('lang-zh');
      const isRu = document.documentElement.classList.contains('lang-ru');
      let activeLibrary = threatLibraryTR;
      if (isEn) activeLibrary = threatLibraryEN;
      else if (isDe) activeLibrary = threatLibraryDE;
      else if (isZh) activeLibrary = threatLibraryZH;
      else if (isRu) activeLibrary = threatLibraryRU;

      const baseThreat = activeLibrary[Math.floor(Math.random() * activeLibrary.length)];
      const newAlert = {
        id: nextAlertId++,
        ...baseThreat,
        remainingTime: 30
      };

      alerts.push(newAlert);

      const alertListContainer = document.getElementById('game-alerts-list');
      if (alertListContainer) {
        const item = document.createElement('div');
        item.className = `alert-item ${newAlert.type}`;
        item.setAttribute('data-id', newAlert.id);
        item.innerHTML = `
          <div class="alert-item-header">
            <span class="alert-type">${newAlert.type.toUpperCase()}</span>
            <span class="alert-time">30s</span>
          </div>
          <div class="alert-msg">${newAlert.title}</div>
          <div class="alert-timer-bar">
            <div class="alert-timer-fill" style="width: 100%;"></div>
          </div>
        `;

        item.addEventListener('click', () => {
          selectAlert(newAlert);
        });

        alertListContainer.appendChild(item);

        let logText = `YENİ ALARM: ${newAlert.title} [Sınıf: ${newAlert.type.toUpperCase()}]`;
        if (isEn) logText = `NEW ALERT: ${newAlert.title} [Class: ${newAlert.type.toUpperCase()}]`;
        else if (isDe) logText = `NEUER ALARM: ${newAlert.title} [Klasse: ${newAlert.type.toUpperCase()}]`;
        else if (isZh) logText = `新告警: ${newAlert.title} [级别: ${newAlert.type.toUpperCase()}]`;
        else if (isRu) logText = `НОВЫЙ АЛАРМ: ${newAlert.title} [Класс: ${newAlert.type.toUpperCase()}]`;
        addGameLog(logText);

        const timerInterval = setInterval(() => {
          if (!gameLoopActive) {
            clearInterval(timerInterval);
            return;
          }

          newAlert.remainingTime -= 0.1;
          const percentage = (newAlert.remainingTime / 30) * 100;
          const fill = item.querySelector('.alert-timer-fill');
          const timeText = item.querySelector('.alert-time');

          if (fill) fill.style.width = `${percentage}%`;
          if (timeText) timeText.textContent = `${Math.ceil(newAlert.remainingTime)}s`;

          if (newAlert.remainingTime <= 4) {
            item.classList.add('urgent-blink');
          }

          if (newAlert.remainingTime <= 0) {
            clearInterval(timerInterval);
            handleAlertLeak(newAlert);
          }
        }, 100);

        newAlert.timerId = timerInterval;
      }
    }

    function removeAlertFromList(alertId) {
      alerts = alerts.filter(a => {
        if (a.id === alertId) {
          if (a.timerId) clearInterval(a.timerId);
          return false;
        }
        return true;
      });

      const element = document.querySelector(`.alert-item[data-id="${alertId}"]`);
      if (element) element.remove();
    }

    function handleAlertLeak(alertObj) {
      removeAlertFromList(alertObj.id);
      health -= 20;
      if (health < 0) health = 0;
      updateHUD();
      const isEn = document.documentElement.classList.contains('lang-en');
      const isDe = document.documentElement.classList.contains('lang-de');
      const isZh = document.documentElement.classList.contains('lang-zh');
      const isRu = document.documentElement.classList.contains('lang-ru');
      let breachText = `[SIZMA] ${alertObj.title} tehdidine zamanında müdahale edilemedi! (%20 Sağlık Hasarı)`;
      if (isEn) breachText = `[BREACH] ${alertObj.title} was not mitigated in time! (20% Health Damage)`;
      else if (isDe) breachText = `[SICHERHEITSLÜCKE] ${alertObj.title} wurde nicht rechtzeitig abgewehrt! (20% Systemschaden)`;
      else if (isZh) breachText = `[安全漏洞] 未能及时处置 ${alertObj.title} 威胁！（系统健康度受到 20% 伤害）`;
      else if (isRu) breachText = `[УТЕЧКА] Угроза ${alertObj.title} не была отражена вовремя! (Урон здоровью системы: 20%)`;
      addGameLog(breachText, true);
      shakeGame();

      if (activeAlert && activeAlert.id === alertObj.id) {
        deselectAlert();
      }

      if (health <= 0) {
        triggerGameOver();
      }
    }

    function handleMitigate(category) {
      if (!activeAlert || !gameLoopActive) return;
      const currentAlert = activeAlert;
      const isEn = document.documentElement.classList.contains('lang-en');
      const isDe = document.documentElement.classList.contains('lang-de');
      const isZh = document.documentElement.classList.contains('lang-zh');
      const isRu = document.documentElement.classList.contains('lang-ru');
      if (currentAlert.category === category) {
        score += 10;
        updateHUD();
        let successText = `[BAŞARILI] ${currentAlert.title} tehdidi ${category} ile bertaraf edildi! (+10 Skor)`;
        if (isEn) successText = `[SUCCESS] ${currentAlert.title} mitigated with ${category}! (+10 Score)`;
        else if (isDe) successText = `[ERFOLG] ${currentAlert.title} wurde erfolgreich mit ${category} abgewehrt! (+10 Punkte)`;
        else if (isZh) successText = `[成功] 已成功通过 ${category} 处置 ${currentAlert.title} 威胁！（+10 分）`;
        else if (isRu) successText = `[УСПЕХ] Угроза ${currentAlert.title} успешно отражена с помощью ${category}! (+10 очков)`;
        addGameLog(successText, false, true);
        removeAlertFromList(currentAlert.id);
        deselectAlert();
      } else {
        health -= 10;
        if (health < 0) health = 0;
        updateHUD();
        let errorText = `[HATA] ${currentAlert.title} için yanlış müdahale uygulandı! (%10 Sağlık Hasarı)`;
        if (isEn) errorText = `[ERROR] Incorrect mitigation applied for ${currentAlert.title}! (10% Health Damage)`;
        else if (isDe) errorText = `[FEHLER] Falsche Abwehr für ${currentAlert.title} angewendet! (10% Systemschaden)`;
        else if (isZh) errorText = `[错误] 对 ${currentAlert.title} 采取了错误的处置动作！（系统健康度受到 10% 伤害）`;
        else if (isRu) errorText = `[ОШИБКА] Неверные меры приняты для ${currentAlert.title}! (Урон здоровью системы: 10%)`;
        addGameLog(errorText, true);
        shakeGame();
        if (health <= 0) {
          triggerGameOver();
        }
      }
    }

    function triggerGameOver() {
      gameLoopActive = false;
      if (alertsInterval) clearInterval(alertsInterval);
      alerts.forEach(a => {
        if (a.timerId) clearInterval(a.timerId);
      });
      alerts = [];

      const bodyContainer = gamePanel.querySelector('.game-body');
      if (bodyContainer) {
        const isEn = document.documentElement.classList.contains('lang-en');
        const isDe = document.documentElement.classList.contains('lang-de');
        const isZh = document.documentElement.classList.contains('lang-zh');
        const isRu = document.documentElement.classList.contains('lang-ru');

        let gameOverTitle = "SİSTEM SIZMA LİMİTİNE ULAŞTI";
        let gameOverDesc = "Kritik sunucular ve veri tabanı sistemleri ele geçirildi. Güvenlik operasyon merkezi başarısız oldu.";
        let statLabelScore = "SKOR";
        let statLabelLevel = "SEVİYE";
        let restartBtnText = "KONSOLU YENİDEN BAŞLAT";

        if (isEn) {
          gameOverTitle = "SYSTEM COMPROMISED";
          gameOverDesc = "Critical servers and database systems have been breached. Security Operations Center failed to mitigate the threats.";
          statLabelScore = "SCORE";
          statLabelLevel = "LEVEL";
          restartBtnText = "RESTART CONSOLE";
        } else if (isDe) {
          gameOverTitle = "SYSTEM KOMPROMITTIERT";
          gameOverDesc = "Kritische Server und Datenbanksysteme wurden kompromittiert. Das Security Operations Center konnte die Bedrohungen nicht rechtzeitig abwehren.";
          statLabelScore = "SCORE";
          statLabelLevel = "LEVEL";
          restartBtnText = "KONSOLE NEUSTARTEN";
        } else if (isZh) {
          gameOverTitle = "系统已被入侵";
          gameOverDesc = "关键服务器和数据库系统已被攻破。安全运营中心未能成功阻止威胁。";
          statLabelScore = "得分";
          statLabelLevel = "等级";
          restartBtnText = "重新启动控制台";
        } else if (isRu) {
          gameOverTitle = "СИСТЕМА СКОМПРОМЕТИРОВАНА";
          gameOverDesc = "Критические серверы и базы данных были взломаны. Центр мониторинга безопасности (SOC) не справился с угрозами.";
          statLabelScore = "СЧЕТ";
          statLabelLevel = "УРОВЕНЬ";
          restartBtnText = "ПЕРЕЗАПУСТИТЬ КОНСОЛЬ";
        }

        gamePanel.innerHTML = `
          <div class="game-over-screen">
            <h3 class="game-over-title">${gameOverTitle}</h3>
            <p class="game-over-desc">${gameOverDesc}</p>
            <div class="game-over-stats">
              <div class="game-over-stat">
                <span class="stat-lbl">${statLabelScore}</span>
                <span class="stat-val" style="color: var(--accent-pink);">${score}</span>
              </div>
              <div class="game-over-stat">
                <span class="stat-lbl">${statLabelLevel}</span>
                <span class="stat-val" style="color: var(--accent-secondary);">${Math.floor(score / 50) + 1}</span>
              </div>
            </div>
            <button class="btn btn-primary" id="game-restart-btn">${restartBtnText}</button>
          </div>
        `;

        const restartBtn = document.getElementById('game-restart-btn');
        if (restartBtn) {
          restartBtn.addEventListener('click', () => {
            gamePanel.innerHTML = originalGameHTML;
            restartGame();
          });
        }
      }
    }

    function restartGame() {
      health = 100;
      score = 0;
      activeAlert = null;
      alerts = [];
      gameLoopActive = true;
      nextAlertId = 1;

      updateHUD();
      deselectAlert();
      bindActionButtons();

      const isEn = document.documentElement.classList.contains('lang-en');
      const isDe = document.documentElement.classList.contains('lang-de');
      const isZh = document.documentElement.classList.contains('lang-zh');
      const isRu = document.documentElement.classList.contains('lang-ru');
      let bootText = 'Güvenlik operasyon protokolü aktifleşti. Tehditleri bertaraf edin.';
      if (isEn) bootText = 'Security operations protocol active. Mitigate threats.';
      else if (isDe) bootText = 'Sicherheitsbetriebsprotokoll aktiv. Wehren Sie Bedrohungen ab.';
      else if (isZh) bootText = '安全运营协议已启动。请处置传入的威胁。';
      else if (isRu) bootText = 'Протокол операций безопасности активен. Отражайте угрозы.';
      addGameLog(bootText);

      for (let i = 0; i < 2; i++) {
        generateAlert();
      }

      alertsInterval = setInterval(generateAlert, 5000);
    }

    function bindActionButtons() {
      const btnEdr = document.getElementById('btn-edr');
      const btnFw = document.getElementById('btn-fw');
      const btnAd = document.getElementById('btn-ad');
      const btnSoc = document.getElementById('btn-soc');

      if (btnEdr) btnEdr.addEventListener('click', () => handleMitigate('EDR'));
      if (btnFw) btnFw.addEventListener('click', () => handleMitigate('FW'));
      if (btnAd) btnAd.addEventListener('click', () => handleMitigate('AD'));
      if (btnSoc) btnSoc.addEventListener('click', () => handleMitigate('SOC'));
    }

    const gameModal = document.getElementById('game-modal');
    const gameModalClose = document.getElementById('game-modal-close');
    const gameModalOverlay = document.getElementById('game-modal-overlay');

    const stopAndCloseGame = () => {
      triggerGameOver();
      if (gameModal) {
        gameModal.classList.remove('active');
      }
      document.body.style.overflow = 'auto';
    };

    if (gameModalClose) {
      gameModalClose.addEventListener('click', stopAndCloseGame);
    }
    if (gameModalOverlay) {
      gameModalOverlay.addEventListener('click', stopAndCloseGame);
    }

    
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && gameModal && gameModal.classList.contains('active')) {
        stopAndCloseGame();
      }
    });

    easterEggTrigger.addEventListener('click', () => {
      if (gameModal) {
        gameModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
      gamePanel.classList.remove('hidden');

      if (!gameLoopActive && health === 100 && score === 0 && alerts.length === 0) {
        restartGame();
      }
    });
  }

  
  function initCyberPanda() {
    const pandaContainer = document.createElement('div');
    pandaContainer.className = 'cyber-panda-container';

    const pandaImg = document.createElement('img');
    pandaImg.src = 'images/ikon.png';
    pandaImg.alt = 'SecPanda';
    pandaImg.className = 'cyber-panda-img';

    const scanline = document.createElement('div');
    scanline.className = 'cyber-panda-scanline';

    const bubble = document.createElement('div');
    bubble.className = 'cyber-panda-bubble';

    pandaContainer.appendChild(bubble);
    pandaContainer.appendChild(pandaImg);
    pandaContainer.appendChild(scanline);
    document.body.appendChild(pandaContainer);

    const quotesTr = [
      "guest@guven.sec:~$ scan",
      "[!] OVERRIDE_DETECTED",
      "[?] Down: init_override?",
      "[!] terminal_at_bottom: RUN",
      "guest@guven.sec:~$ run game",
      "[!] SECURE_PROTOCOL_OFFLINE"
    ];

    const quotesEn = [
      "guest@guven.sec:~$ scan",
      "[!] OVERRIDE_DETECTED",
      "[?] Down: init_override?",
      "[!] terminal_at_bottom: RUN",
      "guest@guven.sec:~$ run game",
      "[!] SECURE_PROTOCOL_OFFLINE"
    ];

    const quotesDe = [
      "guest@guven.sec:~$ scan",
      "[!] OVERRIDE_DETECTED",
      "[?] Down: init_override?",
      "[!] terminal_at_bottom: RUN",
      "guest@guven.sec:~$ run game",
      "[!] SECURE_PROTOCOL_OFFLINE"
    ];

    const quotesZh = [
      "guest@guven.sec:~$ scan",
      "[!] OVERRIDE_DETECTED",
      "[?] Down: init_override?",
      "[!] terminal_at_bottom: RUN",
      "guest@guven.sec:~$ run game",
      "[!] SECURE_PROTOCOL_OFFLINE"
    ];

    const quotesRu = [
      "guest@guven.sec:~$ scan",
      "[!] OVERRIDE_DETECTED",
      "[?] Down: init_override?",
      "[!] terminal_at_bottom: RUN",
      "guest@guven.sec:~$ run game",
      "[!] SECURE_PROTOCOL_OFFLINE"
    ];

    function getRandomQuote() {
      const isEn = document.documentElement.classList.contains('lang-en');
      const isDe = document.documentElement.classList.contains('lang-de');
      const isZh = document.documentElement.classList.contains('lang-zh');
      const isRu = document.documentElement.classList.contains('lang-ru');

      let list = quotesTr;
      if (isEn) list = quotesEn;
      else if (isDe) list = quotesDe;
      else if (isZh) list = quotesZh;
      else if (isRu) list = quotesRu;

      return list[Math.floor(Math.random() * list.length)];
    }

    let isWalking = false;
    let walkFromLeft = false;
    let currentX = 0;
    let targetX = 0;
    let speed = 0;
    let trailInterval;

    function startTrail() {
      trailInterval = setInterval(() => {
        if (!isWalking) return;
        const rect = pandaContainer.getBoundingClientRect();

        const particle = document.createElement('span');
        particle.className = 'cyber-panda-trail';
        particle.textContent = Math.random() < 0.5 ? '0' : '1';

        particle.style.left = `${rect.left + rect.width / 2}px`;
        particle.style.bottom = `${window.innerHeight - rect.bottom + 10}px`;

        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 1200);
      }, 150);
    }

    function stopTrail() {
      clearInterval(trailInterval);
    }

    function walkPanda() {
      if (isWalking) return;
      isWalking = true;

      walkFromLeft = Math.random() < 0.5;

      const distance = window.innerWidth + 200;
      const durationSeconds = Math.random() * 4 + 14;
      speed = distance / (durationSeconds * 60);

      currentX = walkFromLeft ? -150 : window.innerWidth + 50;
      targetX = walkFromLeft ? window.innerWidth + 50 : -150;

      pandaImg.style.transform = walkFromLeft ? "scaleX(1)" : "scaleX(-1)";
      scanline.style.transform = walkFromLeft ? "scaleX(1)" : "scaleX(-1)";

      pandaContainer.style.left = `${currentX}px`;
      pandaContainer.classList.add('is-walking');

      bubble.textContent = getRandomQuote();
      bubble.classList.add('is-visible');

      startTrail();

      let lastQuoteTime = Date.now();

      function step() {
        if (!isWalking) return;

        let arrived = false;
        if (walkFromLeft) {
          currentX += speed;
          if (currentX >= targetX) arrived = true;
        } else {
          currentX -= speed;
          if (currentX <= targetX) arrived = true;
        }

        pandaContainer.style.left = `${currentX}px`;

        if (Date.now() - lastQuoteTime > 3500) {
          bubble.textContent = getRandomQuote();
          bubble.classList.add('is-visible');
          lastQuoteTime = Date.now();

          setTimeout(() => {
            if (isWalking && Date.now() - lastQuoteTime > 3000) {
              bubble.classList.remove('is-visible');
            }
          }, 2500);
        }

        if (!arrived) {
          requestAnimationFrame(step);
        } else {
          isWalking = false;
          pandaContainer.style.left = '';
          pandaContainer.classList.remove('is-walking');
          bubble.classList.remove('is-visible');
          stopTrail();

          setTimeout(walkPanda, Math.random() * 45000 + 45000);
        }
      }

      requestAnimationFrame(step);
    }

    window.addEventListener('resize', () => {
      if (isWalking) {
        if (walkFromLeft) {
          targetX = window.innerWidth + 50;
        }
      } else {
        pandaContainer.style.left = '';
      }
    });

    setTimeout(walkPanda, 12000);
  }

  initCyberPanda();

});
