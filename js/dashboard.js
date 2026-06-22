// ======================== DATA STORE ========================
const Store = {
  data: null,

  init() {
    const stored = localStorage.getItem('gp-data');
    if (stored) {
      this.data = JSON.parse(stored);
    } else {
      this.data = this.getDefaultData();
      this.save();
    }
  },

  getDefaultData() {
    const today = new Date().toISOString().split('T')[0];
    return {
      user: {
        name: 'Kelleger',
        email: 'kelleger@growthpath.app',
        avatar: null,
        joinDate: '2026-01-15',
        streak: 12,
        level: 7,
        xp: 2450,
        xpToNext: 3000
      },
      habits: [
        { id: 1, name: 'Drink Water', icon: '💧', target: 8, unit: 'glasses', color: '#2563EB', logs: {} },
        { id: 2, name: 'Read', icon: '📚', target: 50, unit: 'pages', color: '#22C55E', logs: {} },
        { id: 3, name: 'Running', icon: '🏃', target: 30, unit: 'min', color: '#F59E0B', logs: {} },
        { id: 4, name: 'Meditate', icon: '🧘', target: 15, unit: 'min', color: '#8B5CF6', logs: {} },
        { id: 5, name: 'Code', icon: '💻', target: 60, unit: 'min', color: '#EC4899', logs: {} },
        { id: 6, name: 'Journal', icon: '📝', target: 1, unit: 'entry', color: '#06B6D4', logs: {} }
      ],
      goals: [
        { id: 1, name: 'Learn Flutter', icon: '🎯', progress: 78, deadline: '2026-08-15', color: '#2563EB' },
        { id: 2, name: 'Run 5KM', icon: '🏃', progress: 45, deadline: '2026-07-01', color: '#22C55E' },
        { id: 3, name: 'Read 12 Books', icon: '📚', progress: 33, deadline: '2026-12-31', color: '#F59E0B' },
        { id: 4, name: 'Save $5,000', icon: '💰', progress: 60, deadline: '2026-11-01', color: '#8B5CF6' }
      ],
      notifications: [
        { id: 1, icon: '💧', iconBg: '#DBEAFE', title: 'Drink Water Reminder', desc: 'Time to drink water! 6/8 completed', time: '2 min ago' },
        { id: 2, icon: '🏆', iconBg: '#FEF3C7', title: 'Achievement Unlocked!', desc: '7-day streak badge earned', time: '1 hour ago' },
        { id: 3, icon: '📊', iconBg: '#D1FAE5', title: 'Weekly Report Ready', desc: 'Great week! 15% improvement', time: '3 hours ago' },
        { id: 4, icon: '🎯', iconBg: '#EDE9FE', title: 'Goal Milestone', desc: 'Learn Flutter at 78%!', time: '1 day ago' }
      ],
      achievements: [
        { name: 'Early Bird', icon: '🌅', desc: 'Complete 7 morning habits', unlocked: true },
        { name: 'Consistent', icon: '🔥', desc: '7-day streak', unlocked: true },
        { name: 'Marathon', icon: '🏃', desc: '30-day streak', unlocked: true },
        { name: 'Bookworm', icon: '📖', desc: 'Read 500 pages', unlocked: true },
        { name: 'Century', icon: '💯', desc: '100 habits completed', unlocked: false },
        { name: 'Master', icon: '👑', desc: 'Complete all goals', unlocked: false }
      ]
    };
  },

  save() {
    localStorage.setItem('gp-data', JSON.stringify(this.data));
  },

  getHabitLog(habitId, date) {
    const d = date || new Date().toISOString().split('T')[0];
    const habit = this.data.habits.find(h => h.id === habitId);
    return habit ? (habit.logs[d] || 0) : 0;
  },

  logHabit(habitId, value, date) {
    const d = date || new Date().toISOString().split('T')[0];
    const habit = this.data.habits.find(h => h.id === habitId);
    if (habit) {
      habit.logs[d] = Math.min(Math.max(0, value), habit.target);
      this.save();
    }
  },

  toggleHabit(habitId, date) {
    const d = date || new Date().toISOString().split('T')[0];
    const current = this.getHabitLog(habitId, d);
    const habit = this.data.habits.find(h => h.id === habitId);
    if (habit) {
      const newVal = current >= habit.target ? 0 : habit.target;
      this.logHabit(habitId, newVal, d);
    }
  },

  getTodayHabits() {
    const today = new Date().toISOString().split('T')[0];
    return this.data.habits.map(h => {
      const log = h.logs[today] || 0;
      const pct = h.target > 0 ? Math.round((log / h.target) * 100) : 0;
      return { ...h, current: log, progress: pct };
    });
  },

  getWeeklyData() {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      let total = 0, count = 0;
      this.data.habits.forEach(h => {
        const val = h.logs[dateStr] || 0;
        if (val > 0) { total += (val / h.target) * 100; count++; }
      });
      data.push({
        label: days[d.getDay()],
        date: dateStr,
        value: count > 0 ? Math.round(total / count) : 0
      });
    }
    return data;
  },

  getMonthlyData() {
    const data = [];
    for (let m = 0; m < 12; m++) {
      let total = 0, count = 0;
      const daysInMonth = new Date(2026, m + 1, 0).getDate();
      Object.values(this.data.habits).forEach(h => {
        Object.entries(h.logs || {}).forEach(([date, val]) => {
          const month = parseInt(date.split('-')[1]) - 1;
          if (month === m && val > 0) { total += (val / h.target) * 100; count++; }
        });
      });
      data.push(count > 0 ? Math.round(total / count) : 0);
    }
    return data;
  },

  getAchievementStats() {
    const total = this.data.achievements.length;
    const unlocked = this.data.achievements.filter(a => a.unlocked).length;
    return { total, unlocked, pct: Math.round((unlocked / total) * 100) };
  },

  getStats() {
    const habits = this.getTodayHabits();
    const habitsDone = habits.filter(h => h.current >= h.target).length;
    const habitsTotal = habits.length;
    const goalsDone = this.data.goals.filter(g => g.progress >= 100).length;
    const goalsTotal = this.data.goals.length;
    const ach = this.getAchievementStats();
    return {
      streak: this.data.user.streak,
      habitsPct: habitsTotal > 0 ? Math.round((habitsDone / habitsTotal) * 100) : 0,
      goalsDone,
      goalsTotal,
      achievements: ach.unlocked
    };
  }
};

// ======================== UI RENDERER ========================
const UI = {
  currentScreen: 'home',

  init() {
    Store.init();
    this.setupNavigation();
    this.setupTheme();
    this.navigate('home');
  },

  setupNavigation() {
    document.querySelectorAll('[data-screen]').forEach(el => {
      el.addEventListener('click', () => {
        const screen = el.dataset.screen;
        this.navigate(screen);
      });
    });
  },

  setupTheme() {
    const saved = localStorage.getItem('gp-theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('gp-theme', next);
        this.updateThemeUI(next);
      });
    }
    this.updateThemeUI(saved);
  },

  updateThemeUI(theme) {
    const label = document.getElementById('themeLabel');
    if (label) label.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
    const icon = document.querySelector('#themeToggle .material-symbols-rounded');
    if (icon) icon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
  },

  navigate(screen) {
    this.currentScreen = screen;
    this.updateActiveNav(screen);
    this.render(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  updateActiveNav(screen) {
    document.querySelectorAll('[data-screen]').forEach(el => {
      el.classList.toggle('active', el.dataset.screen === screen);
    });
  },

  render(screen) {
    const content = document.getElementById('mainContent');
    const renderers = {
      home: this.renderHome,
      habits: this.renderHabits,
      goals: this.renderGoals,
      statistics: this.renderStatistics,
      achievements: this.renderAchievements,
      notifications: this.renderNotifications,
      profile: this.renderProfile,
      settings: this.renderSettings
    };
    if (renderers[screen]) {
      content.innerHTML = renderers[screen].call(this);
    }
  },

  renderHome() {
    const stats = Store.getStats();
    const habits = Store.getTodayHabits();
    const goals = Store.data.goals;
    const user = Store.data.user;

    return `
      <div class="screen active">
        <div class="home-header">
          <div class="home-greeting">
            <h1>Hello ${user.name} 👋</h1>
            <p>Keep Growing Today</p>
          </div>
          <div class="home-actions">
            <button class="btn btn-primary btn-sm" onclick="UI.navigate('habits')">
              <span class="material-symbols-rounded">add</span> Log Habit
            </button>
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon" style="background:#DBEAFE;color:#2563EB">
              <span class="material-symbols-rounded">local_fire_department</span>
            </div>
            <div class="stat-info">
              <strong>${stats.streak}</strong>
              <span>Day Streak</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background:#D1FAE5;color:#22C55E">
              <span class="material-symbols-rounded">check_circle</span>
            </div>
            <div class="stat-info">
              <strong>${stats.habitsPct}%</strong>
              <span>Habits Done</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background:#FEF3C7;color:#F59E0B">
              <span class="material-symbols-rounded">flag</span>
            </div>
            <div class="stat-info">
              <strong>${stats.goalsDone}/${stats.goalsTotal}</strong>
              <span>Goals</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background:#EDE9FE;color:#8B5CF6">
              <span class="material-symbols-rounded">emoji_events</span>
            </div>
            <div class="stat-info">
              <strong>${stats.achievements}</strong>
              <span>Achievements</span>
            </div>
          </div>
        </div>

        <div class="dashboard-section">
          <div class="dashboard-section-header">
            <h2>Today's Habits</h2>
            <button class="btn btn-ghost btn-sm" onclick="UI.navigate('habits')">View All</button>
          </div>
          <div class="today-habits">
            ${habits.slice(0, 4).map(h => `
              <div class="habit-card">
                <button class="habit-check ${h.current >= h.target ? 'checked' : ''}" 
                        onclick="Store.toggleHabit(${h.id});UI.render('home')">
                  <span class="material-symbols-rounded" style="font-size:16px">check</span>
                </button>
                <div class="habit-info">
                  <h4>${h.icon} ${h.name}</h4>
                  <div class="habit-meta">
                    <span>${h.current} / ${h.target} ${h.unit}</span>
                  </div>
                </div>
                <div class="habit-progress">
                  <div class="progress-bar">
                    <div class="progress-fill" style="width:${h.progress}%"></div>
                  </div>
                  <small>${h.progress}%</small>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="dashboard-section">
          <div class="dashboard-section-header">
            <h2>Active Goals</h2>
            <button class="btn btn-ghost btn-sm" onclick="UI.navigate('goals')">View All</button>
          </div>
          <div class="goals-grid">
            ${goals.slice(0, 2).map(g => `
              <div class="goal-card">
                <div class="goal-header">
                  <span class="goal-icon">${g.icon}</span>
                  <h4>${g.name}</h4>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" style="width:${g.progress}%"></div>
                </div>
                <div class="goal-stats">
                  <span>${g.progress}% complete</span>
                  <span>Due: ${new Date(g.deadline).toLocaleDateString()}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  renderHabits() {
    const habits = Store.getTodayHabits();
    return `
      <div class="screen active">
        <div class="dashboard-section-header">
          <h2>Today's Habits</h2>
          <span class="badge badge-primary">${habits.filter(h => h.current >= h.target).length}/${habits.length}</span>
        </div>
        <div class="today-habits">
          ${habits.map(h => `
            <div class="habit-card">
              <button class="habit-check ${h.current >= h.target ? 'checked' : ''}" 
                      onclick="Store.toggleHabit(${h.id});UI.render('habits')">
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
                <div class="progress-bar">
                  <div class="progress-fill ${h.progress >= 100 ? 'success' : h.progress >= 50 ? 'warning' : ''}" style="width:${h.progress}%"></div>
                </div>
                <small>${h.progress}%</small>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="dashboard-section" style="margin-top:32px">
          <div class="dashboard-section-header">
            <h2>All Habits</h2>
          </div>
          <div class="today-habits">
            ${Store.data.habits.map(h => {
              const pct = h.target > 0 ? Math.round(((Store.getHabitLog(h.id) || 0) / h.target) * 100) : 0;
              return `
                <div class="habit-card" style="opacity:0.7">
                  <div class="habit-info">
                    <h4>${h.icon} ${h.name}</h4>
                    <div class="habit-meta">
                      <span>Target: ${h.target} ${h.unit}/day</span>
                    </div>
                  </div>
                  <div class="habit-progress">
                    <div class="progress-bar">
                      <div class="progress-fill" style="width:${pct}%"></div>
                    </div>
                    <small>${pct}%</small>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  },

  renderGoals() {
    return `
      <div class="screen active">
        <div class="dashboard-section-header">
          <h2>Your Goals</h2>
          <button class="btn btn-primary btn-sm" onclick="alert('New goal creation coming soon!')">
            <span class="material-symbols-rounded">add</span> New Goal
          </button>
        </div>
        <div class="goals-grid">
          ${Store.data.goals.map(g => `
            <div class="goal-card">
              <div class="goal-header">
                <span class="goal-icon">${g.icon}</span>
                <h4>${g.name}</h4>
              </div>
              <div class="goal-deadline">Due ${new Date(g.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
              <div class="progress-bar">
                <div class="progress-fill ${g.progress >= 100 ? 'success' : g.progress >= 50 ? 'warning' : ''}" style="width:${g.progress}%"></div>
              </div>
              <div class="goal-stats">
                <span>${g.progress}% complete</span>
                <span>${g.progress >= 100 ? '✅ Done!' : `${100 - g.progress}% remaining`}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  renderStatistics() {
    const weekly = Store.getWeeklyData();
    const monthly = Store.getMonthlyData();
    const maxWeekly = Math.max(...weekly.map(w => w.value), 1);
    const maxMonthly = Math.max(...monthly, 1);

    const weekLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();

    return `
      <div class="screen active">
        <div class="streak-card">
          <div class="streak-number">${Store.data.user.streak}</div>
          <div class="streak-info">
            <h3>Day Streak</h3>
            <p>You're on fire! Keep going to reach new milestones.</p>
          </div>
        </div>

        <div class="chart-grid">
          <div class="chart-card">
            <h3>Weekly Progress</h3>
            <div class="bar-chart">
              ${weekly.map(w => `
                <div class="bar-item">
                  <div class="bar" style="height:${Math.max(4, (w.value / maxWeekly) * 160)}px"></div>
                  <span>${w.label}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="chart-card">
            <h3>Monthly Overview</h3>
            <div class="bar-chart">
              ${monthly.map((v, i) => `
                <div class="bar-item">
                  <div class="bar" style="height:${Math.max(4, (v / maxMonthly) * 160)}px;background:${i === currentMonth ? 'linear-gradient(180deg, var(--primary), var(--accent))' : 'var(--border)'}"></div>
                  <span>${monthLabels[i].substring(0, 3)}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="chart-card">
            <h3>Habit Distribution</h3>
            <div class="pie-chart-container">
              <div class="pie-chart" id="pieChart"></div>
              <div class="pie-legend" id="pieLegend"></div>
            </div>
          </div>

          <div class="chart-card">
            <h3>Achievements</h3>
            <div style="text-align:center;padding:24px 0">
              <div style="position:relative;width:120px;height:120px;margin:0 auto 16px">
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="var(--border)" stroke-width="8"/>
                  <circle cx="60" cy="60" r="54" fill="none" stroke="var(--primary)" stroke-width="8" 
                    stroke-dasharray="${Store.getAchievementStats().pct * 3.39}, 340" 
                    transform="rotate(-90, 60, 60)" stroke-linecap="round"/>
                </svg>
                <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center">
                  <strong style="font-size:1.75rem;color:var(--text-primary)">${Store.getAchievementStats().unlocked}</strong>
                  <small style="font-size:0.75rem;color:var(--text-secondary)">of ${Store.getAchievementStats().total}</small>
                </div>
              </div>
              <p style="font-size:0.813rem;color:var(--text-secondary)">${Store.getAchievementStats().pct}% of achievements unlocked</p>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderAchievements() {
    return `
      <div class="screen active">
        <div class="dashboard-section-header">
          <h2>Achievements</h2>
          <span class="badge badge-primary">${Store.getAchievementStats().unlocked}/${Store.getAchievementStats().total}</span>
        </div>
        <div class="achievements-grid">
          ${Store.data.achievements.map(a => `
            <div class="achievement-card ${a.unlocked ? '' : 'locked'}">
              <span class="achievement-icon">${a.unlocked ? a.icon : '🔒'}</span>
              <h4>${a.name}</h4>
              <p>${a.desc}</p>
              ${a.unlocked ? '<span class="badge badge-success mt-8" style="display:inline-block">Unlocked</span>' : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  renderNotifications() {
    return `
      <div class="screen active">
        <div class="dashboard-section-header">
          <h2>Notifications</h2>
          <button class="btn btn-ghost btn-sm">Mark all read</button>
        </div>
        <div class="notifications-list">
          ${Store.data.notifications.map(n => `
            <div class="notification-item">
              <div class="notif-icon" style="background:${n.iconBg}">${n.icon}</div>
              <div class="notif-content">
                <h4>${n.title}</h4>
                <p>${n.desc}</p>
              </div>
              <span class="notif-time">${n.time}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  renderProfile() {
    const user = Store.data.user;
    const initial = user.name.charAt(0).toUpperCase();
    return `
      <div class="screen active">
        <div class="profile-header-card">
          <div class="profile-avatar-large">${initial}</div>
          <h2>${user.name}</h2>
          <p class="text-secondary">${user.email}</p>
          <button class="btn btn-primary btn-sm mt-16">
            <span class="material-symbols-rounded">edit</span> Edit Profile
          </button>
          <div class="profile-stats-row">
            <div class="profile-stat">
              <strong>Level ${user.level}</strong>
              <span>Current Level</span>
            </div>
            <div class="profile-stat">
              <strong>${user.xp} / ${user.xpToNext}</strong>
              <span>Experience</span>
            </div>
            <div class="profile-stat">
              <strong>${user.streak}</strong>
              <span>Day Streak</span>
            </div>
          </div>
          <div class="progress-bar mt-16">
            <div class="progress-fill" style="width:${Math.round((user.xp / user.xpToNext) * 100)}%"></div>
          </div>
        </div>

        <div class="dashboard-section">
          <h3 class="mb-16">Quick Stats</h3>
          <div class="stats-grid" style="grid-template-columns:repeat(2,1fr)">
            <div class="stat-card">
              <div class="stat-icon" style="background:#DBEAFE;color:#2563EB">
                <span class="material-symbols-rounded">calendar_month</span>
              </div>
              <div class="stat-info">
                <strong>${Math.floor((new Date() - new Date(user.joinDate)) / (1000*60*60*24))}</strong>
                <span>Days Active</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon" style="background:#D1FAE5;color:#22C55E">
                <span class="material-symbols-rounded">emoji_events</span>
              </div>
              <div class="stat-info">
                <strong>${Store.getAchievementStats().unlocked}</strong>
                <span>Achievements</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderSettings() {
    const theme = document.documentElement.getAttribute('data-theme');
    return `
      <div class="screen active">
        <div class="dashboard-section-header">
          <h2>Settings</h2>
        </div>
        <div class="settings-list">
          <div class="settings-item">
            <div class="settings-icon" style="background:#DBEAFE;color:#2563EB">
              <span class="material-symbols-rounded">${theme === 'dark' ? 'dark_mode' : 'light_mode'}</span>
            </div>
            <div class="settings-info">
              <h4>Dark Mode</h4>
              <p>Switch between light and dark themes</p>
            </div>
            <div class="settings-action">
              <label class="toggle">
                <input type="checkbox" ${theme === 'dark' ? 'checked' : ''} onchange="document.documentElement.setAttribute('data-theme', this.checked?'dark':'light');localStorage.setItem('gp-theme', this.checked?'dark':'light');UI.updateThemeUI(this.checked?'dark':'light')">
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div class="settings-item">
            <div class="settings-icon" style="background:#FEF3C7;color:#F59E0B">
              <span class="material-symbols-rounded">language</span>
            </div>
            <div class="settings-info">
              <h4>Language</h4>
              <p>English (US)</p>
            </div>
            <div class="settings-action">
              <span class="material-symbols-rounded" style="color:var(--text-secondary)">chevron_right</span>
            </div>
          </div>

          <div class="settings-item">
            <div class="settings-icon" style="background:#D1FAE5;color:#22C55E">
              <span class="material-symbols-rounded">notifications</span>
            </div>
            <div class="settings-info">
              <h4>Notifications</h4>
              <p>Push notifications enabled</p>
            </div>
            <div class="settings-action">
              <label class="toggle">
                <input type="checkbox" checked>
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div class="settings-item">
            <div class="settings-icon" style="background:#EDE9FE;color:#8B5CF6">
              <span class="material-symbols-rounded">lock</span>
            </div>
            <div class="settings-info">
              <h4>Security</h4>
              <p>Face ID / PIN protection</p>
            </div>
            <div class="settings-action">
              <span class="material-symbols-rounded" style="color:var(--text-secondary)">chevron_right</span>
            </div>
          </div>

          <div class="settings-item" style="cursor:pointer" onclick="if(confirm('Are you sure you want to sign out?')){localStorage.removeItem('gp-data');window.location.href='/'}">
            <div class="settings-icon" style="background:#FEE2E2;color:#EF4444">
              <span class="material-symbols-rounded">logout</span>
            </div>
            <div class="settings-info">
              <h4 style="color:#EF4444">Sign Out</h4>
              <p>Sign out of your account</p>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  updatePieChart() {
    setTimeout(() => {
      const container = document.getElementById('pieChart');
      const legend = document.getElementById('pieLegend');
      if (!container) return;

      const habits = Store.getTodayHabits();
      const colors = ['#2563EB', '#22C55E', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'];
      const total = habits.reduce((s, h) => s + h.progress, 0) || 1;

      let conic = '';
      let angle = 0;
      const legendHtml = [];

      habits.forEach((h, i) => {
        if (h.progress > 0) {
          const pct = (h.progress / total) * 360;
          conic += `${colors[i % colors.length]} ${angle}deg ${angle + pct}deg,`;
          angle += pct;
          legendHtml.push(`
            <div class="pie-legend-item">
              <div class="dot" style="background:${colors[i % colors.length]}"></div>
              <span>${h.icon} ${h.name} (${h.progress}%)</span>
            </div>
          `);
        }
      });

      if (conic) {
        container.style.background = `conic-gradient(${conic.slice(0, -1)})`;
      }
      if (legend) {
        legend.innerHTML = legendHtml.join('');
      }
    }, 50);
  }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  UI.init();
  // Override render to include pie chart update
  const origRender = UI.render.bind(UI);
  UI.render = function(screen) {
    origRender(screen);
    if (screen === 'statistics') {
      setTimeout(() => this.updatePieChart(), 100);
    }
  };
});
