document.addEventListener('DOMContentLoaded', () => {
  fetch('data.json')
    .then(res => res.json())
    .then(data => {
      // --- Site Meta ---
      document.title = data.siteMeta.title;
      const logoEl = document.querySelector('.logo');
      if (logoEl) logoEl.innerHTML = data.siteMeta.logo + '<span>' + data.siteMeta.logoHighlight + '</span>';
      const footerEl = document.querySelector('footer');
      if (footerEl) footerEl.innerHTML = data.siteMeta.footerText;

      // --- Hero ---
      const heroBadge = document.querySelector('.hero .badge');
      if (heroBadge) heroBadge.innerHTML = data.hero.badge;
      
      const heroH1 = document.querySelector('.hero h1');
      if (heroH1) heroH1.innerHTML = data.hero.namePrefix + '<span>' + data.hero.nameHighlight + '</span>';
      
      const heroTagline = document.querySelector('.hero .tagline');
      if (heroTagline) heroTagline.innerHTML = data.hero.tagline;

      // --- About ---
      const aboutDesc = document.querySelector('#about .section-desc');
      if (aboutDesc) aboutDesc.innerHTML = data.about.description;
      
      const aboutCards = document.querySelectorAll('#about .card');
      data.about.cards.forEach((c, i) => {
        if(aboutCards[i]) {
          aboutCards[i].querySelector('.icon').innerHTML = c.icon;
          aboutCards[i].querySelector('h3').innerHTML = c.title;
          aboutCards[i].querySelector('p').innerHTML = c.description;
        }
      });

      // --- Skills ---
      const skillsGrid = document.querySelector('.skills-grid');
      if (skillsGrid) {
        skillsGrid.innerHTML = '';
        data.skills.forEach(skill => {
          const card = document.createElement('div');
          card.className = 'skill-card';
          if (skill.fullWidth) card.style.gridColumn = '1 / -1';
          
          let badgesHTML = '';
          skill.badges.forEach(b => {
            badgesHTML += `<span class="skill-badge">${b}</span>`;
          });

          card.innerHTML = `
            <h3>${skill.title}</h3>
            <div class="skill-badges">
              ${badgesHTML}
            </div>
          `;
          skillsGrid.appendChild(card);
        });
      }

      // --- Experience ---
      const timeline = document.querySelector('.timeline');
      if (timeline) {
        timeline.innerHTML = '';
        data.experience.forEach(exp => {
          const item = document.createElement('div');
          item.className = 'timeline-item';
          
          let tasksHTML = '<ul>';
          exp.tasks.forEach(t => {
            tasksHTML += `<li>${t}</li>`;
          });
          tasksHTML += '</ul>';

          item.innerHTML = `
            <div class="timeline-dot"></div>
            <div class="timeline-header">
              <div class="timeline-title">
                <h3>${exp.company}</h3>
                <h4>${exp.role}</h4>
              </div>
              <span class="timeline-date">${exp.date}</span>
            </div>
            <div class="timeline-body">
              ${tasksHTML}
            </div>
          `;
          timeline.appendChild(item);
        });
      }

      // --- Portfolio ---
      const portfolioGrid = document.querySelector('#portfolio .grid');
      if (portfolioGrid) {
        portfolioGrid.innerHTML = '';
        data.portfolio.forEach(p => {
          const card = document.createElement('div');
          card.className = 'card';
          card.innerHTML = `
            <div class="portfolio-img">${p.imageText}</div>
            <h3>${p.title}</h3>
            <p style="color: var(--neon); font-size: 0.9rem; margin-bottom: 8px; font-weight: 600;">${p.role}</p>
            <p>${p.description}</p>
          `;
          portfolioGrid.appendChild(card);
        });
      }

      // --- Education & Certs ---
      const eduCard = document.querySelector('.edu-card:nth-child(1)');
      if (eduCard) {
        eduCard.innerHTML = `
          <h3>Học vấn chính quy</h3>
          <div class="edu-item">
            <h4>${data.education.degree}</h4>
            <p>${data.education.school}</p>
            <p style="color: var(--neon); font-size: 0.95rem; font-weight: 600; margin-top: 4px;">${data.education.years}</p>
          </div>
        `;
      }

      const certCard = document.querySelector('.edu-card:nth-child(2)');
      if (certCard) {
        let certsHTML = `<h3>Chứng chỉ chuyên môn</h3>`;
        data.certifications.forEach(c => {
          certsHTML += `
            <div class="cert-item">
              <div class="cert-icon">${c.icon}</div>
              <div class="cert-info">
                <h4>${c.title}</h4>
                <p>${c.year}</p>
              </div>
            </div>
          `;
        });
        certCard.innerHTML = certsHTML;
      }

      // --- Contact ---
      const contactBox = document.querySelector('.contact-box');
      if (contactBox) {
        contactBox.innerHTML = `
          <h2 class="section-title">Kết nối làm việc</h2>
          <p>${data.contact.description}</p>
          <a href="mailto:${data.contact.email}" class="btn btn-primary">${data.contact.email}</a>
        `;
      }
      
      const phoneRing = document.querySelector('.phone-ring');
      if (phoneRing) {
        phoneRing.href = `tel:${data.contact.phone}`;
      }
    })
    .catch(err => console.error("Could not load data.json", err));
});
