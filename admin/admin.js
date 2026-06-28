document.addEventListener('DOMContentLoaded', () => {
  const loginPanel = document.getElementById('login-panel');
  const appContent = document.getElementById('app-content');
  const userInfo = document.getElementById('user-info');
  
  const loginBtn = document.getElementById('login-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const saveBtn = document.getElementById('save-btn');
  
  let currentSha = null;
  let currentJson = {};

  // Tab switching logic
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.target).classList.add('active');
    });
  });

  // Restore from localStorage
  if (localStorage.getItem('gh_token')) {
    document.getElementById('gh-owner').value = localStorage.getItem('gh_owner');
    document.getElementById('gh-repo').value = localStorage.getItem('gh_repo');
    document.getElementById('gh-branch').value = localStorage.getItem('gh_branch');
    document.getElementById('gh-token').value = localStorage.getItem('gh_token');
    
    if (localStorage.getItem('gh_token')) {
      login();
    }
  }

  loginBtn.addEventListener('click', login);
  
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('gh_token');
    loginPanel.style.display = 'block';
    appContent.style.display = 'none';
    userInfo.style.display = 'none';
    document.getElementById('gh-token').value = '';
  });

  saveBtn.addEventListener('click', saveContent);

  function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const msg = document.getElementById('toast-msg');
    toast.className = `toast ${type} show`;
    msg.innerHTML = message;
    setTimeout(() => { toast.className = 'toast'; }, 4000);
  }

  async function login() {
    const owner = document.getElementById('gh-owner').value.trim();
    const repo = document.getElementById('gh-repo').value.trim();
    const branch = document.getElementById('gh-branch').value.trim();
    const token = document.getElementById('gh-token').value.trim();

    if (!owner || !repo || !token) {
      showToast('Vui lòng nhập đầy đủ thông tin', 'error');
      return;
    }

    const originalText = loginBtn.innerHTML;
    loginBtn.innerHTML = 'Đang kết nối <div class="loading-spinner"></div>';
    loginBtn.disabled = true;

    try {
      const url = `https://api.github.com/repos/${owner}/${repo}/contents/data.json?ref=${branch}`;
      const res = await fetch(url, {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!res.ok) throw new Error(res.status === 404 ? 'Không tìm thấy data.json' : 'Xác thực thất bại');

      const data = await res.json();
      currentSha = data.sha;
      
      const base64Clean = data.content.replace(/\s/g, '');
      const content = decodeURIComponent(atob(base64Clean).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      currentJson = JSON.parse(content);
      
      populateForm(currentJson);

      localStorage.setItem('gh_owner', owner);
      localStorage.setItem('gh_repo', repo);
      localStorage.setItem('gh_branch', branch);
      localStorage.setItem('gh_token', token);

      loginPanel.style.display = 'none';
      appContent.style.display = 'block';
      userInfo.style.display = 'flex';
      document.getElementById('repo-display').textContent = `${owner}/${repo} (${branch})`;
      showToast('Kết nối thành công!');

    } catch (error) {
      showToast(error.message, 'error');
      localStorage.removeItem('gh_token');
    } finally {
      loginBtn.innerHTML = originalText;
      loginBtn.disabled = false;
    }
  }

  // ==== DOM Generation & Parsing Functions ====

  function populateForm(data) {
    // 1. General & Contact
    if(data.siteMeta) {
      document.getElementById('meta-title').value = data.siteMeta.title || '';
      document.getElementById('meta-footer').value = data.siteMeta.footerText || '';
      document.getElementById('meta-logo').value = data.siteMeta.logo || '';
      document.getElementById('meta-logoHighlight').value = data.siteMeta.logoHighlight || '';
    }
    if(data.contact) {
      document.getElementById('contact-desc').value = data.contact.description || '';
      document.getElementById('contact-email').value = data.contact.email || '';
      document.getElementById('contact-phone').value = data.contact.phone || '';
    }

    // 2. Hero & About
    if(data.hero) {
      document.getElementById('hero-badge').value = data.hero.badge || '';
      document.getElementById('hero-prefix').value = data.hero.namePrefix || '';
      document.getElementById('hero-highlight').value = data.hero.nameHighlight || '';
      document.getElementById('hero-tagline').value = data.hero.tagline || '';
    }
    if(data.about) {
      document.getElementById('about-desc').value = data.about.description || '';
      document.getElementById('about-cards-list').innerHTML = '';
      (data.about.cards || []).forEach(c => addAboutCard(c));
    }

    // 3. Experience
    document.getElementById('experience-list').innerHTML = '';
    (data.experience || []).forEach(e => addExperience(e));

    // 4. Skills & Education
    document.getElementById('skills-list').innerHTML = '';
    (data.skills || []).forEach(s => addSkillGroup(s));
    
    if(data.education) {
      document.getElementById('edu-degree').value = data.education.degree || '';
      document.getElementById('edu-school').value = data.education.school || '';
      document.getElementById('edu-years').value = data.education.years || '';
    }
    
    document.getElementById('cert-list').innerHTML = '';
    (data.certifications || []).forEach(c => addCert(c));

    // 5. Portfolio
    document.getElementById('portfolio-list').innerHTML = '';
    (data.portfolio || []).forEach(p => addPortfolio(p));
  }

  // --- HTML Generators for Dynamic Lists ---
  window.addAboutCard = function(data = {icon:'', title:'', description:''}) {
    const html = `
      <div class="dynamic-item about-item">
        <div class="dynamic-item-header">
          <span class="dynamic-item-title">Khối năng lực</span>
          <button type="button" class="btn btn-danger btn-sm" onclick="this.closest('.dynamic-item').remove()">Xóa</button>
        </div>
        <div class="grid-2">
          <div class="form-group"><label>Icon (Emoji)</label><input type="text" class="card-icon" value="${data.icon}"></div>
          <div class="form-group"><label>Tiêu đề</label><input type="text" class="card-title" value="${data.title}"></div>
        </div>
        <div class="form-group"><label>Mô tả chi tiết</label><textarea class="card-desc" rows="2">${data.description}</textarea></div>
      </div>
    `;
    document.getElementById('about-cards-list').insertAdjacentHTML('beforeend', html);
  };

  window.addExperience = function(data = {company:'', role:'', date:'', tasks:[]}) {
    const tasksTxt = (data.tasks || []).join('\n');
    const html = `
      <div class="dynamic-item exp-item">
        <div class="dynamic-item-header">
          <span class="dynamic-item-title">Kinh nghiệm làm việc</span>
          <button type="button" class="btn btn-danger btn-sm" onclick="this.closest('.dynamic-item').remove()">Xóa</button>
        </div>
        <div class="grid-2">
          <div class="form-group"><label>Công ty</label><input type="text" class="exp-company" value="${data.company}"></div>
          <div class="form-group"><label>Chức vụ</label><input type="text" class="exp-role" value="${data.role}"></div>
        </div>
        <div class="form-group"><label>Thời gian</label><input type="text" class="exp-date" value="${data.date}" placeholder="VD: 06/2024 - Hiện tại"></div>
        <div class="form-group">
          <label>Chi tiết công việc (Mỗi dòng 1 ý)</label>
          <textarea class="exp-tasks" rows="4">${tasksTxt}</textarea>
        </div>
      </div>
    `;
    document.getElementById('experience-list').insertAdjacentHTML('beforeend', html);
  };

  window.addSkillGroup = function(data = {title:'', badges:[], fullWidth:false}) {
    const badgesTxt = (data.badges || []).join(', ');
    const html = `
      <div class="dynamic-item skill-item">
        <div class="dynamic-item-header">
          <span class="dynamic-item-title">Nhóm Kỹ năng</span>
          <button type="button" class="btn btn-danger btn-sm" onclick="this.closest('.dynamic-item').remove()">Xóa</button>
        </div>
        <div class="grid-2">
          <div class="form-group"><label>Tên nhóm (Kèm Icon)</label><input type="text" class="skill-title" value="${data.title}"></div>
          <div class="form-group"><label style="margin-bottom:12px">Tùy chọn</label>
            <label style="display:flex;align-items:center;gap:8px;cursor:pointer"><input type="checkbox" class="skill-full" ${data.fullWidth ? 'checked' : ''} style="width:auto"> Chiếm toàn bộ chiều ngang</label>
          </div>
        </div>
        <div class="form-group">
          <label>Các kỹ năng (Phân cách bằng dấu phẩy)</label>
          <textarea class="skill-badges" rows="2" placeholder="VD: HTML, CSS, JavaScript">${badgesTxt}</textarea>
        </div>
      </div>
    `;
    document.getElementById('skills-list').insertAdjacentHTML('beforeend', html);
  };

  window.addCert = function(data = {icon:'', title:'', year:''}) {
    const html = `
      <div class="dynamic-item cert-item">
        <div class="dynamic-item-header">
          <span class="dynamic-item-title">Chứng chỉ</span>
          <button type="button" class="btn btn-danger btn-sm" onclick="this.closest('.dynamic-item').remove()">Xóa</button>
        </div>
        <div class="grid-3">
          <div class="form-group"><label>Icon (Emoji)</label><input type="text" class="cert-icon" value="${data.icon}"></div>
          <div class="form-group"><label>Tên chứng chỉ</label><input type="text" class="cert-title" value="${data.title}"></div>
          <div class="form-group"><label>Thời gian đạt</label><input type="text" class="cert-year" value="${data.year}"></div>
        </div>
      </div>
    `;
    document.getElementById('cert-list').insertAdjacentHTML('beforeend', html);
  };

  window.addPortfolio = function(data = {imageText:'', title:'', role:'', description:''}) {
    const html = `
      <div class="dynamic-item port-item">
        <div class="dynamic-item-header">
          <span class="dynamic-item-title">Dự án</span>
          <button type="button" class="btn btn-danger btn-sm" onclick="this.closest('.dynamic-item').remove()">Xóa</button>
        </div>
        <div class="grid-2">
          <div class="form-group"><label>Chữ hiển thị trên ảnh</label><input type="text" class="port-img" value="${data.imageText}"></div>
          <div class="form-group"><label>Tên dự án</label><input type="text" class="port-title" value="${data.title}"></div>
        </div>
        <div class="form-group"><label>Vai trò</label><input type="text" class="port-role" value="${data.role}"></div>
        <div class="form-group"><label>Mô tả chi tiết</label><textarea class="port-desc" rows="3">${data.description}</textarea></div>
      </div>
    `;
    document.getElementById('portfolio-list').insertAdjacentHTML('beforeend', html);
  };

  // ==== Save Data ====
  async function saveContent() {
    try {
      const originalText = saveBtn.innerHTML;
      saveBtn.innerHTML = 'Đang lưu... <div class="loading-spinner"></div>';
      saveBtn.disabled = true;

      // Collect data from forms
      const newData = {
        siteMeta: {
          title: document.getElementById('meta-title').value,
          logo: document.getElementById('meta-logo').value,
          logoHighlight: document.getElementById('meta-logoHighlight').value,
          footerText: document.getElementById('meta-footer').value
        },
        hero: {
          badge: document.getElementById('hero-badge').value,
          namePrefix: document.getElementById('hero-prefix').value,
          nameHighlight: document.getElementById('hero-highlight').value,
          tagline: document.getElementById('hero-tagline').value,
          avatar: currentJson.hero ? currentJson.hero.avatar : "avatar_centered.jpg"
        },
        about: {
          description: document.getElementById('about-desc').value,
          cards: Array.from(document.querySelectorAll('.about-item')).map(el => ({
            icon: el.querySelector('.card-icon').value,
            title: el.querySelector('.card-title').value,
            description: el.querySelector('.card-desc').value
          }))
        },
        skills: Array.from(document.querySelectorAll('.skill-item')).map(el => ({
          title: el.querySelector('.skill-title').value,
          badges: el.querySelector('.skill-badges').value.split(',').map(s => s.trim()).filter(s => s),
          fullWidth: el.querySelector('.skill-full').checked
        })),
        experience: Array.from(document.querySelectorAll('.exp-item')).map(el => ({
          company: el.querySelector('.exp-company').value,
          role: el.querySelector('.exp-role').value,
          date: el.querySelector('.exp-date').value,
          tasks: el.querySelector('.exp-tasks').value.split('\n').filter(t => t.trim() !== '')
        })),
        portfolio: Array.from(document.querySelectorAll('.port-item')).map(el => ({
          imageText: el.querySelector('.port-img').value,
          title: el.querySelector('.port-title').value,
          role: el.querySelector('.port-role').value,
          description: el.querySelector('.port-desc').value
        })),
        education: {
          degree: document.getElementById('edu-degree').value,
          school: document.getElementById('edu-school').value,
          years: document.getElementById('edu-years').value
        },
        certifications: Array.from(document.querySelectorAll('.cert-item')).map(el => ({
          icon: el.querySelector('.cert-icon').value,
          title: el.querySelector('.cert-title').value,
          year: el.querySelector('.cert-year').value
        })),
        contact: {
          description: document.getElementById('contact-desc').value,
          email: document.getElementById('contact-email').value,
          phone: document.getElementById('contact-phone').value
        }
      };

      const contentString = JSON.stringify(newData, null, 2);
      const base64Content = btoa(encodeURIComponent(contentString).replace(/%([0-9A-F]{2})/g, function(match, p1) {
          return String.fromCharCode('0x' + p1);
      }));

      const owner = localStorage.getItem('gh_owner');
      const repo = localStorage.getItem('gh_repo');
      const branch = localStorage.getItem('gh_branch');
      const token = localStorage.getItem('gh_token');
      const url = `https://api.github.com/repos/${owner}/${repo}/contents/data.json`;
      
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: 'Update data.json via Admin UI (Visual Form)',
          content: base64Content,
          sha: currentSha,
          branch: branch
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Lỗi khi lưu dữ liệu');
      }

      const responseData = await res.json();
      currentSha = responseData.content.sha;
      
      showToast('Lưu thành công! Vercel đang tự động deploy lại trang web.', 'success');

    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      saveBtn.innerHTML = 'Lưu & Deploy';
      saveBtn.disabled = false;
    }
  }
});
