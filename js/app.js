/* ==========================================================================
   AGENCY HUSTLE: THE MARKETING AGENCY CAREER SIM
   Main App: Game Loop, Turn Advancement, Endgames & Systems Orchestration
   ========================================================================== */

import { CONFIG } from './config.js';
import { stateManager } from './state.js';
import { ProjectEngine } from './projects.js';
import { EventEngine } from './events.js';
import { UIController } from './ui.js';

class GameApp {
  constructor() {
    this.stateManager = stateManager;
    this.eventEngine = new EventEngine();
    this.ui = new UIController(this.stateManager);

    this.init();
  }

  init() {
    // Subscribe UI to state changes
    this.stateManager.subscribe('player:updated', () => this.ui.renderAll(this.stateManager.getState()));
    this.stateManager.subscribe('skills:updated', () => this.ui.renderAll(this.stateManager.getState()));
    this.stateManager.subscribe('projects:updated', () => this.ui.renderAll(this.stateManager.getState()));
    this.stateManager.subscribe('feed:new', () => this.ui.renderFeed(this.stateManager.getState()));
    this.stateManager.subscribe('achievement:unlocked', (ach) => {
      this.ui.showToast(`🏆 ¡Logro Desbloqueado! "${ach.title}"`, 'warning');
      this.ui.renderAchievements(this.stateManager.getState());
    });
    this.stateManager.subscribe('game:started', (state) => {
      // Generate initial projects tailored to starting role
      const initialProjects = ProjectEngine.generateStartingPortfolio(state.player.roleId, state.player.agencyTypeId);
      this.stateManager.setProjects(initialProjects);
      this.ui.renderAll(state);
      this.ui.showToast(`🚀 ¡Comienza tu carrera como ${CONFIG.ROLES[state.player.roleId].title}!`, 'success');
    });
    this.stateManager.subscribe('game:reset', () => {
      window.location.reload();
    });

    this.bindActionHandlers();

    // Check for saved game
    const loaded = this.stateManager.loadFromLocalStorage();
    if (loaded && this.stateManager.getState().gameStarted) {
      this.ui.renderAll(this.stateManager.getState());
      this.ui.showToast('💾 Partida cargada desde el navegador.', 'info');
    } else {
      this.ui.openRoleSelectModal();
    }
  }

  bindActionHandlers() {
    // 1. Advance Turn (End Week)
    const btnAdvance = document.getElementById('btn-advance-turn');
    if (btnAdvance) {
      btnAdvance.addEventListener('click', () => this.processWeeklyTurn());
    }

    // 2. Promotion Request
    this.ui.btnRequestPromo.addEventListener('click', () => this.handlePromotionRequest());

    // 3. Endgames Action Buttons
    this.ui.btnLaunchAgency.addEventListener('click', () => this.triggerEndgame('founder'));
    this.ui.btnClaimInhouse.addEventListener('click', () => this.triggerEndgame('inhouse'));
    this.ui.btnClaimPartner.addEventListener('click', () => this.triggerEndgame('partner'));

    // 4. Settings Panel Controls
    const btnSaveManual = document.getElementById('btn-save-manual');
    if (btnSaveManual) {
      btnSaveManual.addEventListener('click', () => {
        this.stateManager.autoSave();
        this.ui.showToast('💾 Partida guardada con éxito en LocalStorage.', 'success');
      });
    }

    const btnExportJSON = document.getElementById('btn-export-json');
    if (btnExportJSON) {
      btnExportJSON.addEventListener('click', () => this.stateManager.exportJSON());
    }

    const inputImportJSON = document.getElementById('input-import-json');
    if (inputImportJSON) {
      inputImportJSON.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const success = this.stateManager.importJSON(event.target.result);
            if (success) {
              this.ui.renderAll(this.stateManager.getState());
              this.ui.showToast('📂 Partida importada con éxito.', 'success');
            } else {
              this.ui.showToast('Error: archivo JSON inválido o corrupto.', 'danger');
            }
          };
          reader.readAsText(file);
        }
      });
    }

    const btnResetGame = document.getElementById('btn-reset-game');
    if (btnResetGame) {
      btnResetGame.addEventListener('click', () => {
        if (confirm('¿Seguro que deseas reiniciar tu carrera profesional? Se borrarán todos los avances.')) {
          this.stateManager.resetGame();
        }
      });
    }

    // Sprint configuration change
    const radioSprint1 = document.getElementById('radio-sprint-1');
    const radioSprint2 = document.getElementById('radio-sprint-2');
    if (radioSprint1 && radioSprint2) {
      radioSprint1.addEventListener('change', () => {
        this.stateManager.state.turn.sprintWeeks = 1;
        this.ui.showToast('Ritmo fijado en 1 semana por turno.', 'info');
      });
      radioSprint2.addEventListener('change', () => {
        this.stateManager.state.turn.sprintWeeks = 2;
        this.ui.showToast('Ritmo fijado en Sprints de 2 semanas por turno.', 'info');
      });
    }
  }

  /**
   * Core Game Loop: Turn Advancement & Accounting
   */
  processWeeklyTurn() {
    const state = this.stateManager.getState();
    const { player, turn, projects, stats } = state;

    const highlights = [];
    let happyClients = 0;
    let vanityReportsCount = 0;

    // 1. Accounting: Paycheck & Living Costs
    const weeklyNet = player.salary - player.livingCost;
    const newMoney = player.money + weeklyNet;
    stats.totalMoneyEarned += player.salary;

    // 2. Evaluate all active projects
    const updatedProjects = projects.map(proj => {
      const evaluation = ProjectEngine.evaluateProjectTurn(proj, player);

      if (evaluation.vanitySuccess === true) {
        vanityReportsCount++;
        stats.vanityReportsSold++;
        highlights.push(`🎨 ${proj.name}: Moto vendida con éxito. Satisfacción +${evaluation.satisfactionDelta}%`);
        this.stateManager.unlockAchievement('sold_the_bike');
        if (stats.vanityReportsSold >= 5) this.stateManager.unlockAchievement('vanity_connoisseur');
      } else if (evaluation.vanitySuccess === false) {
        highlights.push(`💥 ${proj.name}: ¡Pillada con el reporte! Bronca monumental.`);
        player.stress += 15;
      } else if (evaluation.satisfactionDelta > 0) {
        happyClients++;
        highlights.push(`✅ ${proj.name}: Entregables conformes (${evaluation.satisfactionDelta > 0 ? '+' : ''}${evaluation.satisfactionDelta}%)`);
      } else {
        highlights.push(`⚠️ ${proj.name}: Queja de cliente por falta de horas (${evaluation.satisfactionDelta}%)`);
      }

      // Check for firefighter achievement
      if (proj.toxicity === 5 && proj.satisfaction > 70) {
        this.stateManager.unlockAchievement('firefighter');
      }

      return proj;
    });

    // Handle lost projects
    const survivingProjects = updatedProjects.filter(p => {
      if (p.status === 'lost') {
        stats.clientsLost++;
        highlights.push(`🚫 ${p.name} ha rescindido el contrato con la agencia por descontento.`);
        player.reputation -= 15;
        this.stateManager.addFeedMessage('clientes', 'Alerta de Cuentas', '🚨', `El cliente ${p.name} nos ha mandado a paseo. Se buscan culpables.`);
        return false;
      }
      return true;
    });

    // 3. Health & Stress Dynamics
    let stressDelta = 0;
    let mentalDelta = 0;

    if (player.hoursOvertime > 0) {
      stressDelta += 15;
      mentalDelta -= 12;
      highlights.push(`⏰ Horas extra acumuladas: +15% Estrés, -12% Salud Mental.`);
    } else {
      // Natural recovery if standard workload
      mentalDelta += 4;
      stressDelta -= 8;
    }

    // High stress penalties (>75%)
    if (player.stress > 75) {
      mentalDelta -= 10;
      highlights.push(`🔥 Estrés crítico (>75%): Has tenido pesadillas con el cliente VIP y te duele la espalda.`);
      if (Math.random() < 0.4) {
        highlights.push(`🤦‍♂️ Debido al agotamiento, olvidaste adjuntar el anexo técnico en un informe.`);
        player.reputation -= 5;
      }
    }

    // Apply Health Clamps
    const updatedMental = Math.max(0, Math.min(100, player.mentalHealth + mentalDelta));
    const updatedStress = Math.max(0, Math.min(100, player.stress + stressDelta));

    if (updatedMental < 15) {
      this.stateManager.unlockAchievement('burnout_edge');
    }

    // 4. Update Stats and Turn Counter
    stats.totalWeeksWorked += turn.sprintWeeks;
    stats.totalHoursWorked += player.hoursBase + player.hoursOvertime;

    turn.week += turn.sprintWeeks;
    if (turn.week > 52) {
      turn.year += 1;
      turn.week = 1;
    }

    if (stats.totalWeeksWorked === 1) {
      this.stateManager.unlockAchievement('first_week');
    }
    if (newMoney >= 10000) {
      this.stateManager.unlockAchievement('savings_pig');
    }

    // 5. Occasionally spawn a new client if under capacity (< 4 accounts)
    if (survivingProjects.length < 3 && Math.random() < 0.6) {
      const newClient = ProjectEngine.createClient({ level: player.level });
      survivingProjects.push(newClient);
      highlights.push(`🆕 Dirección te asigna una nueva cuenta: ${newClient.name} (${newClient.discipline}).`);
      this.stateManager.addFeedMessage('general', 'Director de Cuentas', '💼', `Bienvenido el nuevo cliente ${newClient.name}. Asignado al equipo.`);
    }

    // Update state
    this.stateManager.setProjects(survivingProjects);
    this.stateManager.updatePlayer({
      money: newMoney,
      mentalHealth: updatedMental,
      stress: updatedStress,
      hoursOvertime: 0 // Reset overtime each week
    });

    // 6. Check Game Over Conditions
    if (updatedMental <= 0) {
      this.triggerGameOver('burnout');
      return;
    }

    if (player.reputation <= 10 && stats.clientsLost >= 2) {
      this.triggerGameOver('fired');
      return;
    }

    if (newMoney <= -2000) {
      this.triggerGameOver('bankrupt');
      return;
    }

    // 7. Generate Random Coworker Slack Banter
    this.generateWeeklySlackBanter(turn.week);

    // 8. Open Turn Recap Modal
    this.ui.openTurnRecapModal({
      week: turn.week - turn.sprintWeeks,
      salary: player.salary,
      livingCost: player.livingCost,
      net: weeklyNet,
      mentalHealthDelta: mentalDelta,
      stressDelta: stressDelta,
      currentMental: updatedMental,
      currentStress: updatedStress,
      happyClients,
      totalClients: survivingProjects.length,
      highlights
    }, () => {
      // After closing recap, check for weekly random event or dilemma
      this.triggerWeeklyEvent();
    });
  }

  generateWeeklySlackBanter(week) {
    const memes = [
      { author: 'Javier (Paid Media)', avatar: '🧢', channel: 'salseo', text: 'Alguien ha vuelto a recalentar pescado en el microondas de la cocina. Por favor, parad.', reactions: ['🐟 8', '🤮 5'] },
      { author: 'Laura (Copywriter)', avatar: '✍️', channel: 'salseo', text: 'El cliente me pide que el texto sea "más disruptivo pero tradicional". Procedo a mirar el infinito.', reactions: ['💀 7', '🍷 4'] },
      { author: 'Sergio (Frontend)', avatar: '💻', channel: 'general', text: 'Recordatorio: no toquéis el servidor de staging que está sujeto con cinta aislante.', reactions: ['👀 6', '⚠️ 3'] },
      { author: 'Dirección RRHH', avatar: '🧘‍♀️', channel: 'general', text: 'Este viernes a las 14:00h tenemos sesión de Mindfulness obligatorio. Habrá manzanas.', reactions: ['🍎 2', '💤 9'] },
      { author: 'Guille (Junior SEO)', avatar: '🕶️', channel: 'salseo', text: 'He visto al socio jugar al solitario mientras decía que estaba cerrando un deal millonario.', reactions: ['🤫 8', '🃏 4'] }
    ];

    const pick = memes[Math.floor(Math.random() * memes.length)];
    this.stateManager.addFeedMessage(pick.channel, pick.author, pick.avatar, pick.text, pick.reactions);
  }

  triggerWeeklyEvent() {
    const eventData = this.eventEngine.getRandomEvent(this.stateManager.getState());
    if (!eventData) return;

    this.ui.openEventModal(eventData, (chosenOption) => {
      const outcome = chosenOption.resolve(this.stateManager.getState(), this.eventEngine);

      // Apply outcome deltas
      if (outcome) {
        const pUpdates = {};
        if (outcome.stress !== undefined) pUpdates.stress = this.stateManager.state.player.stress + outcome.stress;
        if (outcome.mentalHealth !== undefined) pUpdates.mentalHealth = this.stateManager.state.player.mentalHealth + outcome.mentalHealth;
        if (outcome.reputation !== undefined) pUpdates.reputation = this.stateManager.state.player.reputation + outcome.reputation;
        if (outcome.personalBrand !== undefined) pUpdates.personalBrand = this.stateManager.state.player.personalBrand + outcome.personalBrand;

        this.stateManager.updatePlayer(pUpdates);
        this.ui.showToast(outcome.text, 'info');

        // Post consequence summary to Slack
        this.stateManager.addFeedMessage('general', 'Resolución de Evento', '⚖️', outcome.text);
      }
    });
  }

  handlePromotionRequest() {
    const state = this.stateManager.getState();
    const { player } = state;
    const nextStep = CONFIG.CAREER_LADDER[player.level + 1];

    if (!nextStep) return;

    // Check prerequisites
    const repMet = player.reputation >= nextStep.reqRep;
    const skillsMet = Object.entries(nextStep.reqSkills).every(([sk, val]) => (player.skills[sk] || 1) >= val);

    if (repMet && skillsMet) {
      const newLevel = player.level + 1;
      const newSalary = nextStep.salaryBase;
      const newLiving = nextStep.livingCost;

      this.stateManager.updatePlayer({
        level: newLevel,
        salary: newSalary,
        livingCost: newLiving,
        reputation: Math.max(50, player.reputation - 15) // Reset baseline expectation
      });

      this.stateManager.state.stats.promotionsEarned++;
      if (newLevel >= 4) this.stateManager.unlockAchievement('team_leader');

      this.stateManager.addFeedMessage('general', 'Dirección de RRHH', '🎉', `¡Felicidades a ${player.name} por su ascenso oficial a ${nextStep.title}!`);
      this.ui.showToast(`🎊 ¡Ascenso concedido! Ahora eres ${nextStep.title} (${newSalary}€/sem).`, 'success');
    }
  }

  triggerEndgame(endingType) {
    const s = this.stateManager.getState();

    if (endingType === 'founder') {
      this.stateManager.unlockAchievement('founder_ceo');
      this.ui.openGameOverModal({
        title: '🚀 Victoria: Fundador & CEO de Tu Propia Agencia',
        icon: '🍾',
        description: 'Rompiste el contrato de asalariado, alquilaste una oficina diáfana en el centro y contrataste a tus primeros becarios. Ahora los marrones los delegas tú.',
        stats: `Semanas de carrera: ${s.stats.totalWeeksWorked} · Capital acumulado: ${s.player.money.toLocaleString('es-ES')} € · Reputación final: ${s.player.reputation}/100`
      }, () => this.stateManager.resetGame());
    } else if (endingType === 'inhouse') {
      this.stateManager.unlockAchievement('inhouse_paradise');
      this.ui.openGameOverModal({
        title: '🏝️ Victoria: El Paraíso Dorado In-House',
        icon: '🍸',
        description: 'Fichaste como Director de Marketing en un cliente final con presupuestos ilimitados. Tu mayor dilema ahora es a qué hora salir a almorzar.',
        stats: `Semanas de carrera: ${s.stats.totalWeeksWorked} · Salario final: ${s.player.salary} €/sem · Marca personal: ${s.player.personalBrand}/100`
      }, () => this.stateManager.resetGame());
    } else if (endingType === 'partner') {
      this.stateManager.unlockAchievement('partner_equity');
      this.ui.openGameOverModal({
        title: '🤝 Victoria: Socio de la Firma (Equity Partner)',
        icon: '👑',
        description: 'Entraste en el consejo de administración de la agencia. Ahora recibes dividendos mientras los demás hacen horas extra los viernes por la noche.',
        stats: `Semanas de carrera: ${s.stats.totalWeeksWorked} · Ganancias totales: ${s.stats.totalMoneyEarned.toLocaleString('es-ES')} €`
      }, () => this.stateManager.resetGame());
    }
  }

  triggerGameOver(reason) {
    const s = this.stateManager.getState();

    if (reason === 'burnout') {
      this.ui.openGameOverModal({
        title: '💀 Colapso Total por Burnout',
        icon: '🏥',
        description: 'Tu salud mental cayó a cero. Tu médico te firmó una baja médica indefinida por estrés y taquicardias. La agencia ya ha subido una oferta a LinkedIn para sustituirte.',
        stats: `Resististe ${s.stats.totalWeeksWorked} semanas en la trinchera · Dinero ahorrado: ${s.player.money.toLocaleString('es-ES')} €`
      }, () => this.stateManager.resetGame());
    } else if (reason === 'fired') {
      this.ui.openGameOverModal({
        title: '📦 Despido Disciplinario Inmediato',
        icon: '🚪',
        description: 'La pérdida encadenada de clientes y tu baja reputación colmaron el vaso. Seguridad te acompaña a la puerta con tus pertenencias en una caja de cartón.',
        stats: `Duración en la agencia: ${s.stats.totalWeeksWorked} semanas · Clientes perdidos: ${s.stats.clientsLost}`
      }, () => this.stateManager.resetGame());
    } else if (reason === 'bankrupt') {
      this.ui.openGameOverModal({
        title: '💸 Asfixia Financiera',
        icon: '📉',
        description: 'Tus deudas superaron los 2.000 € y no puedes pagar el alquiler ni la conexión a internet. Tuviste que volver a casa de tus padres.',
        stats: `Semanas trabajadas: ${s.stats.totalWeeksWorked}`
      }, () => this.stateManager.resetGame());
    }
  }
}

// Instantiate application on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.__agencyHustleApp = new GameApp();
});
