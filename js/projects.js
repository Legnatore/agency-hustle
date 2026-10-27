/* ==========================================================================
   AGENCY HUSTLE: THE MARKETING AGENCY CAREER SIM
   Projects Module: Procedural Client & Account Generator, Vanity Metrics & Tactics
   ========================================================================== */

const COMPANY_NAMES = [
  { name: 'Kombucha Rebelde SL', sector: 'Bebidas Bio Hipster', icon: '🍵' },
  { name: 'Dentista Dr. Muelas', sector: 'Clínica Dental Local', icon: '🦷' },
  { name: 'CryptoMoon DAO', sector: 'Fintech & Web3', icon: '🪙' },
  { name: 'FastFashion Express', sector: 'E-commerce Ultra Rápido', icon: '👗' },
  { name: 'Bufete Legálitas & Boomer', sector: 'Servicios Jurídicos', icon: '⚖️' },
  { name: 'CloudScale DevOps SaaS', sector: 'Software B2B Enterprise', icon: '☁️' },
  { name: 'Crossfit Iron Barbells', sector: 'Fitness & Gimnasios', icon: '🏋️' },
  { name: 'Inmobiliaria Golden Key', sector: 'Real Estate de Lujo', icon: '🏰' },
  { name: 'Hamburguesería Smash Go', sector: 'Hostelería & Delivery', icon: '🍔' },
  { name: 'Colchones Ortopédicos Zen', sector: 'D2C E-commerce', icon: '🛏️' },
  { name: 'Academia Trading Millonario', sector: 'Infoproductos & Cursos', icon: '📈' },
  { name: 'Cosméticos Bio Glow', sector: 'Belleza & Cuidado Facial', icon: '💄' }
];

const DISCIPLINES = [
  'SEO',
  'SEM & Paid Media',
  'Social Media & Content',
  'CRO & Web Analytics',
  'Full Inbound Marketing'
];

const EXPECTATIONS = [
  { label: 'Realista', factor: 1.0, desc: 'Pide crecimiento sostenido y reportes mensuales claros.' },
  { label: 'Exigente', factor: 1.3, desc: 'Exige llamadas semanales y respuestas inmediatas en WhatsApp.' },
  { label: 'Delirante / Ilusoria', factor: 1.8, desc: 'Quiere superar a Amazon con 300€ de presupuesto.' }
];

export class ProjectEngine {
  /**
   * Generates a single procedural client
   */
  static createClient({ level = 0, preferredDiscipline = null, toxicityBias = 2 } = {}) {
    const template = COMPANY_NAMES[Math.floor(Math.random() * COMPANY_NAMES.length)];
    const discipline = preferredDiscipline || DISCIPLINES[Math.floor(Math.random() * DISCIPLINES.length)];
    const expObj = EXPECTATIONS[Math.floor(Math.random() * EXPECTATIONS.length)];

    // Toxicity rating from 1 to 5
    const rawTox = Math.floor(Math.random() * 3) + toxicityBias;
    const toxicity = Math.max(1, Math.min(5, rawTox));

    // Weekly hours required
    const baseHours = 8 + (level * 2) + Math.floor(Math.random() * 6);
    const requiredHours = Math.round(baseHours * expObj.factor);

    // Retainer fee
    const feeMonthly = 800 + (requiredHours * 110) + (level * 400);

    return {
      id: 'proj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      name: template.name,
      sector: template.sector,
      icon: template.icon,
      discipline,
      toxicity,
      expectations: expObj.label,
      expectationsDesc: expObj.desc,
      feeMonthly,
      requiredHours,
      allocatedHours: Math.min(requiredHours, 12),
      delegatedHours: 0,
      satisfaction: 70 + Math.floor(Math.random() * 15),
      tacticVanity: false,
      status: 'active', // active, warning, lost, saved
      history: []
    };
  }

  /**
   * Generates starting portfolio based on player's chosen role
   */
  static generateStartingPortfolio(roleId, agencyTypeId) {
    const list = [];
    const toxBias = agencyTypeId === 'factory' ? 3 : agencyTypeId === 'boutique' ? 1 : 2;

    if (roleId === 'seo') {
      list.push(this.createClient({ level: 0, preferredDiscipline: 'SEO', toxicityBias: toxBias }));
      list.push(this.createClient({ level: 0, preferredDiscipline: 'SEO', toxicityBias: toxBias }));
      list.push(this.createClient({ level: 0, preferredDiscipline: 'CRO & Web Analytics', toxicityBias: toxBias }));
    } else if (roleId === 'ppc') {
      list.push(this.createClient({ level: 0, preferredDiscipline: 'SEM & Paid Media', toxicityBias: toxBias }));
      list.push(this.createClient({ level: 0, preferredDiscipline: 'SEM & Paid Media', toxicityBias: toxBias }));
      list.push(this.createClient({ level: 0, preferredDiscipline: 'Full Inbound Marketing', toxicityBias: toxBias }));
    } else if (roleId === 'social') {
      list.push(this.createClient({ level: 0, preferredDiscipline: 'Social Media & Content', toxicityBias: toxBias }));
      list.push(this.createClient({ level: 0, preferredDiscipline: 'Social Media & Content', toxicityBias: toxBias }));
      list.push(this.createClient({ level: 0, preferredDiscipline: 'Full Inbound Marketing', toxicityBias: toxBias }));
    } else {
      // Accounts
      list.push(this.createClient({ level: 0, preferredDiscipline: 'Full Inbound Marketing', toxicityBias: toxBias }));
      list.push(this.createClient({ level: 0, preferredDiscipline: 'SEO', toxicityBias: toxBias }));
      list.push(this.createClient({ level: 0, preferredDiscipline: 'SEM & Paid Media', toxicityBias: toxBias }));
    }

    return list;
  }

  /**
   * Resolves weekly deliverables for a project
   */
  static evaluateProjectTurn(project, player) {
    let effectiveHours = project.allocatedHours;
    let vanitySuccess = null;
    let feedback = '';

    // Delegate hours calculation
    if (project.delegatedHours > 0) {
      const delegationEfficiency = player.skills.lead >= 6 ? 1.0 : 0.7;
      effectiveHours += Math.round(project.delegatedHours * delegationEfficiency);
    }

    // "Vender la moto" (Vanity Metrics Report) Mechanic
    if (project.tacticVanity) {
      // Success chance based on Negotiation & Politics vs Client Toxicity
      const roll = Math.random() * 100;
      const threshold = 35 + (player.skills.neg * 5) + (player.skills.pol * 4) - (project.toxicity * 6);

      if (roll <= threshold) {
        vanitySuccess = true;
        effectiveHours = Math.max(effectiveHours, project.requiredHours); // Masks the deficit!
        feedback = `🎨 ¡MOTO VENDIDA! El cliente aplaudió el informe lleno de métricas de vanidad y gráficos de colores.`;
      } else {
        vanitySuccess = false;
        feedback = `💥 ¡PILLADA! El cliente se dio cuenta de que inflaste impresiones con bots. La reunión fue una carnicería.`;
      }
    }

    // Satisfaction calculation
    const deltaHours = effectiveHours - project.requiredHours;
    let satisfactionDelta = 0;

    if (vanitySuccess === false) {
      satisfactionDelta = -30 - (project.toxicity * 3);
    } else if (deltaHours >= 0) {
      // Sufficient hours delivered
      const qualityBonus = Math.floor(player.skills.tech / 2);
      satisfactionDelta = 4 + qualityBonus;
      if (!feedback) feedback = `✅ Entregables completados con éxito y a tiempo.`;
    } else {
      // Hours deficit
      const deficit = Math.abs(deltaHours);
      const toxicityPenalty = project.toxicity * 2.5;
      // Negotiation skill softens the blow
      const defenseDiscount = Math.min(deficit * 2, player.skills.neg * 1.5);
      satisfactionDelta = -Math.round((deficit * toxicityPenalty) - defenseDiscount);
      if (!feedback) feedback = `⚠️ Faltaron ${deficit}h de trabajo técnico. El cliente envió un correo pasivo-agresivo.`;
    }

    // Apply delta and clamp
    const newSatisfaction = Math.max(0, Math.min(100, project.satisfaction + satisfactionDelta));
    project.satisfaction = newSatisfaction;
    project.tacticVanity = false; // Reset weekly tactic

    // Evaluate project status
    if (newSatisfaction <= 0) {
      project.status = 'lost';
    } else if (newSatisfaction <= 30) {
      project.status = 'warning';
    } else {
      project.status = 'active';
    }

    return {
      projectId: project.id,
      projectName: project.name,
      satisfactionDelta,
      newSatisfaction,
      vanitySuccess,
      status: project.status,
      feedback
    };
  }
}
