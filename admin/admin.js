document.addEventListener('DOMContentLoaded', () => {
  const loginPanel = document.getElementById('login-panel');
  const appContent = document.getElementById('app-content');
  const userInfo = document.getElementById('user-info');
  
  const loginBtn = document.getElementById('login-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const saveBtn = document.getElementById('save-btn');
  const jsonEditor = document.getElementById('json-editor');
  
  let currentSha = null;

  // Restore from localStorage
  if (localStorage.getItem('gh_token')) {
    document.getElementById('gh-owner').value = localStorage.getItem('gh_owner');
    document.getElementById('gh-repo').value = localStorage.getItem('gh_repo');
    document.getElementById('gh-branch').value = localStorage.getItem('gh_branch');
    document.getElementById('gh-token').value = localStorage.getItem('gh_token');
    
    // Auto login if we have token
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
    
    setTimeout(() => {
      toast.className = 'toast';
    }, 4000);
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

      if (!res.ok) {
        throw new Error(res.status === 404 ? 'Không tìm thấy data.json' : 'Xác thực thất bại hoặc repo không tồn tại');
      }

      const data = await res.json();
      currentSha = data.sha;
      
      // Clean base64 string from newlines/spaces
      const base64Clean = data.content.replace(/\s/g, '');
      
      // Decode base64 content safely for UTF-8
      const content = decodeURIComponent(atob(base64Clean).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      // Format JSON beautifully
      const jsonObj = JSON.parse(content);
      jsonEditor.value = JSON.stringify(jsonObj, null, 2);

      // Save to localStorage
      localStorage.setItem('gh_owner', owner);
      localStorage.setItem('gh_repo', repo);
      localStorage.setItem('gh_branch', branch);
      localStorage.setItem('gh_token', token);

      // Show UI
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

  async function saveContent() {
    try {
      // Validate JSON before saving
      const content = jsonEditor.value;
      JSON.parse(content); // will throw if invalid
      
      const owner = localStorage.getItem('gh_owner');
      const repo = localStorage.getItem('gh_repo');
      const branch = localStorage.getItem('gh_branch');
      const token = localStorage.getItem('gh_token');

      const originalText = saveBtn.innerHTML;
      saveBtn.innerHTML = 'Đang lưu... <div class="loading-spinner"></div>';
      saveBtn.disabled = true;

      // GitHub API requires base64 encoded content
      const base64Content = btoa(encodeURIComponent(content).replace(/%([0-9A-F]{2})/g, function(match, p1) {
          return String.fromCharCode('0x' + p1);
      }));

      const url = `https://api.github.com/repos/${owner}/${repo}/contents/data.json`;
      
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: 'Update data.json via Admin UI',
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
      currentSha = responseData.content.sha; // update SHA for future edits
      
      showToast('Lưu thành công! Vercel đang tự động deploy lại trang web.', 'success');

    } catch (error) {
      if (error instanceof SyntaxError) {
        showToast('Lỗi cú pháp JSON! Vui lòng kiểm tra lại (thiếu ngoặc, thừa dấu phẩy...).', 'error');
      } else {
        showToast(error.message, 'error');
      }
    } finally {
      saveBtn.innerHTML = 'Lưu thay đổi & Deploy';
      saveBtn.disabled = false;
    }
  }
  
  // Tab functionality for json editor to add spaces instead of changing focus
  jsonEditor.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = this.selectionStart;
      const end = this.selectionEnd;
      this.value = this.value.substring(0, start) + "  " + this.value.substring(end);
      this.selectionStart = this.selectionEnd = start + 2;
    }
  });
});
