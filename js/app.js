// ======================== API CLIENT ========================
const API = {
  base: window.location.origin + '/Habit/api',
  token: localStorage.getItem('gp-token'),

  async request(method, path, body = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (this.token) headers['Authorization'] = 'Bearer ' + this.token;
    const opts = { method, headers };
    if (body) opts.body = JSON.stringify(body);
    try {
      const res = await fetch(this.base + path, opts);
      if (res.status === 204) return null;
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      return data;
    } catch (e) {
      if (e.message.includes('Failed to fetch')) throw new Error('Cannot connect to server');
      throw e;
    }
  },

  get(path) { return this.request('GET', path); },
  post(path, body) { return this.request('POST', path, body); },
  put(path, body) { return this.request('PUT', path, body); },
  del(path) { return this.request('DELETE', path); },

  // Auth
  async register(name, email, password) {
    const res = await this.post('/auth/register', { name, email, password });
    this.token = res.token;
    localStorage.setItem('gp-token', res.token);
    localStorage.setItem('gp-user', JSON.stringify(res.user));
    return res;
  },

  async login(email, password) {
    const res = await this.post('/auth/login', { email, password });
    this.token = res.token;
    localStorage.setItem('gp-token', res.token);
    localStorage.setItem('gp-user', JSON.stringify(res.user));
    return res;
  },

  logout() {
    this.token = null;
    localStorage.removeItem('gp-token');
    localStorage.removeItem('gp-user');
  },

  isAuthenticated() {
    return !!this.token;
  },

  getUser() {
    const stored = localStorage.getItem('gp-user');
    return stored ? JSON.parse(stored) : null;
  }
};

// ======================== NOTIFICATIONS ========================
const Notif = {
  container: null,

  init() {
    this.container = document.createElement('div');
    this.container.className = 'notif-toast';
    document.body.appendChild(this.container);
  },

  show(title, desc, icon = '🔔', bg = '#DBEAFE', duration = 3500) {
    if (!this.container) this.init();
    const el = document.createElement('div');
    el.className = 'notif-toast-item';
    el.innerHTML = `
      <div class="toast-icon" style="background:${bg}">${icon}</div>
      <div class="toast-content">
        <h4>${title}</h4>
        <p>${desc}</p>
      </div>
    `;
    this.container.appendChild(el);
    setTimeout(() => { if (el.parentNode) el.remove(); }, duration);

    // Browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body: desc, icon: '/Habit/assets/icons/icon-192.svg' });
    }
  },

  success(title, desc) {
    this.show(title, desc, '✅', '#D1FAE5');
  },

  error(title, desc) {
    this.show(title, desc, '❌', '#FEE2E2');
  },

  info(title, desc) {
    this.show(title, desc, 'ℹ️', '#DBEAFE');
  },

  requestPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }
};

// ======================== CONFETTI ========================
function celebrate() {
  const container = document.createElement('div');
  container.className = 'confetti-container';
  const colors = ['#2563EB', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];
  for (let i = 0; i < 60; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.cssText = `
      left: ${Math.random() * 100}%;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      width: ${6 + Math.random() * 8}px;
      height: ${6 + Math.random() * 8}px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      animation-delay: ${Math.random() * 2}s;
      animation-duration: ${2 + Math.random() * 2}s;
    `;
    container.appendChild(piece);
  }
  document.body.appendChild(container);
  setTimeout(() => container.remove(), 4000);
}

// ======================== TOAST ========================
function showToast(message, type = 'success') {
  Notif[type](type === 'success' ? t('success') : t('error'), message);
}

// ======================== AUTH APP ========================
const AuthApp = {
  init() {
    Notif.init();
    Notif.requestPermission();
    this.render();
  },

  render() {
    const container = document.getElementById('app') || document.body;
    if (API.isAuthenticated()) {
      this.loadDashboard();
    } else {
      this.showLogin();
    }
  },

  showLogin(errorMsg = null) {
    const container = document.getElementById('app') || document.body;
    container.innerHTML = `
      <div class="auth-container">
        <div class="auth-card animate-float-in">
          <div class="auth-logo animate-bounce-in">G</div>
          <h1 class="gradient-text">${t('welcome_back')}</h1>
          <p class="auth-subtitle">${t('tagline')}</p>
          <div class="auth-error ${errorMsg ? 'show' : ''}" id="authError">${errorMsg || ''}</div>
          <form class="auth-form" id="loginForm">
            <div class="input-group stagger-children">
              <div class="input-field" style="position:relative">
                <span class="input-icon material-symbols-rounded">mail</span>
                <input type="email" class="input-field" id="loginEmail" data-i18n-placeholder="email_placeholder" placeholder="${t('email_placeholder')}" required style="padding-left:44px">
              </div>
              <div class="input-field" style="position:relative">
                <span class="input-icon material-symbols-rounded">lock</span>
                <input type="password" class="input-field" id="loginPassword" data-i18n-placeholder="password" placeholder="${t('password')}" required style="padding-left:44px">
              </div>
            </div>
            <button type="submit" class="btn btn-primary btn-lg" id="loginBtn">
              <span class="btn-text">${t('sign_in')}</span>
              <span class="auth-loader"></span>
            </button>
          </form>
          <div class="auth-switch">
            ${t('no_account')} <a onclick="AuthApp.showRegister()">${t('sign_up')}</a>
          </div>
          <div class="auth-switch" style="margin-top:8px">
            <a onclick="AuthApp.offlineMode()" style="font-size:0.8rem;color:var(--text-secondary)">${t('continue_offline') || 'Continue without account'}</a>
          </div>
        </div>
      </div>
    `;
    this.attachLoginHandler();
    translatePage();
  },

  showRegister(errorMsg = null) {
    const container = document.getElementById('app') || document.body;
    container.innerHTML = `
      <div class="auth-container">
        <div class="auth-card animate-float-in">
          <div class="auth-logo animate-bounce-in">G</div>
          <h1 class="gradient-text">${t('create_account')}</h1>
          <p class="auth-subtitle">${t('setup_title')}</p>
          <div class="auth-error ${errorMsg ? 'show' : ''}" id="authError">${errorMsg || ''}</div>
          <div class="auth-success" id="authSuccess">${t('register_success')}</div>
          <form class="auth-form" id="registerForm">
            <div class="input-group stagger-children">
              <div style="position:relative">
                <span class="input-icon material-symbols-rounded">person</span>
                <input type="text" class="input-field" id="regName" data-i18n-placeholder="name_placeholder" placeholder="${t('name_placeholder')}" required style="padding-left:44px">
              </div>
              <div style="position:relative">
                <span class="input-icon material-symbols-rounded">mail</span>
                <input type="email" class="input-field" id="regEmail" data-i18n-placeholder="email_placeholder" placeholder="${t('email_placeholder')}" required style="padding-left:44px">
              </div>
              <div style="position:relative">
                <span class="input-icon material-symbols-rounded">lock</span>
                <input type="password" class="input-field" id="regPassword" placeholder="${t('password')}" required style="padding-left:44px" minlength="6">
              </div>
              <div style="position:relative">
                <span class="input-icon material-symbols-rounded">lock</span>
                <input type="password" class="input-field" id="regConfirm" data-i18n-placeholder="confirm_password" placeholder="${t('confirm_password')}" required style="padding-left:44px">
              </div>
            </div>
            <button type="submit" class="btn btn-primary btn-lg" id="registerBtn">
              <span class="btn-text">${t('sign_up')}</span>
              <span class="auth-loader"></span>
            </button>
          </form>
          <div class="auth-switch">
            ${t('have_account')} <a onclick="AuthApp.showLogin()">${t('sign_in')}</a>
          </div>
        </div>
      </div>
    `;
    this.attachRegisterHandler();
    translatePage();
  },

  attachLoginHandler() {
    const form = document.getElementById('loginForm');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('loginBtn');
      const errEl = document.getElementById('authError');
      btn.classList.add('loading');
      errEl.classList.remove('show');
      try {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        await API.login(email, password);
        celebrate();
        Notif.success(t('welcome_back'), t('welcome_msg'));
        this.loadDashboard();
      } catch (err) {
        errEl.textContent = t('login_error');
        errEl.classList.add('show');
      } finally {
        btn.classList.remove('loading');
      }
    });
  },

  attachRegisterHandler() {
    const form = document.getElementById('registerForm');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('registerBtn');
      const errEl = document.getElementById('authError');
      const succEl = document.getElementById('authSuccess');
      btn.classList.add('loading');
      errEl.classList.remove('show');
      succEl.classList.remove('show');
      try {
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const confirm = document.getElementById('regConfirm').value;
        if (password !== confirm) {
          throw new Error('Passwords do not match');
        }
        await API.register(name, email, password);
        succEl.classList.add('show');
        celebrate();
        Notif.success(t('welcome_msg'), t('register_success'));
        setTimeout(() => this.loadDashboard(), 800);
      } catch (err) {
        errEl.textContent = err.message === 'Passwords do not match'
          ? (currentLang === 'es' ? 'Las contraseñas no coinciden' : 'Passwords do not match')
          : t('register_error');
        errEl.classList.add('show');
      } finally {
        btn.classList.remove('loading');
      }
    });
  },

  offlineMode() {
    const user = {
      id: 0, name: 'Kelleger', email: 'kelleger@local.app',
      streak: 12, level: 7, xp: 2450
    };
    localStorage.setItem('gp-user', JSON.stringify(user));
    localStorage.setItem('gp-offline', 'true');
    this.loadDashboard();
  },

  async loadDashboard() {
    const container = document.getElementById('app') || document.body;
    container.innerHTML = `<div class="app-layout" id="appLayout">
      <aside class="sidebar" id="sidebar">
        <div class="sidebar-header">
          <div class="sidebar-logo">G</div>
          <span class="sidebar-brand">${t('app_name')}</span>
        </div>
        <nav class="sidebar-nav">
          ${['home','habits','goals','statistics','achievements','notifications','profile'].map(s => `
            <button class="nav-item ${s === 'home' ? 'active' : ''}" data-screen="${s}">
              <span class="material-symbols-rounded">${s === 'home' ? 'home' : s === 'habits' ? 'check_circle' : s === 'goals' ? 'flag' : s === 'statistics' ? 'bar_chart' : s === 'achievements' ? 'emoji_events' : s === 'notifications' ? 'notifications' : 'person'}</span>
              <span>${t(s === 'home' ? 'home' : s === 'habits' ? 'today_habits' : s === 'goals' ? 'your_goals' : s === 'statistics' ? 'statistics' : s === 'achievements' ? 'achievements_title' : s === 'notifications' ? 'notifications' : 'profile')}</span>
            </button>
          `).join('')}
        </nav>
        <div class="sidebar-footer">
          <button class="nav-item" data-screen="settings">
            <span class="material-symbols-rounded">settings</span>
            <span>${t('settings')}</span>
          </button>
          <button class="btn btn-sm" id="themeToggle" style="width:100%;background:var(--primary-bg);color:var(--primary);border:none;border-radius:var(--radius-sm);height:40px;font-family:var(--font);font-weight:500;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px">
            <span class="material-symbols-rounded" id="themeIcon">${document.documentElement.getAttribute('data-theme') === 'dark' ? 'light_mode' : 'dark_mode'}</span>
            <span id="themeLabel">${document.documentElement.getAttribute('data-theme') === 'dark' ? t('light_mode') : t('dark_mode')}</span>
          </button>
        </div>
      </aside>
      <main class="main-content" id="mainContent"></main>
      <nav class="bottom-nav" id="bottomNav">
        ${['home','habits','goals','statistics','profile'].map(s => `
          <button class="bottom-nav-item ${s === 'home' ? 'active' : ''}" data-screen="${s}">
            <span class="material-symbols-rounded">${s === 'home' ? 'home' : s === 'habits' ? 'check_circle' : s === 'goals' ? 'flag' : s === 'statistics' ? 'bar_chart' : 'person'}</span>
            <span>${t(s === 'home' ? 'home' : s === 'habits' ? 'today_habits' : s === 'goals' ? 'goals_title' : s === 'statistics' ? 'statistics' : 'profile')}</span>
          </button>
        `).join('')}
      </nav>
    </div>`;
    this.currentScreen = 'home';
    this.setupDashboardEvents();
    this.render('home');
  },

  setupDashboardEvents() {
    document.querySelectorAll('[data-screen]').forEach(el => {
      el.addEventListener('click', () => {
        const screen = el.dataset.screen;
        this.navigate(screen);
      });
    });

    document.getElementById('themeToggle')?.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('gp-theme', next);
      document.getElementById('themeIcon').textContent = next === 'dark' ? 'light_mode' : 'dark_mode';
      document.getElementById('themeLabel').textContent = next === 'dark' ? t('light_mode') : t('dark_mode');
    });
  },

  currentScreen: 'home',

  navigate(screen) {
    this.currentScreen = screen;
    document.querySelectorAll('[data-screen]').forEach(el => {
      el.classList.toggle('active', el.dataset.screen === screen);
    });
    this.render(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  async fetchData() {
    if (localStorage.getItem('gp-offline')) {
      return JSON.parse(localStorage.getItem('gp-dashboard-data')) || this.getDefaultData();
    }
    try {
      const [habits, goals, stats, achievements, notifications] = await Promise.all([
        API.get('/habits'),
        API.get('/goals'),
        API.get('/stats'),
        API.get('/achievements'),
        API.get('/notifications')
      ]);
      const user = API.getUser() || { name: 'User', streak: 0, level: 1, xp: 0 };
      return { user, habits, goals, stats, achievements, notifications };
    } catch (e) {
      return this.getDefaultData();
    }
  },

  getDefaultData() {
    return {
      user: { name: 'Kelleger', streak: 12, level: 7, xp: 2450 },
      habits: [
        { id: 1, name: t('drink_water'), icon: '💧', target: 8, unit: 'glasses', color: '#2563EB', logs: {} },
        { id: 2, name: t('read'), icon: '📚', target: 50, unit: 'pages', color: '#22C55E', logs: {} },
        { id: 3, name: t('running'), icon: '🏃', target: 30, unit: 'min', color: '#F59E0B', logs: {} },
        { id: 4, name: t('meditate'), icon: '🧘', target: 15, unit: 'min', color: '#8B5CF6', logs: {} },
        { id: 5, name: t('code'), icon: '💻', target: 60, unit: 'min', color: '#EC4899', logs: {} },
        { id: 6, name: t('journal'), icon: '📝', target: 1, unit: 'entry', color: '#06B6D4', logs: {} }
      ],
      goals: [
        { id: 1, name: t('learn_flutter'), icon: '🎯', progress: 78, deadline: '2026-08-15' },
        { id: 2, name: t('run_5km'), icon: '🏃', progress: 45, deadline: '2026-07-01' },
        { id: 3, name: t('read_books'), icon: '📚', progress: 33, deadline: '2026-12-31' },
        { id: 4, name: t('save_money'), icon: '💰', progress: 60, deadline: '2026-11-01' }
      ],
      stats: { streak: 12, habits_progress: 50, habits_done: 3, habits_total: 6, goals_done: 0, goals_total: 4, level: 7, xp: 2450 },
      achievements: [
        { name: t('early_bird'), icon: '🌅', desc: 'Complete 7 morning habits', unlocked: true },
        { name: t('consistent'), icon: '🔥', desc: '7-day streak', unlocked: true },
        { name: t('marathon'), icon: '🏃', desc: '30-day streak', unlocked: true },
        { name: t('bookworm'), icon: '📖', desc: 'Read 500 pages', unlocked: true },
        { name: t('century'), icon: '💯', desc: '100 habits completed', unlocked: false },
        { name: t('master'), icon: '👑', desc: 'Complete all goals', unlocked: false }
      ],
      notifications: []
    };
  },

  async render(screen) {
    const content = document.getElementById('mainContent');
    if (!content) return;
    const data = await this.fetchData();
    let html = '';

    switch (screen) {
      case 'home':
        html = this.renderHome(data);
        break;
      case 'habits':
        html = this.renderHabits(data);
        break;
      case 'goals':
        html = this.renderGoals(data);
        break;
      case 'statistics':
        html = this.renderStatistics(data);
        break;
      case 'achievements':
        html = this.renderAchievements(data);
        break;
      case 'notifications':
        html = this.renderNotifications(data);
        break;
      case 'profile':
        html = this.renderProfile(data);
        break;
      case 'settings':
        html = this.renderSettings();
        break;
    }
    content.innerHTML = `<div class="screen active page-transition">${html}</div>`;
    this.attachScreenEvents(screen, data);
    translatePage();
  },

  renderHome(data) {
    const { user, habits, goals: goalsList, stats } = data;
    const today = new Date().toISOString().split('T')[0];
    const todayHabits = (habits || []).map(h => ({
      ...h, current: (h.logs?.[today] || 0), progress: h.target > 0 ? Math.min(100, Math.round(((h.logs?.[today] || 0) / h.target) * 100)) : 0
    }));

    return `
      <div class="home-header animate-fade-up">
        <div class="home-greeting">
          <h1>${t('hello')} ${user?.name || 'Kelleger'} 👋</h1>
          <p>${t('keep_growing')}</p>
        </div>
        <div class="home-actions">
          <button class="btn btn-primary btn-sm" onclick="AuthApp.navigate('habits')">
            <span class="material-symbols-rounded">add</span> ${t('log_habit')}
          </button>
        </div>
      </div>

      <div class="stats-grid stagger-children">
        <div class="stat-card animate-pop">
          <div class="stat-icon" style="background:#DBEAFE;color:#2563EB">
            <span class="material-symbols-rounded">local_fire_department</span>
          </div>
          <div class="stat-info">
            <strong>${stats?.streak || user?.streak || 0}</strong>
            <span>${t('day_streak')}</span>
          </div>
        </div>
        <div class="stat-card animate-pop" style="animation-delay:0.1s">
          <div class="stat-icon" style="background:#D1FAE5;color:#22C55E">
            <span class="material-symbols-rounded">check_circle</span>
          </div>
          <div class="stat-info">
            <strong>${stats?.habits_progress || 0}%</strong>
            <span>${t('habits_done')}</span>
          </div>
        </div>
        <div class="stat-card animate-pop" style="animation-delay:0.15s">
          <div class="stat-icon" style="background:#FEF3C7;color:#F59E0B">
            <span class="material-symbols-rounded">flag</span>
          </div>
          <div class="stat-info">
            <strong>${stats?.goals_done || 0}/${stats?.goals_total || (goalsList || []).length}</strong>
            <span>${t('goals_title')}</span>
          </div>
        </div>
        <div class="stat-card animate-pop" style="animation-delay:0.2s">
          <div class="stat-icon" style="background:#EDE9FE;color:#8B5CF6">
            <span class="material-symbols-rounded">emoji_events</span>
          </div>
          <div class="stat-info">
            <strong>${(data.achievements || []).filter(a => a.unlocked).length}</strong>
            <span>${t('achievements_title')}</span>
          </div>
        </div>
      </div>

      <div class="dashboard-section card-entrance visible">
        <div class="dashboard-section-header">
          <h2>${t('today_habits')}</h2>
          <button class="btn btn-ghost btn-sm" onclick="AuthApp.navigate('habits')">${t('view_all')}</button>
        </div>
        <div class="today-habits">
          ${todayHabits.slice(0, 4).map((h, i) => `
            <div class="habit-card animate-slide-left" style="animation-delay:${i * 0.08}s">
              <button class="habit-check ${h.current >= h.target ? 'checked' : ''}" 
                      onclick="AuthApp.toggleHabit(${h.id})">
                <span class="material-symbols-rounded" style="font-size:16px">check</span>
              </button>
              <div class="habit-info">
                <h4>${h.icon} ${h.name}</h4>
                <div class="habit-meta"><span>${h.current} / ${h.target} ${h.unit}</span></div>
              </div>
              <div class="habit-progress">
                <div class="progress-bar"><div class="progress-fill" style="width:${h.progress}%;transition:width 1s cubic-bezier(0.16, 1, 0.3, 1)"></div></div>
                <small>${h.progress}%</small>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="dashboard-section card-entrance visible" style="transition-delay:0.3s">
        <div class="dashboard-section-header">
          <h2>${t('active_goals')}</h2>
          <button class="btn btn-ghost btn-sm" onclick="AuthApp.navigate('goals')">${t('view_all')}</button>
        </div>
        <div class="goals-grid">
          ${(goalsList || []).slice(0, 2).map((g, i) => `
            <div class="goal-card animate-slide-right" style="animation-delay:${i * 0.1}s">
              <div class="goal-header">
                <span class="goal-icon">${g.icon}</span>
                <h4>${g.name}</h4>
              </div>
              <div class="progress-bar"><div class="progress-fill" style="width:${g.progress}%;transition:width 1.2s cubic-bezier(0.16, 1, 0.3, 1)"></div></div>
              <div class="goal-stats">
                <span>${g.progress}% ${t('complete')}</span>
                <span>${t('due')}: ${new Date(g.deadline).toLocaleDateString()}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  renderHabits(data) {
    const today = new Date().toISOString().split('T')[0];
    const habits = (data.habits || []).map(h => ({
      ...h, current: (h.logs?.[today] || 0), progress: h.target > 0 ? Math.min(100, Math.round(((h.logs?.[today] || 0) / h.target) * 100)) : 0
    }));
    const done = habits.filter(h => h.current >= h.target).length;

    return `
      <div class="dashboard-section-header animate-fade-up">
        <h2>${t('today_habits')}</h2>
        <span class="badge badge-primary animate-pop">${done}/${habits.length}</span>
      </div>
      <div class="today-habits stagger-children">
        ${habits.map((h, i) => `
          <div class="habit-card">
            <button class="habit-check ${h.current >= h.target ? 'checked' : ''}" 
                    onclick="AuthApp.toggleHabit(${h.id})">
              <span class="material-symbols-rounded" style="font-size:16px">check</span>
            </button>
            <div class="habit-info">
              <h4>${h.icon} ${h.name}</h4>
              <div class="habit-meta">
                <span class="material-symbols-rounded" style="font-size:14px">trackpad_rounded</span>
                <span>${h.current} / ${h.target} ${h.unit}</span>
              </div>
            </div>
            <div class="habit-progress">
              <div class="progress-bar"><div class="progress-fill ${h.progress >= 100 ? 'success' : h.progress >= 50 ? 'warning' : ''}" style="width:${h.progress}%;transition:width 1s cubic-bezier(0.16, 1, 0.3, 1)"></div></div>
              <small>${h.progress}%</small>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  renderGoals(data) {
    const goalsList = data.goals || [];
    return `
      <div class="dashboard-section-header animate-fade-up">
        <h2>${t('your_goals')}</h2>
        <button class="btn btn-primary btn-sm" onclick="showToast('${currentLang === 'es' ? 'Crear meta pronto disponible' : 'Create goal coming soon!'}', 'info')">
          <span class="material-symbols-rounded">add</span> ${t('new_goal')}
        </button>
      </div>
      <div class="goals-grid stagger-children">
        ${goalsList.map(g => `
          <div class="goal-card">
            <div class="goal-header">
              <span class="goal-icon">${g.icon}</span>
              <h4>${g.name}</h4>
            </div>
            <div class="goal-deadline">${t('due')} ${new Date(g.deadline).toLocaleDateString()}</div>
            <div class="progress-bar"><div class="progress-fill ${g.progress >= 100 ? 'success' : g.progress >= 50 ? 'warning' : ''}" style="width:${g.progress}%;transition:width 1.2s cubic-bezier(0.16, 1, 0.3, 1)"></div></div>
            <div class="goal-stats">
              <span>${g.progress}% ${t('complete')}</span>
              <span>${g.progress >= 100 ? '✅ Done!' : `${100 - g.progress}% ${t('progress')}`}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  renderStatistics(data) {
    const { stats } = data;
    return `
      <div class="streak-card animate-float-in">
        <div class="streak-number">${stats?.streak || 0}</div>
        <div class="streak-info">
          <h3>${t('day_streak')}</h3>
          <p>${currentLang === 'es' ? '¡Vas muy bien! Sigue así.' : "You're on fire! Keep going."}</p>
        </div>
      </div>
      <div class="chart-grid stagger-children">
        <div class="chart-card animate-pop">
          <h3>${t('weekly')}</h3>
          <div class="bar-chart" id="weeklyChart"></div>
        </div>
        <div class="chart-card animate-pop" style="animation-delay:0.1s">
          <h3>${t('monthly')}</h3>
          <div class="bar-chart" id="monthlyChart"></div>
        </div>
        <div class="chart-card animate-pop" style="animation-delay:0.15s">
          <h3>${t('habits_done')}</h3>
          <div class="pie-chart-container">
            <div class="pie-chart" id="pieChart"></div>
            <div class="pie-legend" id="pieLegend"></div>
          </div>
        </div>
        <div class="chart-card animate-pop" style="animation-delay:0.2s">
          <h3>${t('achievements_title')}</h3>
          <div style="text-align:center;padding:24px 0">
            <div style="position:relative;width:120px;height:120px;margin:0 auto 16px">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="var(--border)" stroke-width="8"/>
                <circle cx="60" cy="60" r="54" fill="none" stroke="var(--primary)" stroke-width="8" 
                  stroke-dasharray="${(data.achievements || []).filter(a => a.unlocked).length * 56}, 340" 
                  transform="rotate(-90, 60, 60)" stroke-linecap="round" style="transition:stroke-dasharray 1.5s ease"/>
              </svg>
              <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center">
                <strong style="font-size:1.75rem;color:var(--text-primary)">${(data.achievements || []).filter(a => a.unlocked).length}</strong>
                <small style="font-size:0.75rem;color:var(--text-secondary)">${t('of')} ${(data.achievements || []).length}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderAchievements(data) {
    const achievements = data.achievements || [];
    const unlocked = achievements.filter(a => a.unlocked).length;
    return `
      <div class="dashboard-section-header animate-fade-up">
        <h2>${t('achievements_title')}</h2>
        <span class="badge badge-primary">${unlocked}/${achievements.length}</span>
      </div>
      <div class="achievements-grid stagger-children">
        ${achievements.map(a => `
          <div class="achievement-card ${a.unlocked ? '' : 'locked'} animate-pop">
            <span class="achievement-icon" style="display:block;${a.unlocked ? 'animation:bounce 0.6s ease' : ''}">${a.unlocked ? a.icon : '🔒'}</span>
            <h4>${a.name}</h4>
            <p>${a.desc}</p>
            ${a.unlocked ? '<span class="badge badge-success mt-8" style="display:inline-block">' + t('unlocked') + '</span>' : ''}
          </div>
        `).join('')}
      </div>
    `;
  },

  renderNotifications(data) {
    const notifs = data.notifications || [];
    const sampleNotifs = [
      { icon: '💧', bg: '#DBEAFE', title: t('reminder_drink'), desc: '6/8 ' + (currentLang === 'es' ? 'completados' : 'completed'), time: currentLang === 'es' ? 'hace 2 min' : '2 min ago' },
      { icon: '🏆', bg: '#FEF3C7', title: t('consistent') + ' ' + (currentLang === 'es' ? 'desbloqueado' : 'Unlocked!'), desc: currentLang === 'es' ? 'Insignia de racha de 7 días' : '7-day streak badge earned', time: currentLang === 'es' ? 'hace 1 hora' : '1 hour ago' },
      { icon: '📊', bg: '#D1FAE5', title: currentLang === 'es' ? 'Reporte Semanal' : 'Weekly Report Ready', desc: currentLang === 'es' ? '¡Gran semana! 15% de mejora' : 'Great week! 15% improvement', time: currentLang === 'es' ? 'hace 3 horas' : '3 hours ago' },
    ];
    return `
      <div class="dashboard-section-header animate-fade-up">
        <h2>${t('notifications')}</h2>
        <button class="btn btn-ghost btn-sm">${t('mark_read')}</button>
      </div>
      <div class="notifications-list stagger-children">
        ${(notifs.length > 0 ? notifs : sampleNotifs).map((n, i) => `
          <div class="notification-item animate-slide-right" style="animation-delay:${i * 0.1}s">
            <div class="notif-icon" style="background:${n.bg || '#DBEAFE'}">${n.icon || '🔔'}</div>
            <div class="notif-content">
              <h4>${n.title}</h4>
              <p>${n.desc}</p>
            </div>
            <span class="notif-time">${n.time || n.created_at || ''}</span>
          </div>
        `).join('')}
      </div>
    `;
  },

  renderProfile(data) {
    const user = data.user || { name: 'User', streak: 0, level: 1, xp: 0 };
    const initial = (user.name || 'U').charAt(0).toUpperCase();
    return `
      <div class="profile-header-card animate-float-in">
        <div class="profile-avatar-large animate-bounce-in">${initial}</div>
        <h2 class="animate-fade-up">${user.name}</h2>
        <p class="text-secondary">${user.email || 'user@growthpath.app'}</p>
        <button class="btn btn-primary btn-sm mt-16 animate-pop">
          <span class="material-symbols-rounded">edit</span> ${t('edit_profile')}
        </button>
        <div class="profile-stats-row stagger-children">
          <div class="profile-stat">
            <strong>${t('level')} ${user.level || 1}</strong>
            <span>${t('level')}</span>
          </div>
          <div class="profile-stat">
            <strong>${user.xp || 0} ${t('of')} 3000</strong>
            <span>${t('experience')}</span>
          </div>
          <div class="profile-stat">
            <strong>${user.streak || 0}</strong>
            <span>${t('day_streak')}</span>
          </div>
        </div>
      </div>
    `;
  },

  renderSettings() {
    const theme = document.documentElement.getAttribute('data-theme');
    return `
      <div class="dashboard-section-header animate-fade-up">
        <h2>${t('settings')}</h2>
      </div>
      <div class="settings-list stagger-children">
        <div class="settings-item animate-slide-left">
          <div class="settings-icon" style="background:#DBEAFE;color:#2563EB">
            <span class="material-symbols-rounded">${theme === 'dark' ? 'dark_mode' : 'light_mode'}</span>
          </div>
          <div class="settings-info">
            <h4>${t('dark_mode')}</h4>
            <p>${currentLang === 'es' ? 'Cambiar entre temas claro y oscuro' : 'Switch between light and dark themes'}</p>
          </div>
          <div class="settings-action">
            <label class="toggle">
              <input type="checkbox" ${theme === 'dark' ? 'checked' : ''} onchange="document.documentElement.setAttribute('data-theme', this.checked?'dark':'light');localStorage.setItem('gp-theme', this.checked?'dark':'light');document.getElementById('themeIcon').textContent=this.checked?'light_mode':'dark_mode';document.getElementById('themeLabel').textContent=this.checked?'${t('light_mode')}':'${t('dark_mode')}'">
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div class="settings-item animate-slide-left" style="animation-delay:0.1s">
          <div class="settings-icon" style="background:#FEF3C7;color:#F59E0B">
            <span class="material-symbols-rounded">language</span>
          </div>
          <div class="settings-info">
            <h4>${t('language')}</h4>
            <p>${currentLang === 'en' ? 'English' : 'Español'}</p>
          </div>
          <div class="settings-action">
            <label class="toggle">
              <input type="checkbox" ${currentLang === 'es' ? 'checked' : ''} onchange="setLang(this.checked?'es':'en')">
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div class="settings-item animate-slide-left" style="animation-delay:0.15s">
          <div class="settings-icon" style="background:#D1FAE5;color:#22C55E">
            <span class="material-symbols-rounded">notifications</span>
          </div>
          <div class="settings-info">
            <h4>${t('notifications')}</h4>
            <p>${currentLang === 'es' ? 'Notificaciones activadas' : 'Push notifications enabled'}</p>
          </div>
          <div class="settings-action">
            <label class="toggle">
              <input type="checkbox" checked onchange="if(this.checked){Notif.requestPermission();Notif.success('${t('notifications')}', '${currentLang === 'es' ? 'Notificaciones activadas' : 'Notifications enabled'}')}else{Notif.info('${t('notifications')}', '${currentLang === 'es' ? 'Notificaciones desactivadas' : 'Notifications disabled'}')}">
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div class="settings-item animate-slide-left" style="animation-delay:0.2s">
          <div class="settings-icon" style="background:#EDE9FE;color:#8B5CF6">
            <span class="material-symbols-rounded">lock</span>
          </div>
          <div class="settings-info">
            <h4>${t('security')}</h4>
            <p>${currentLang === 'es' ? 'Protección PIN / Huella' : 'PIN / Fingerprint protection'}</p>
          </div>
          <div class="settings-action">
            <span class="material-symbols-rounded" style="color:var(--text-secondary)">chevron_right</span>
          </div>
        </div>

        <div class="settings-item animate-slide-left" style="animation-delay:0.25s;cursor:pointer" onclick="if(confirm(t('sign_out_confirm'))){API.logout();location.reload()}">
          <div class="settings-icon" style="background:#FEE2E2;color:#EF4444">
            <span class="material-symbols-rounded">logout</span>
          </div>
          <div class="settings-info">
            <h4 style="color:#EF4444">${t('sign_out')}</h4>
            <p>${currentLang === 'es' ? 'Cerrar sesión de tu cuenta' : 'Sign out of your account'}</p>
          </div>
        </div>
      </div>
    `;
  },

  attachScreenEvents(screen, data) {
    if (screen === 'statistics') {
      setTimeout(() => {
        this.renderCharts(data);
      }, 100);
    }
  },

  renderCharts(data) {
    const weeklyEl = document.getElementById('weeklyChart');
    const monthlyEl = document.getElementById('monthlyChart');
    const pieEl = document.getElementById('pieChart');
    const legendEl = document.getElementById('pieLegend');

    if (weeklyEl) {
      const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
      const values = days.map(() => Math.floor(Math.random() * 80) + 10);
      const max = Math.max(...values, 1);
      weeklyEl.innerHTML = values.map((v, i) => `
        <div class="bar-item">
          <div class="bar" style="height:${Math.max(4, (v / max) * 140)}px;animation:popIn 0.4s ease ${i * 0.1}s both"></div>
          <span>${days[i]}</span>
        </div>
      `).join('');
    }

    if (monthlyEl) {
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const vals = months.map(() => Math.floor(Math.random() * 70) + 10);
      const maxM = Math.max(...vals, 1);
      monthlyEl.innerHTML = vals.map((v, i) => `
        <div class="bar-item">
          <div class="bar" style="height:${Math.max(4, (v / maxM) * 140)}px;background:${i === new Date().getMonth() ? 'linear-gradient(180deg, var(--primary), var(--accent))' : 'var(--border)'};animation:popIn 0.4s ease ${i * 0.05}s both"></div>
          <span>${months[i].substring(0, 3)}</span>
        </div>
      `).join('');
    }

    if (pieEl && legendEl) {
      const habits = data.habits || [];
      const today = new Date().toISOString().split('T')[0];
      const colors = ['#2563EB', '#22C55E', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'];
      const active = habits.filter(h => (h.logs?.[today] || 0) > 0);
      const total = active.reduce((s, h) => s + (h.logs?.[today] || 0), 0) || 1;

      if (active.length > 0) {
        let conic = '', angle = 0;
        const legendHtml = [];
        active.forEach((h, i) => {
          const pct = ((h.logs?.[today] || 0) / total) * 360;
          conic += `${colors[i % colors.length]} ${angle}deg ${angle + pct}deg,`;
          angle += pct;
          legendHtml.push(`<div class="pie-legend-item"><div class="dot" style="background:${colors[i % colors.length]}"></div><span>${h.icon} ${h.name}</span></div>`);
        });
        pieEl.style.background = `conic-gradient(${conic.slice(0, -1)})`;
        legendEl.innerHTML = legendHtml.join('');
      } else {
        pieEl.style.background = '#E2E8F0';
        legendEl.innerHTML = `<div class="pie-legend-item"><span style="color:var(--text-secondary)">${currentLang === 'es' ? 'Sin datos hoy' : 'No data today'}</span></div>`;
      }
    }
  },

  async toggleHabit(habitId) {
    const today = new Date().toISOString().split('T')[0];
    const isOffline = localStorage.getItem('gp-offline');

    if (isOffline) {
      let data = JSON.parse(localStorage.getItem('gp-dashboard-data')) || this.getDefaultData();
      const habits = data.habits || [];
      for (const h of habits) {
        if (h.id === habitId) {
          if (!h.logs) h.logs = {};
          h.logs[today] = (h.logs[today] || 0) >= h.target ? 0 : h.target;
          break;
        }
      }
      localStorage.setItem('gp-dashboard-data', JSON.stringify(data));
    } else {
      try {
        const habits = await API.get('/habits');
        const h = habits.find(h => h.id === habitId);
        if (h) {
          const current = h.logs?.[today] || 0;
          const newVal = current >= h.target ? 0 : h.target;
          await API.post('/habits/log', { habit_id: habitId, date: today, value: newVal });
          if (newVal >= h.target) {
            celebrate();
            Notif.success('✅ ' + h.name + ' ' + (currentLang === 'es' ? 'completado!' : 'completed!'), currentLang === 'es' ? '¡Sigue así!' : 'Keep it up!');
          }
        }
      } catch (e) {
        console.error('Toggle error:', e);
      }
    }
    this.render(this.currentScreen);
  }
};

// ======================== PWA ========================
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
});

document.addEventListener('click', e => {
  const btn = e.target.closest('.install-btn');
  if (!btn || !deferredPrompt) return;
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then(() => { deferredPrompt = null; });
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('../sw.js').catch(() => {});
  });
}

// ======================== LANDING PAGE ========================
if (window.location.pathname.includes('/dashboard/')) {
  document.addEventListener('DOMContentLoaded', () => AuthApp.init());
}
