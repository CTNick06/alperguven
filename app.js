document.addEventListener('DOMContentLoaded', () => {

  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const header = document.querySelector('header');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    let current = '';
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 200)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('active');
      }
    });
  });

  const typingTextElement = document.getElementById('typing-text');
  const roles = [
    "Siber Güvenlik Uzmanı."
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeEffect() {
    const currentRole = roles[roleIndex];

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
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500;
    }

    setTimeout(typeEffect, typingSpeed);
  }

  if (typingTextElement) {
    typeEffect();
  }

  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let packetsArray = [];
    let radarAngle = 0;

    const colors = ['#0d9488', '#0284c7', '#10b981'];

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
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1.2;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.color = colors[Math.floor(Math.random() * colors.length)];

        this.labelType = Math.random() < 0.25 ? 'binary' : (Math.random() < 0.08 ? 'term' : 'none');
        this.binaryVal = Math.random() < 0.5 ? '0' : '1';

        const cyberTerms = ['SECURE', 'PORT_80', 'FW_PASS', 'EDR_OK', 'API_CONN', 'LOG_OK', 'SSL_VAL', 'NET_CONNECTED', 'MorTeam_Active'];
        this.cyberTerm = cyberTerms[Math.floor(Math.random() * cyberTerms.length)];
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
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
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
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span>Gönderiliyor...</span>
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

      setTimeout(() => {
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;

        if (formResponseStatus) {
          formResponseStatus.className = "form-status success";
          formResponseStatus.textContent = "Mesajınız başarıyla iletildi! En kısa sürede geri döneceğim.";
          formResponseStatus.style.display = "block";

          setTimeout(() => {
            formResponseStatus.style.display = "none";
          }, 6000);
        }
      }, 1500);
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

    const threatLibrary = [
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
        detailsBox.innerHTML = `
          <div class="details-content">
            <div class="details-header">
              <span class="details-title">${alertObj.title}</span>
              <span class="alert-type ${alertObj.type}">${alertObj.type.toUpperCase()}</span>
            </div>
            <div class="details-grid" style="display: flex; flex-direction: column; gap: 0.6rem; width: 100%;">
              <div class="detail-field">
                <span class="detail-lbl">Açıklama</span>
                <span class="detail-val" style="color: #cbd5e1; font-family: var(--font-body); font-size: 0.82rem; line-height: 1.4;">${alertObj.desc}</span>
              </div>
              <div class="detail-field">
                <span class="detail-lbl">Kaynak</span>
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
        detailsBox.innerHTML = '<p class="select-prompt">Lütfen müdahale etmek için sol listeden aktif bir alarm seçin.</p>';
      }
      ['btn-edr', 'btn-fw', 'btn-ad', 'btn-soc'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.disabled = true;
      });
    }

    function generateAlert() {
      if (!gameLoopActive || alerts.length >= 5) return;
      const baseThreat = threatLibrary[Math.floor(Math.random() * threatLibrary.length)];
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
        addGameLog(`YENİ ALARM: ${newAlert.title} [Sınıf: ${newAlert.type.toUpperCase()}]`);

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
      addGameLog(`[SIZMA] ${alertObj.title} tehdidine zamanında müdahale edilemedi! (%20 Sağlık Hasarı)`, true);
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
      if (currentAlert.category === category) {
        score += 10;
        updateHUD();
        addGameLog(`[BAŞARILI] ${currentAlert.title} tehdidi ${category} ile bertaraf edildi! (+10 Skor)`, false, true);
        removeAlertFromList(currentAlert.id);
        deselectAlert();
      } else {
        health -= 10;
        if (health < 0) health = 0;
        updateHUD();
        addGameLog(`[HATA] ${currentAlert.title} için yanlış müdahale uygulandı! (%10 Sağlık Hasarı)`, true);
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
        gamePanel.innerHTML = `
          <div class="game-over-screen">
            <h3 class="game-over-title">SİSTEM SIZMA LİMİTİNE ULAŞTI</h3>
            <p class="game-over-desc">Kritik sunucular ve veri tabanı sistemleri ele geçirildi. Güvenlik operasyon merkezi başarısız oldu.</p>
            <div class="game-over-stats">
              <div class="game-over-stat">
                <span class="stat-lbl">SKOR</span>
                <span class="stat-val" style="color: var(--accent-pink);">${score}</span>
              </div>
              <div class="game-over-stat">
                <span class="stat-lbl">SEVİYE</span>
                <span class="stat-val" style="color: var(--accent-secondary);">${Math.floor(score / 50) + 1}</span>
              </div>
            </div>
            <button class="btn btn-primary" id="game-restart-btn">KONSOLU YENİDEN BAŞLAT</button>
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

      addGameLog('Güvenlik operasyon protokolü aktifleşti. Tehditleri bertaraf edin.');

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

    easterEggTrigger.addEventListener('click', () => {
      gamePanel.classList.remove('hidden');
      gamePanel.scrollIntoView({ behavior: 'smooth', block: 'start' });

      if (!gameLoopActive && health === 100 && score === 0 && alerts.length === 0) {
        restartGame();
      }
    });
  }

});
