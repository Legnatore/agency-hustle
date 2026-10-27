/* ==========================================================================
   AGENCY HUSTLE: THE MARKETING AGENCY CAREER SIM
   State Module: PubSub State Manager, Persistence & Import/Export Engine
   ========================================================================== */

import { CONFIG } from './config.js';

class StateManager {
  constructor() {
    this.listeners = new Map();
    this.STORAGE_KEY = 'AGENCY_HUSTLE_STATE_V1';
    this.state = this.getDefaultState();
  }

  // --- PubSub Event Bus ---
  subscribe(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
    return () => this.unsubscribe(event, callback);
  }

  unsubscribe(event, callback) {
    if (!this.listeners.has(event)) return;
    const filtered = this.listeners.get(event).filter(cb => cb !== callback);
    this.listeners.set(event, filtered);
  }

  notify(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => {
        try {
          cb(data);
        } catch (err) {
          console.error(`[PubSub Error on ${event}]:`, err);
        }
      });
    }
    // Also notify global wildcard listeners
    if (this.listeners.has('*')) {
      this.listeners.get('*').forEach(cb => cb(event, data));
    }
  }

  // --- Initial Default State Template ---
  getDefaultState() {
    return {
      gameStarted: false,
      isGameOver: false,
      gameOverReason: null,
      player: {
        name: 'Álex García',
        roleId: 'seo',
        level: 0,
        agencyTypeId: 'factory',
        agencyName: 'Pixel & Burnout Media',
        salary: 390,
        livingCost: 280,
        money: 1250,
        mentalHealth: 85,
        stress: 25,
        reputation: 50,
        personalBrand: 20,
        hoursBase: CONFIG.BASE_WEEKLY_HOURS,
        hoursOvertime: 0,
        skills: {
          tech: 3,
          neg: 1,
          prod: 2,
          pol: 1,
          lead: 1
        },
        activeTools: []
      },
      turn: {
        week: 1,
        year: 1,
        sprintWeeks: 1
      },
      projects: [],
      feed: [
        {
          id: 'init_msg_1',
          channel: 'general',
          author: 'Dirección de Operaciones',
          avatar: '👔',
          text: 'Bienvenido al equipo. Tu objetivo es mantener las cuentas contentas y no saturar a tus superiores.',
          time: 'Sem 1 · 09:00',
          reactions: ['👍 4', '☕ 6']
        },
        {
          id: 'init_msg_2',
          channel: 'salseo',
          author: 'Marta (Senior SEO)',
          avatar: '👩‍💻',
          text: 'Atención: si veis al socio entrar con cara de pocos amigos, decid que estáis auditando un sitemap.',
          time: 'Sem 1 · 10:15',
          reactions: ['👀 5', '🔥 2']
        }
      ],
      flags: {},
      achievements: [],
      jobMarket: [],
      pendingEvent: null,
      stats: {
        totalWeeksWorked: 0,
        totalHoursWorked: 0,
        totalMoneyEarned: 0,
        vanityReportsSold: 0,
        crisesResolved: 0,
        clientsLost: 0,
        promotionsEarned: 0
      }
    };
  }

  // --- State Accessors & Mutators ---
  getState() {
    return this.state;
  }

  updatePlayer(partial) {
    this.state.player = { ...this.state.player, ...partial };
    // Bounds clamping
    this.state.player.mentalHealth = Math.max(0, Math.min(100, this.state.player.mentalHealth));
    this.state.player.stress = Math.max(0, Math.min(100, this.state.player.stress));
    this.state.player.reputation = Math.max(0, Math.min(100, this.state.player.reputation));
    this.state.player.personalBrand = Math.max(0, Math.min(100, this.state.player.personalBrand));

    this.notify('player:updated', this.state.player);
    this.autoSave();
  }

  setSkills(skillId, newLevel) {
    if (this.state.player.skills[skillId] !== undefined) {
      this.state.player.skills[skillId] = Math.max(1, Math.min(10, newLevel));
      this.notify('skills:updated', this.state.player.skills);
      this.autoSave();
    }
  }

  setProjects(projects) {
    this.state.projects = projects;
    this.notify('projects:updated', this.state.projects);
    this.autoSave();
  }

  addFeedMessage(channel, author, avatar, text, reactions = []) {
    const timeStr = `Sem ${this.state.turn.week} · ${new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
    const msg = {
      id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      channel,
      author,
      avatar,
      text,
      time: timeStr,
      reactions
    };
    this.state.feed.unshift(msg);
    if (this.state.feed.length > 60) this.state.feed.pop();
    this.notify('feed:new', msg);
    this.autoSave();
  }

  unlockAchievement(achId) {
    if (!this.state.achievements.includes(achId)) {
      this.state.achievements.push(achId);
      const ach = CONFIG.ACHIEVEMENTS.find(a => a.id === achId);
      this.notify('achievement:unlocked', ach || { id: achId, title: achId });
      this.autoSave();
    }
  }

  setFlag(flagKey, value = true) {
    this.state.flags[flagKey] = value;
    this.notify('flag:changed', { key: flagKey, value });
    this.autoSave();
  }

  getFlag(flagKey) {
    return this.state.flags[flagKey];
  }

  // --- New Game Initialization ---
  startNewGame({ name, roleId, agencyTypeId }) {
    const roleConfig = CONFIG.ROLES[roleId] || CONFIG.ROLES.seo;
    const agencyConfig = CONFIG.AGENCY_TYPES[agencyTypeId] || CONFIG.AGENCY_TYPES.factory;

    this.state = this.getDefaultState();
    this.state.gameStarted = true;
    this.state.player.name = name || 'Álex García';
    this.state.player.roleId = roleId;
    this.state.player.agencyTypeId = agencyTypeId;
    this.state.player.agencyName = agencyTypeId === 'boutique' ? 'Studio Minimal & Chic' :
                                  agencyTypeId === 'consultancy' ? 'KPMG & Deloittics Digital' :
                                  agencyTypeId === 'startup' ? 'HyperScale Unicorn' : 'Pixel & Burnout Media';

    // Apply starting role perks & base skills
    this.state.player.skills = { ...roleConfig.baseSkills };
    this.state.player.salary = Math.round(roleConfig.startingSalary * agencyConfig.salaryMultiplier);
    this.state.player.hoursBase = CONFIG.BASE_WEEKLY_HOURS + agencyConfig.hoursBonus;

    this.notify('game:started', this.state);
    this.autoSave();
  }

  // --- Persistence & Storage ---
  autoSave() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('LocalStorage quota or permission error:', e);
    }
  }

  loadFromLocalStorage() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) {
        const loaded = JSON.parse(raw);
        if (loaded && loaded.player && loaded.turn) {
          this.state = loaded;
          this.notify('game:loaded', this.state);
          return true;
        }
      }
    } catch (e) {
      console.error('Failed to parse saved game:', e);
    }
    return false;
  }

  exportJSON() {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `agency_hustle_save_sem${this.state.turn.week}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  importJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.player && parsed.turn && parsed.projects) {
        this.state = parsed;
        this.autoSave();
        this.notify('game:loaded', this.state);
        return true;
      }
    } catch (e) {
      console.error('Invalid JSON structure:', e);
    }
    return false;
  }

  resetGame() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.state = this.getDefaultState();
    this.notify('game:reset', this.state);
  }
}

export const stateManager = new StateManager();
