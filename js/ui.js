/* ==========================================================================
   AGENCY HUSTLE: THE MARKETING AGENCY CAREER SIM
   UI Controller: DOM Management, View Navigation, Modals & Visual Feedback
   ========================================================================== */

import { CONFIG } from './config.js';

export class UIController {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.activeChannel = 'general';
    this.bossModeActive = false;
    this.cacheDOM();
    this.bindGlobalListeners();
  }

  cacheDOM() {
    // Header & Stats elements
    this.headerAgencyName = document.getElementById('header-agency-name');
    this.headerAgencyType = document.getElementById('header-agency-type');
    this.statTurnTime = document.getElementById('stat-turn-time');
    this.statHoursPA = document.getElementById('stat-hours-pa');
    this.statMentalHealth = document.getElementById('stat-mental-health');
    this.barMentalHealth = document.getElementById('bar-mental-health');
    this.statStress = document.getElementById('stat-stress');
    this.barStress = document.getElementById('bar-stress');
    this.statReputation = document.getElementById('stat-reputation');
    this.barReputation = document.getElementById('bar-reputation');
    this.statBrand = document.getElementById('stat-brand');
    this.barBrand = document.getElementById('bar-brand');
    this.statMoney = document.getElementById('stat-money');

    // Navigation and Badges
    this.tabButtons = document.querySelectorAll('.tab-btn');
    this.viewContainers = document.querySelectorAll('.view-container');
    this.badgeProjectsCount = document.getElementById('badge-projects-count');
    this.labelPlayerTitle = document.getElementById('label-player-title');
    this.labelWeeklyNet = document.getElementById('label-weekly-net');

    // Dashboard View elements
    this.heroAvatar = document.getElementById('hero-avatar-icon');
    this.heroPlayerName = document.getElementById('hero-player-name');
    this.heroRoleBadge = document.getElementById('hero-role-badge');
    this.heroAgencyFull = document.getElementById('hero-agency-full');
    this.heroStatSalary = document.getElementById('hero-stat-salary');
    this.heroStatLiving = document.getElementById('hero-stat-living');
    this.heroStatClients = document.getElementById('hero-stat-clients');
    this.dashboardCrisisBanner = document.getElementById('dashboard-crisis-banner');
    this.crisisAlertMessage = document.getElementById('crisis-alert-message');
    this.dashboardMiniProjects = document.getElementById('dashboard-mini-projects-list');
    this.dashboardStressDiag = document.getElementById('dashboard-stress-diagnostic');
    this.dashboardPromoDiag = document.getElementById('dashboard-promo-diagnostic');

    // Projects View elements
    this.projectsContainer = document.getElementById('projects-container');
    this.projectsTotalHours = document.getElementById('projects-total-allocated-hours');
    this.btnToggleOvertime = document.getElementById('btn-toggle-overtime');

    // Job Market View elements
    this.promoAgencyName = document.getElementById('promo-agency-name');
    this.btnRequestPromo = document.getElementById('btn-request-promotion');
    this.promoCriteriaBox = document.getElementById('promo-criteria-box');
    this.headhunterStatusMsg = document.getElementById('headhunter-status-msg');
    this.jobMarketListings = document.getElementById('job-market-listings');
    this.btnLaunchAgency = document.getElementById('btn-launch-agency');
    this.btnClaimInhouse = document.getElementById('btn-claim-inhouse');
    this.btnClaimPartner = document.getElementById('btn-claim-partner');

    // Skills & Store elements
    this.skillsContainer = document.getElementById('skills-container');
    this.wellnessStoreContainer = document.getElementById('wellness-store-container');

    // Achievements elements
    this.careerStatsGrid = document.getElementById('career-stats-grid');
    this.achievementsContainer = document.getElementById('achievements-container');

    // Slack Feed elements
    this.feedContainer = document.getElementById('feed-messages-container');
    this.channelPills = document.querySelectorAll('.channel-pill');

    // Modals & Overlays
    this.modalRoleSelect = document.getElementById('modal-role-select');
    this.roleCardsContainer = document.getElementById('role-cards-container');
    this.agencyTypeSelector = document.getElementById('agency-type-selector');
    this.inputNewName = document.getElementById('input-new-name');
    this.btnStartCareer = document.getElementById('btn-start-career');

    this.modalEvent = document.getElementById('modal-event');
    this.eventModalTitle = document.getElementById('event-modal-title');
    this.eventModalText = document.getElementById('event-modal-text');
    this.eventModalOptions = document.getElementById('event-modal-options');
    this.eventTypeBadge = document.getElementById('event-type-badge');

    this.modalTurnSummary = document.getElementById('modal-turn-summary');
    this.recapWeekTitle = document.getElementById('recap-week-title');
    this.recapContentGrid = document.getElementById('recap-content-grid');
    this.recapEventsBulletList = document.getElementById('recap-events-bullet-list');
    this.btnCloseRecap = document.getElementById('btn-close-recap');

    this.modalGameOver = document.getElementById('modal-game-over');
    this.gameoverTitle = document.getElementById('gameover-title');
    this.gameoverIcon = document.getElementById('gameover-icon');
    this.gameoverDescription = document.getElementById('gameover-description');
    this.gameoverStats = document.getElementById('gameover-stats');
    this.btnGameoverRestart = document.getElementById('btn-gameover-restart');

    this.bossScreenOverlay = document.getElementById('boss-screen-overlay');
    this.btnBossMode = document.getElementById('btn-boss-mode');
    this.bossExitBtn = document.getElementById('boss-exit-btn');
    this.toastContainer = document.getElementById('toast-container');
  }

  bindGlobalListeners() {
    // Tab switching
    this.tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetView = btn.getAttribute('data-view');
        this.switchTab(targetView);
      });
    });

    // Boss mode trigger buttons and keyboard shortcut ESC
    this.btnBossMode.addEventListener('click', () => this.toggleBossMode());
    this.bossExitBtn.addEventListener('click', () => this.toggleBossMode(false));
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.toggleBossMode();
      }
    });

    // Slack channel selector
    this.channelPills.forEach(pill => {
      pill.addEventListener('click', () => {
        this.channelPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.activeChannel = pill.getAttribute('data-channel');
        this.renderFeed(this.stateManager.getState());
      });
    });

    // Quick navigation from dashboard
    const quickNavProjects = document.getElementById('btn-quick-nav-projects');
    if (quickNavProjects) {
      quickNavProjects.addEventListener('click', () => this.switchTab('projects'));
    }

    // Quick emergency relief buttons on dashboard
    const btnQuickCoffee = document.getElementById('btn-quick-coffee');
    if (btnQuickCoffee) {
      btnQuickCoffee.addEventListener('click', () => {
        const s = this.stateManager.getState();
        if (s.player.money >= 5) {
          this.stateManager.updatePlayer({
            money: s.player.money - 5,
            stress: s.player.stress - 10
          });
          this.showToast('☕ Café tomado: -10% Estrés', 'success');
        } else {
          this.showToast('No tienes ni 5€ en la cuenta...', 'danger');
        }
      });
    }

    const btnQuickWalk = document.getElementById('btn-quick-walk');
    if (btnQuickWalk) {
      btnQuickWalk.addEventListener('click', () => {
        const s = this.stateManager.getState();
        this.stateManager.updatePlayer({
          mentalHealth: s.player.mentalHealth + 5,
          stress: s.player.stress - 5
        });
        this.showToast('🚶 Paseo de escaqueo: +5% Salud Mental', 'success');
      });
    }

    // Resolve crisis quick action
    const btnResolveCrisis = document.getElementById('btn-resolve-crisis');
    if (btnResolveCrisis) {
      btnResolveCrisis.addEventListener('click', () => {
        this.switchTab('projects');
        this.showToast('🚨 Asigna horas extra o activa "Vender la Moto" para salvar las cuentas en peligro.', 'warning');
      });
    }

    // Refresh jobs in market
    const btnRefreshJobs = document.getElementById('btn-refresh-jobs');
    if (btnRefreshJobs) {
      btnRefreshJobs.addEventListener('click', () => {
        this.renderJobMarket(this.stateManager.getState());
        this.showToast('🔄 Portal de empleo actualizado con nuevas oportunidades del sector.', 'info');
      });
    }
  }

  switchTab(viewId) {
    this.tabButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-view') === viewId);
    });
    this.viewContainers.forEach(container => {
      container.classList.toggle('active', container.id === `view-${viewId}`);
    });
  }

  toggleBossMode(forceState = null) {
    this.bossModeActive = forceState !== null ? forceState : !this.bossModeActive;
    this.bossScreenOverlay.classList.toggle('active', this.bossModeActive);
    if (this.bossModeActive) {
      this.stateManager.unlockAchievement('boss_mode_ninja');
    }
  }

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'warning') icon = '⚠️';
    if (type === 'danger') icon = '💥';

    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.25s ease-out';
      setTimeout(() => toast.remove(), 250);
    }, 3500);
  }

  // --- Primary Render Pipeline ---
  renderAll(state) {
    if (!state.gameStarted) {
      this.openRoleSelectModal();
      return;
    }

    this.renderHeader(state);
    this.renderDashboard(state);
    this.renderProjects(state);
    this.renderJobMarket(state);
    this.renderSkillsAndWellness(state);
    this.renderAchievements(state);
    this.renderFeed(state);
  }

  renderHeader(state) {
    const { player, turn, projects } = state;
    const ladderStep = CONFIG.CAREER_LADDER[player.level] || CONFIG.CAREER_LADDER[0];
    const agencyConfig = CONFIG.AGENCY_TYPES[player.agencyTypeId] || CONFIG.AGENCY_TYPES.factory;

    this.headerAgencyName.textContent = player.agencyName;
    this.headerAgencyType.textContent = agencyConfig.name;

    this.statTurnTime.textContent = `Sem ${turn.week} · Año ${turn.year}`;

    // Available vs allocated hours
    const totalAllocated = projects.reduce((acc, p) => acc + p.allocatedHours, 0);
    const maxCapacity = player.hoursBase + player.hoursOvertime;
    this.statHoursPA.textContent = `${totalAllocated} / ${maxCapacity}h`;

    // Mental health progress & alerts
    this.statMentalHealth.textContent = `${player.mentalHealth}%`;
    this.barMentalHealth.style.width = `${player.mentalHealth}%`;
    if (player.mentalHealth < 20) {
      this.barMentalHealth.style.backgroundColor = 'var(--accent-danger)';
    }

    // Stress progress & alerts
    this.statStress.textContent = `${player.stress}%`;
    this.barStress.style.width = `${player.stress}%`;
    if (player.stress > 75) {
      this.barStress.parentElement.style.boxShadow = '0 0 10px rgba(239, 68, 68, 0.8)';
    } else {
      this.barStress.parentElement.style.boxShadow = 'none';
    }

    // Reputation & Brand
    this.statReputation.textContent = `${player.reputation}/100`;
    this.barReputation.style.width = `${player.reputation}%`;
    this.statBrand.textContent = `${player.personalBrand}/100`;
    this.barBrand.style.width = `${player.personalBrand}%`;

    // Money
    this.statMoney.textContent = `${player.money.toLocaleString('es-ES')} €`;

    // Subnav info
    this.labelPlayerTitle.textContent = ladderStep.title;
    const net = player.salary - player.livingCost;
    this.labelWeeklyNet.textContent = `${net >= 0 ? '+' : ''}${net}€ / sem`;
    this.badgeProjectsCount.textContent = projects.length;
  }

  renderDashboard(state) {
    const { player, projects } = state;
    const roleCfg = CONFIG.ROLES[player.roleId] || CONFIG.ROLES.seo;

    this.heroAvatar.textContent = roleCfg.icon;
    this.heroPlayerName.textContent = player.name;
    this.heroRoleBadge.textContent = roleCfg.title;
    this.heroAgencyFull.textContent = `${player.agencyName} · Nivel: ${CONFIG.CAREER_LADDER[player.level].title}`;
    this.heroStatSalary.textContent = `${player.salary} €`;
    this.heroStatLiving.textContent = `${player.livingCost} €`;
    this.heroStatClients.textContent = projects.length;

    // Crisis banner check
    const endangered = projects.find(p => p.status === 'warning' || p.satisfaction < 35);
    if (endangered) {
      this.dashboardCrisisBanner.style.display = 'flex';
      this.crisisAlertMessage.textContent = `¡Crisis en ${endangered.name}! Satisfacción crítica (${endangered.satisfaction}%). Asigna más horas o vende la moto.`;
    } else if (player.stress > 75) {
      this.dashboardCrisisBanner.style.display = 'flex';
      this.crisisAlertMessage.textContent = `¡Estrés Desbordado (${player.stress}%)! Riesgo severo de cometer errores fatales en los entregables.`;
    } else {
      this.dashboardCrisisBanner.style.display = 'none';
    }

    // Mini Projects list in dashboard
    this.dashboardMiniProjects.innerHTML = '';
    projects.slice(0, 4).forEach(p => {
      const item = document.createElement('div');
      item.style.cssText = 'background:var(--bg-sidebar); padding:10px 14px; border-radius:8px; display:flex; align-items:center; justify-content:space-between; font-size:0.82rem;';
      item.innerHTML = `
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="font-size:1.2rem;">${p.icon}</span>
          <div>
            <strong>${p.name}</strong>
            <div style="font-size:0.7rem; color:var(--text-muted);">${p.discipline} · ${p.allocatedHours}/${p.requiredHours}h asignadas</div>
          </div>
        </div>
        <div style="text-align:right;">
          <span style="font-family:var(--font-mono); font-weight:700; color:${p.satisfaction > 50 ? 'var(--accent-success)' : 'var(--accent-danger)'};">
            ${p.satisfaction}% Sat.
          </span>
          <div style="font-size:0.68rem; color:var(--text-muted);">${p.tacticVanity ? '🚲 Moto activa' : 'Normal'}</div>
        </div>
      `;
      this.dashboardMiniProjects.appendChild(item);
    });

    // Stress and Promo diagnostics text
    if (player.stress > 75) {
      this.dashboardStressDiag.textContent = '🔥 Alarma roja: Tu nivel de estrés reduce tu calidad técnica y amenaza con baja por ansiedad.';
      this.dashboardStressDiag.style.color = 'var(--accent-danger)';
    } else if (player.stress > 50) {
      this.dashboardStressDiag.textContent = '⚡ Tensión moderada: Cargas con bastantes marrones. Un café o desconexión vendría bien.';
      this.dashboardStressDiag.style.color = 'var(--accent-warning)';
    } else {
      this.dashboardStressDiag.textContent = '🧘 Nivel controlado. Trabajas con precisión y serenidad.';
      this.dashboardStressDiag.style.color = 'var(--accent-success)';
    }

    const nextLadder = CONFIG.CAREER_LADDER[player.level + 1];
    if (nextLadder) {
      const repOk = player.reputation >= nextLadder.reqRep;
      this.dashboardPromoDiag.textContent = repOk 
        ? `⭐ Listo para ascender a ${nextLadder.title}. Ve a la pestaña Mercado Laboral.`
        : `Faltan ${nextLadder.reqRep - player.reputation} pts de Reputación para aspirar a ${nextLadder.title}.`;
    } else {
      this.dashboardPromoDiag.textContent = `👑 Has alcanzado el rango máximo en la agencia.`;
    }
  }

  renderProjects(state) {
    const { player, projects } = state;
    this.projectsContainer.innerHTML = '';

    const totalAllocated = projects.reduce((acc, p) => acc + p.allocatedHours, 0);
    const maxCapacity = player.hoursBase + player.hoursOvertime;
    this.projectsTotalHours.textContent = `${totalAllocated} / ${maxCapacity}h`;
    this.projectsTotalHours.classList.toggle('overtime', totalAllocated > player.hoursBase);

    // Overtime toggle button state
    this.btnToggleOvertime.textContent = player.hoursOvertime > 0 
      ? `⏰ Horas Extra Activas (+${player.hoursOvertime}h)` 
      : `+ Meter Horas Extra (Max +15h)`;

    projects.forEach(project => {
      const card = document.createElement('div');
      const toxClass = project.toxicity >= 4 ? 'high-toxicity' : project.toxicity >= 3 ? 'moderate-toxicity' : 'low-toxicity';
      card.className = `project-card ${toxClass}`;

      card.innerHTML = `
        <div class="project-card-header">
          <div class="client-identity">
            <div class="client-avatar">${project.icon}</div>
            <div class="client-title-block">
              <h3>${project.name}</h3>
              <div class="client-industry">${project.sector}</div>
            </div>
          </div>
          <span class="discipline-tag">${project.discipline}</span>
        </div>

        <div class="project-meta-pills">
          <span class="meta-pill fee">💶 ${project.feeMonthly}€/mes</span>
          <span class="meta-pill toxicity" title="Nivel de toxicidad y broncas">${'💀'.repeat(project.toxicity)} Tox ${project.toxicity}/5</span>
          <span class="meta-pill expectations" title="${project.expectationsDesc}">🎯 ${project.expectations}</span>
        </div>

        <!-- Satisfaction Bar -->
        <div class="satisfaction-bar-row">
          <div class="satisfaction-label-strip">
            <span>Satisfacción del Cliente</span>
            <span style="font-family:var(--font-mono); font-weight:700;">${project.satisfaction}%</span>
          </div>
          <div class="satisfaction-track">
            <div class="satisfaction-fill" style="width:${project.satisfaction}%; background:${
              project.satisfaction > 65 ? 'var(--accent-success)' : project.satisfaction > 35 ? 'var(--accent-warning)' : 'var(--accent-danger)'
            };"></div>
          </div>
        </div>

        <!-- Controls: Stepper, Vanity & Delegate -->
        <div class="project-controls-panel">
          <div class="hours-assigner">
            <span style="font-size:0.75rem; font-weight:600; color:var(--text-secondary);">
              Horas Requeridas: <strong>${project.requiredHours}h</strong>
            </span>
            <div class="hours-stepper">
              <button class="btn-stepper btn-sub-hours" data-id="${project.id}">-</button>
              <span class="hours-display">${project.allocatedHours}h</span>
              <button class="btn-stepper btn-add-hours" data-id="${project.id}">+</button>
            </div>
          </div>

          <div class="project-tactics-row">
            <button class="btn-tactic-vanity ${project.tacticVanity ? 'active' : ''}" data-id="${project.id}" title="Genera gráficos de vanidad e infla métricas para camuflar falta de horas (Riesgo según Negociación y Política)">
              <span>🚲</span> ${project.tacticVanity ? 'Moto Vendida' : 'Vender la Moto'}
            </button>
            <button class="btn-tactic-delegate" data-id="${project.id}" ${player.skills.lead < 3 ? 'disabled title="Requiere Liderazgo ≥ 3 para delegar"' : ''}>
              <span>👑</span> ${project.delegatedHours > 0 ? `Delegadas: ${project.delegatedHours}h` : 'Delegar a Junior'}
            </button>
          </div>
        </div>
      `;

      // Stepper button events
      card.querySelector('.btn-sub-hours').addEventListener('click', () => {
        if (project.allocatedHours > 0) {
          project.allocatedHours = Math.max(0, project.allocatedHours - 2);
          this.stateManager.setProjects(projects);
        }
      });

      card.querySelector('.btn-add-hours').addEventListener('click', () => {
        const currentTotal = projects.reduce((acc, p) => acc + p.allocatedHours, 0);
        if (currentTotal + 2 <= maxCapacity) {
          project.allocatedHours += 2;
          this.stateManager.setProjects(projects);
        } else {
          this.showToast('No tienes más horas semanales libres. Añade Horas Extra.', 'warning');
        }
      });

      // Vanity toggle
      card.querySelector('.btn-tactic-vanity').addEventListener('click', () => {
        project.tacticVanity = !project.tacticVanity;
        this.stateManager.setProjects(projects);
        this.showToast(project.tacticVanity ? '🚲 Preparando informe con métricas de vanidad...' : 'Táctica cancelada.', 'info');
      });

      // Delegate toggle
      const btnDelegate = card.querySelector('.btn-tactic-delegate');
      if (btnDelegate && player.skills.lead >= 3) {
        btnDelegate.addEventListener('click', () => {
          project.delegatedHours = project.delegatedHours === 0 ? 6 : 0;
          this.stateManager.setProjects(projects);
          this.showToast(project.delegatedHours > 0 ? '👑 Has derivado 6h de tareas mecánicas a un becario.' : 'Delegación cancelada.', 'info');
        });
      }

      this.projectsContainer.appendChild(card);
    });

    // Overtime button trigger
    this.btnToggleOvertime.onclick = () => {
      if (player.hoursOvertime === 0) {
        this.stateManager.updatePlayer({
          hoursOvertime: 10,
          stress: player.stress + 15,
          mentalHealth: player.mentalHealth - 10
        });
        this.stateManager.unlockAchievement('overtime_warrior');
        this.showToast('⏰ +10 Horas extra activadas. Tu salud mental y estrés pagan el precio.', 'warning');
      } else {
        this.stateManager.updatePlayer({ hoursOvertime: 0 });
        this.showToast('Descanso estándar restablecido.', 'info');
      }
    };
  }

  renderJobMarket(state) {
    const { player } = state;
    this.promoAgencyName.textContent = player.agencyName;

    // Promotion criteria
    const currentStep = CONFIG.CAREER_LADDER[player.level];
    const nextStep = CONFIG.CAREER_LADDER[player.level + 1];

    if (!nextStep) {
      this.promoCriteriaBox.innerHTML = `<div>👑 Has alcanzado el rango máximo en esta agencia (${currentStep.title}).</div>`;
      this.btnRequestPromo.disabled = true;
    } else {
      const repMet = player.reputation >= nextStep.reqRep;
      const skillsMet = Object.entries(nextStep.reqSkills).every(([sk, val]) => (player.skills[sk] || 1) >= val);

      this.promoCriteriaBox.innerHTML = `
        <div style="flex:1;">
          <strong>Siguiente Escalón:</strong> <span style="color:var(--accent-cyan); font-weight:700;">${nextStep.title}</span> (+${nextStep.salaryBase - currentStep.salaryBase}€/sem)
        </div>
        <div class="job-req-tag ${repMet ? 'fulfilled' : 'unfulfilled'}">
          ${repMet ? '✅' : '❌'} Reputación: ${player.reputation} / ${nextStep.reqRep}
        </div>
        ${Object.entries(nextStep.reqSkills).map(([sk, val]) => `
          <div class="job-req-tag ${(player.skills[sk] || 1) >= val ? 'fulfilled' : 'unfulfilled'}">
            ${(player.skills[sk] || 1) >= val ? '✅' : '❌'} ${CONFIG.SKILLS[sk].name}: ${player.skills[sk] || 1}/${val}
          </div>
        `).join('')}
      `;

      this.btnRequestPromo.disabled = !(repMet && skillsMet);
    }

    // Headhunter status
    if (player.personalBrand >= 70) {
      this.headhunterStatusMsg.textContent = '🌟 Tu perfil es viral en LinkedIn. Recibes ofertas agresivas de consultoras y clientes finales.';
    } else if (player.personalBrand >= 40) {
      this.headhunterStatusMsg.textContent = '📬 Tu visibilidad atrae propuestas de agencias rivales y puestos sénior.';
    } else {
      this.headhunterStatusMsg.textContent = '🌱 Tu perfil es modesto. Publica o toma cursos de marca para atraer cazatalentos.';
    }

    // Mock LinkedIn Job Listings
    this.jobMarketListings.innerHTML = '';
    const jobListings = [
      {
        id: 'job_startup_growth',
        title: 'Head of Growth / Acquisition',
        company: 'HyperGrowth FinTech',
        logo: '🦄',
        salary: '1.400 € / sem',
        reqRep: 60,
        reqBrand: 45,
        reqTech: 6
      },
      {
        id: 'job_boutique_lead',
        title: 'Director de Estrategia Digital',
        company: 'Atelier Brand & Stories',
        logo: '🎨',
        salary: '1.200 € / sem',
        reqRep: 50,
        reqBrand: 35,
        reqTech: 5
      },
      {
        id: 'job_corp_inhouse',
        title: 'Digital Marketing Manager (In-House)',
        company: 'Global Retail Group',
        logo: '🏬',
        salary: '1.800 € / sem',
        reqRep: 75,
        reqBrand: 65,
        reqTech: 7
      }
    ];

    jobListings.forEach(job => {
      const repOk = player.reputation >= job.reqRep;
      const brandOk = player.personalBrand >= job.reqBrand;
      const techOk = player.skills.tech >= job.reqTech;
      const eligible = repOk && brandOk && techOk;

      const card = document.createElement('div');
      card.className = 'job-card';
      card.innerHTML = `
        <div class="job-company-col">
          <div class="job-logo">${job.logo}</div>
          <div class="job-title-salary">
            <h3>${job.title}</h3>
            <span class="job-salary">${job.salary} · ${job.company}</span>
          </div>
        </div>
        <div class="job-requirements-list">
          <span class="job-req-tag ${repOk ? 'fulfilled' : 'unfulfilled'}">Rep: ${job.reqRep}</span>
          <span class="job-req-tag ${brandOk ? 'fulfilled' : 'unfulfilled'}">Marca: ${job.reqBrand}</span>
          <span class="job-req-tag ${techOk ? 'fulfilled' : 'unfulfilled'}">Técnica: ${job.reqTech}</span>
        </div>
        <button class="btn-primary btn-sm btn-apply-job" ${!eligible ? 'disabled' : ''}>
          ${eligible ? 'Postular con 1-Click' : 'Requisitos Insuficientes'}
        </button>
      `;

      if (eligible) {
        card.querySelector('.btn-apply-job').addEventListener('click', () => {
          this.stateManager.updatePlayer({
            salary: parseInt(job.salary.replace(/[^0-9]/g, '')),
            agencyName: job.company,
            reputation: 50
          });
          this.stateManager.addFeedMessage('general', 'LinkedIn Notifier', '💼', `¡Enhorabuena! Has fichado oficialmente por ${job.company}.`);
          this.showToast(`🎉 ¡Fichaje completado! Ahora trabajas en ${job.company}.`, 'success');
        });
      }

      this.jobMarketListings.appendChild(card);
    });

    // Check Endgames Eligibility
    const canFounder = player.money >= 25000 && player.reputation >= 75 && player.skills.lead >= 6;
    this.btnLaunchAgency.disabled = !canFounder;

    const canInhouse = player.personalBrand >= 80 && player.skills.tech >= 7 && player.skills.neg >= 7;
    this.btnClaimInhouse.disabled = !canInhouse;

    const canPartner = player.level >= 5 && player.reputation >= 90 && player.skills.pol >= 8;
    this.btnClaimPartner.disabled = !canPartner;
  }

  renderSkillsAndWellness(state) {
    const { player } = state;

    // 5 Skills
    this.skillsContainer.innerHTML = '';
    Object.values(CONFIG.SKILLS).forEach(sk => {
      const level = player.skills[sk.id] || 1;
      const upgradeCost = level * 180;
      const canAfford = player.money >= upgradeCost && level < 10;

      const card = document.createElement('div');
      card.className = 'skill-card';
      card.innerHTML = `
        <div class="skill-header">
          <div class="skill-icon-name">
            <span>${sk.icon}</span>
            <span>${sk.name}</span>
          </div>
          <span class="skill-level-tag">Nvl ${level}/10</span>
        </div>

        <div class="skill-pips-bar">
          ${Array.from({ length: 10 }, (_, i) => `<div class="skill-pip ${i < level ? 'filled' : ''}"></div>`).join('')}
        </div>

        <p class="skill-desc">${sk.desc}</p>

        <div class="skill-upgrade-action">
          <span class="upgrade-cost-text">${level < 10 ? `Coste: ${upgradeCost} €` : 'NIVEL MÁXIMO'}</span>
          <button class="btn-primary btn-sm btn-upgrade-skill" ${!canAfford ? 'disabled' : ''}>
            ${level < 10 ? 'Subir Nivel (+1)' : 'Dominado'}
          </button>
        </div>
      `;

      if (canAfford) {
        card.querySelector('.btn-upgrade-skill').addEventListener('click', () => {
          this.stateManager.updatePlayer({ money: player.money - upgradeCost });
          this.stateManager.setSkills(sk.id, level + 1);
          this.showToast(`✨ Habilidad ${sk.name} mejorada al nivel ${level + 1}!`, 'success');
        });
      }

      this.skillsContainer.appendChild(card);
    });

    // Wellness & Store Catalog
    this.wellnessStoreContainer.innerHTML = '';
    CONFIG.WELLNESS_ITEMS.forEach(item => {
      const canBuy = player.money >= item.price;
      const card = document.createElement('div');
      card.className = 'store-item-card';
      card.innerHTML = `
        <div class="store-item-header">
          <span class="store-item-icon">${item.icon}</span>
          <div>
            <h4 style="font-size:0.88rem; font-weight:700;">${item.title}</h4>
            <span class="store-item-price">${item.price} €</span>
          </div>
        </div>
        <p style="font-size:0.75rem; color:var(--text-secondary); line-height:1.35; margin:6px 0;">${item.description}</p>
        <button class="btn-secondary btn-sm btn-buy-item" ${!canBuy ? 'disabled' : ''}>
          ${canBuy ? 'Comprar / Contratar' : 'Sin Fondos'}
        </button>
      `;

      if (canBuy) {
        card.querySelector('.btn-buy-item').addEventListener('click', () => {
          const updates = { money: player.money - item.price };
          if (item.effect.stress) updates.stress = player.stress + item.effect.stress;
          if (item.effect.mentalHealth) updates.mentalHealth = player.mentalHealth + item.effect.mentalHealth;
          if (item.effect.brand) updates.personalBrand = player.personalBrand + item.effect.brand;
          if (item.effect.reputation) updates.reputation = player.reputation + item.effect.reputation;
          if (item.effect.tech) updates.skills = { ...player.skills, tech: Math.min(10, player.skills.tech + item.effect.tech) };

          this.stateManager.updatePlayer(updates);
          this.showToast(`🛍️ Adquirido: ${item.title}`, 'success');
        });
      }

      this.wellnessStoreContainer.appendChild(card);
    });
  }

  renderAchievements(state) {
    const { achievements, stats } = state;

    // Career Stats
    this.careerStatsGrid.innerHTML = `
      <div class="col-3" style="background:var(--bg-sidebar); padding:12px; border-radius:8px;">
        <span style="font-size:0.7rem; color:var(--text-muted); font-weight:600;">SEMANAS JUGADAS</span>
        <div style="font-family:var(--font-mono); font-size:1.3rem; font-weight:800;">${stats.totalWeeksWorked}</div>
      </div>
      <div class="col-3" style="background:var(--bg-sidebar); padding:12px; border-radius:8px;">
        <span style="font-size:0.7rem; color:var(--text-muted); font-weight:600;">INGRESOS TOTALES</span>
        <div style="font-family:var(--font-mono); font-size:1.3rem; font-weight:800; color:var(--accent-success);">${stats.totalMoneyEarned.toLocaleString('es-ES')} €</div>
      </div>
      <div class="col-3" style="background:var(--bg-sidebar); padding:12px; border-radius:8px;">
        <span style="font-size:0.7rem; color:var(--text-muted); font-weight:600;">MOTOS VENDIDAS</span>
        <div style="font-family:var(--font-mono); font-size:1.3rem; font-weight:800; color:#d8b4fe;">${stats.vanityReportsSold}</div>
      </div>
      <div class="col-3" style="background:var(--bg-sidebar); padding:12px; border-radius:8px;">
        <span style="font-size:0.7rem; color:var(--text-muted); font-weight:600;">CRISIS SALVADAS</span>
        <div style="font-family:var(--font-mono); font-size:1.3rem; font-weight:800; color:var(--accent-cyan);">${stats.crisesResolved}</div>
      </div>
    `;

    // Achievements Catalog
    this.achievementsContainer.innerHTML = '';
    CONFIG.ACHIEVEMENTS.forEach(ach => {
      const unlocked = achievements.includes(ach.id);
      const card = document.createElement('div');
      card.className = `achievement-card ${unlocked ? 'unlocked' : ''}`;
      card.innerHTML = `
        <div class="achievement-icon">${ach.icon}</div>
        <div class="achievement-info">
          <h4>${ach.title}</h4>
          <p>${ach.description}</p>
          ${unlocked ? '<div class="achievement-date">★ Desbloqueado</div>' : ''}
        </div>
      `;
      this.achievementsContainer.appendChild(card);
    });
  }

  renderFeed(state) {
    const { feed } = state;
    const filtered = feed.filter(m => this.activeChannel === 'general' ? true : m.channel === this.activeChannel);

    this.feedContainer.innerHTML = '';
    filtered.slice(0, 30).forEach(msg => {
      const item = document.createElement('div');
      item.className = 'feed-message-item';
      item.innerHTML = `
        <div class="feed-msg-avatar">${msg.avatar}</div>
        <div class="feed-msg-content">
          <div class="feed-msg-header">
            <span class="feed-author-name">${msg.author}</span>
            <span class="feed-timestamp">${msg.time}</span>
          </div>
          <p class="feed-msg-text">${msg.text}</p>
          ${msg.reactions && msg.reactions.length ? `
            <div class="feed-reactions-row">
              ${msg.reactions.map(r => `<span class="reaction-badge">${r}</span>`).join('')}
            </div>
          ` : ''}
        </div>
      `;
      this.feedContainer.appendChild(item);
    });
  }

  // --- Modals Orchestration ---
  openRoleSelectModal() {
    this.modalRoleSelect.classList.add('active');

    // Populate agency types
    this.agencyTypeSelector.innerHTML = '';
    let selectedAgency = 'factory';

    Object.values(CONFIG.AGENCY_TYPES).forEach(ag => {
      const label = document.createElement('label');
      label.style.cssText = 'background:var(--bg-sidebar); border:1px solid var(--border-subtle); padding:10px; border-radius:6px; cursor:pointer; font-size:0.78rem; display:flex; flex-direction:column; gap:2px;';
      label.innerHTML = `
        <div style="display:flex; align-items:center; gap:6px;">
          <input type="radio" name="init-agency" value="${ag.id}" ${ag.id === selectedAgency ? 'checked' : ''}>
          <strong>${ag.icon} ${ag.name}</strong>
        </div>
        <span style="color:var(--text-muted); font-size:0.7rem; margin-top:4px;">${ag.description}</span>
      `;
      label.querySelector('input').addEventListener('change', () => {
        selectedAgency = ag.id;
      });
      this.agencyTypeSelector.appendChild(label);
    });

    // Populate roles
    this.roleCardsContainer.innerHTML = '';
    let selectedRoleId = 'seo';

    Object.values(CONFIG.ROLES).forEach(r => {
      const card = document.createElement('div');
      card.style.cssText = 'background:var(--bg-sidebar); border:1px solid var(--border-medium); border-radius:8px; padding:12px; cursor:pointer; display:flex; flex-direction:column; justify-content:space-between; gap:6px;';
      card.innerHTML = `
        <div>
          <div style="display:flex; align-items:center; gap:6px; font-weight:700; font-size:0.9rem;">
            <span>${r.icon}</span> <span>${r.title}</span>
          </div>
          <p style="font-size:0.75rem; color:var(--text-secondary); margin-top:4px; line-height:1.3;">${r.description}</p>
        </div>
        <div style="font-size:0.7rem; color:var(--accent-cyan); font-family:var(--font-mono);">
          Sueldo base: ${r.startingSalary}€/sem · ${r.perk}
        </div>
      `;

      card.addEventListener('click', () => {
        this.roleCardsContainer.querySelectorAll('div').forEach(c => c.style.borderColor = 'var(--border-medium)');
        card.style.borderColor = 'var(--accent-primary)';
        selectedRoleId = r.id;
      });

      this.roleCardsContainer.appendChild(card);
    });

    // Start career handler
    this.btnStartCareer.onclick = () => {
      const name = this.inputNewName.value.trim() || 'Álex García';
      this.modalRoleSelect.classList.remove('active');
      this.stateManager.startNewGame({
        name,
        roleId: selectedRoleId,
        agencyTypeId: selectedAgency
      });
    };
  }

  openEventModal(eventData, onChoiceSelected) {
    this.eventModalTitle.textContent = eventData.title;
    this.eventModalText.textContent = eventData.text;
    this.eventTypeBadge.textContent = eventData.type.toUpperCase();
    this.eventModalOptions.innerHTML = '';

    const state = this.stateManager.getState();
    const optionsToRender = [...eventData.options];
    const anyAvailable = optionsToRender.some(opt => opt.isAvailable(state));

    if (!anyAvailable) {
      optionsToRender.push({
        text: 'Aceptar la situación sin confrontación y seguir adelante.',
        reqLabel: 'Opción por defecto',
        isAvailable: () => true,
        resolve: () => ({
          text: 'Al no contar con las habilidades para rebatir o intervenir, decides acatar las órdenes y continuar tu jornada.',
          stress: +5
        })
      });
    }

    optionsToRender.forEach(opt => {
      const available = opt.isAvailable(state);
      const btn = document.createElement('button');
      btn.className = 'dilemma-option-btn';
      if (!available) {
        btn.disabled = true;
        btn.style.opacity = '0.45';
        btn.style.cursor = 'not-allowed';
      }

      btn.innerHTML = `
        <div class="option-action-title">
          <span>${opt.text}</span>
          ${opt.reqLabel ? `<span class="option-req-badge">${opt.reqLabel}</span>` : ''}
        </div>
        <span class="option-risk-preview">${available ? '👉 Clic para ejecutar esta decisión' : 'Requisitos no cumplidos'}</span>
      `;

      btn.addEventListener('click', () => {
        this.modalEvent.classList.remove('active');
        onChoiceSelected(opt);
      });

      this.eventModalOptions.appendChild(btn);
    });

    this.modalEvent.classList.add('active');
  }

  openTurnRecapModal(recapData, onNextWeek) {
    this.recapWeekTitle.textContent = `Semana ${recapData.week} Completada`;
    this.recapContentGrid.innerHTML = `
      <div class="recap-block">
        <h4>Finanzas Semanales</h4>
        <div class="recap-stat-row">
          <span>Salario Bruto:</span>
          <strong style="color:var(--accent-success);">+${recapData.salary} €</strong>
        </div>
        <div class="recap-stat-row">
          <span>Coste de Vida:</span>
          <strong style="color:var(--accent-danger);">-${recapData.livingCost} €</strong>
        </div>
        <div class="recap-stat-row">
          <span>Balance Neto:</span>
          <strong>${recapData.net >= 0 ? '+' : ''}${recapData.net} €</strong>
        </div>
      </div>

      <div class="recap-block">
        <h4>Salud & Estado</h4>
        <div class="recap-stat-row">
          <span>Salud Mental:</span>
          <strong>${recapData.mentalHealthDelta >= 0 ? '+' : ''}${recapData.mentalHealthDelta}% (${recapData.currentMental}%)</strong>
        </div>
        <div class="recap-stat-row">
          <span>Estrés:</span>
          <strong>${recapData.stressDelta >= 0 ? '+' : ''}${recapData.stressDelta}% (${recapData.currentStress}%)</strong>
        </div>
        <div class="recap-stat-row">
          <span>Cuentas con Éxito:</span>
          <strong>${recapData.happyClients} / ${recapData.totalClients}</strong>
        </div>
      </div>
    `;

    this.recapEventsBulletList.innerHTML = `
      <h4 style="font-size:0.78rem; color:var(--text-muted); text-transform:uppercase; margin-bottom:6px;">Resultados Destacados</h4>
      <ul style="font-size:0.8rem; list-style:none; display:flex; flex-direction:column; gap:4px;">
        ${recapData.highlights.map(h => `<li>🔹 ${h}</li>`).join('')}
      </ul>
    `;

    this.btnCloseRecap.onclick = () => {
      this.modalTurnSummary.classList.remove('active');
      if (onNextWeek) onNextWeek();
    };

    this.modalTurnSummary.classList.add('active');
  }

  openGameOverModal({ title, icon, description, stats }, onRestart) {
    this.gameoverTitle.textContent = title;
    this.gameoverIcon.textContent = icon;
    this.gameoverDescription.textContent = description;
    this.gameoverStats.textContent = stats;

    this.btnGameoverRestart.onclick = () => {
      this.modalGameOver.classList.remove('active');
      if (onRestart) onRestart();
    };

    this.modalGameOver.classList.add('active');
  }
}
