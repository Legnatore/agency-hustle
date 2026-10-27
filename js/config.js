/* ==========================================================================
   AGENCY HUSTLE: THE MARKETING AGENCY CAREER SIM
   Config Module: Roles, Agencies, Career Ladder, Skills, Wellness & Achievements
   ========================================================================== */

export const CONFIG = {
  // Turn and time basics
  BASE_WEEKLY_HOURS: 40,
  MAX_OVERTIME_HOURS: 15,
  HOURS_TO_PA_RATIO: 1,

  // Starting Specialization Profiles
  ROLES: {
    seo: {
      id: 'seo',
      title: 'Trainee SEO & Contenidos',
      icon: '🔍',
      startingSalary: 380,
      description: 'Especialista en keywords imposibles, enlazado interno y lidiar con clientes que preguntan por qué no son top 1 en 48 horas.',
      baseSkills: { tech: 3, neg: 1, prod: 2, pol: 1, lead: 1 },
      discipline: 'SEO',
      perk: 'Menor probabilidad de desastre en proyectos orgánicos.'
    },
    ppc: {
      id: 'ppc',
      title: 'Becario de Paid Media / PPC',
      icon: '🎯',
      startingSalary: 410,
      description: 'El guardián de los píxeles de Meta y Google Ads. Siempre con la taquicardia de no pasarse de presupuesto mensual.',
      baseSkills: { tech: 3, neg: 2, prod: 1, pol: 1, lead: 1 },
      discipline: 'PPC',
      perk: 'Mejor rendimiento en cuentas de alto presupuesto.'
    },
    social: {
      id: 'social',
      title: 'Junior Community & Social Media',
      icon: '📱',
      startingSalary: 370,
      description: 'Creador de memes de actualidad, gestor de hordas enfurecidas en comentarios y traductor de TikTok para directores boomers.',
      baseSkills: { tech: 2, neg: 3, prod: 2, pol: 2, lead: 1 },
      discipline: 'Social Media',
      perk: 'Gana Marca Personal un 25% más rápido.'
    },
    accounts: {
      id: 'accounts',
      title: 'Junior Account Executive',
      icon: '🤝',
      startingSalary: 420,
      description: 'El escudo diplomático entre las exigencias absurdas del cliente y el equipo técnico quemado. Especialista en apagar fuegos con una sonrisa.',
      baseSkills: { tech: 1, neg: 4, prod: 1, pol: 3, lead: 1 },
      discipline: 'Cuentas & Negociación',
      perk: 'Menor pérdida de satisfacción ante quejas de clientes.'
    }
  },

  // Agency Types and Work Cultures
  AGENCY_TYPES: {
    boutique: {
      id: 'boutique',
      name: 'Boutique Creativa de Autor',
      icon: '🎨',
      description: 'Pocos clientes selectos, café de especialidad con leche de avena, presentaciones en Keynote y obsesión por premios en festivales.',
      hoursBonus: -2,
      salaryMultiplier: 1.05,
      toxicityBias: 1,
      stressMultiplier: 0.9
    },
    factory: {
      id: 'factory',
      name: 'Factoría Cárnica (Churrero Digital)',
      icon: '🏭',
      description: 'Rotación desenfrenada de personal, docenas de clientes low-cost, horas extra como estándar y pizzas frías en entregas nocturnas.',
      hoursBonus: 5,
      salaryMultiplier: 0.9,
      toxicityBias: 3,
      stressMultiplier: 1.25
    },
    consultancy: {
      id: 'consultancy',
      name: 'Consultora Multinacional (Big 4)',
      icon: '🏢',
      description: 'Estructuras jerárquicas gigantescas, 80 diapositivas por informe, jerga en inglés y política interna como deporte extremo.',
      hoursBonus: 6,
      salaryMultiplier: 1.35,
      toxicityBias: 2,
      stressMultiplier: 1.15
    },
    startup: {
      id: 'startup',
      name: 'Startup de Moda / Scale-up',
      icon: '🦄',
      description: 'Mesa de ping-pong, fruta gratis, cultura de "somos una familia" y stock options con alta probabilidad de valer cero euros.',
      hoursBonus: 2,
      salaryMultiplier: 1.15,
      toxicityBias: 2,
      stressMultiplier: 1.1
    }
  },

  // Career Ladder / Promotion Hierarchy
  CAREER_LADDER: [
    {
      level: 0,
      title: 'Becario / Trainee',
      salaryBase: 390,
      livingCost: 280,
      reqRep: 0,
      reqSkills: { tech: 1 }
    },
    {
      level: 1,
      title: 'Junior Specialist',
      salaryBase: 540,
      livingCost: 340,
      reqRep: 40,
      reqSkills: { tech: 3, prod: 2 }
    },
    {
      level: 2,
      title: 'Mid-Level Consultant',
      salaryBase: 780,
      livingCost: 430,
      reqRep: 55,
      reqSkills: { tech: 5, neg: 3 }
    },
    {
      level: 3,
      title: 'Senior Specialist',
      salaryBase: 1150,
      livingCost: 550,
      reqRep: 70,
      reqSkills: { tech: 7, neg: 5, prod: 5 }
    },
    {
      level: 4,
      title: 'Team Lead / Supervisor',
      salaryBase: 1650,
      livingCost: 720,
      reqRep: 82,
      reqSkills: { tech: 7, lead: 4, pol: 4 }
    },
    {
      level: 5,
      title: 'Head of Department',
      salaryBase: 2400,
      livingCost: 950,
      reqRep: 90,
      reqSkills: { lead: 7, pol: 6, neg: 7 }
    },
    {
      level: 6,
      title: 'Director de Agencia / Partner',
      salaryBase: 3800,
      livingCost: 1300,
      reqRep: 96,
      reqSkills: { lead: 9, pol: 8, neg: 8 }
    }
  ],

  // 5 Skill Branches (Levels 1 to 10)
  SKILLS: {
    tech: {
      id: 'tech',
      name: 'Técnica & Especialidad',
      icon: '💻',
      desc: 'Dominio de auditorías, automatizaciones, analítica y ejecución precisa sin errores.'
    },
    neg: {
      id: 'neg',
      name: 'Negociación & Gestión de Clientes',
      icon: '🤝',
      desc: 'Capacidad para tranquilizar a clientes tóxicos, defender tarifas y capear broncas sin perder la cuenta.'
    },
    prod: {
      id: 'prod',
      name: 'Productividad & Automatización',
      icon: '⚡',
      desc: 'Optimización de workflows, scripts e IA para reducir las horas requeridas por proyecto.'
    },
    pol: {
      id: 'pol',
      name: 'Política de Oficina & Escaqueo',
      icon: '🐍',
      desc: 'Arte de derivar marrones, adjudicarse méritos ajenos y mantener una reputación impecable trabajando lo justo.'
    },
    lead: {
      id: 'lead',
      name: 'Liderazgo & Gestión de Equipos',
      icon: '👑',
      desc: 'Habilidad para delegar tareas en juniors/becarios con éxito y dirigir departamentos.'
    }
  },

  // Wellness & Tools Catalog
  WELLNESS_ITEMS: [
    {
      id: 'coffee_pack',
      title: 'Nootrópicos & Café de Especialidad',
      category: 'bienestar',
      icon: '☕',
      price: 35,
      description: 'Un shot de concentración limpia que calma los nervios y despeja la niebla mental de las reuniones eternas.',
      effect: { stress: -12, mentalHealth: 3 }
    },
    {
      id: 'therapy_session',
      title: 'Sesión de Terapia Anti-Burnout',
      category: 'bienestar',
      icon: '🛋️',
      price: 75,
      description: 'Una hora con un psicólogo profesional para verbalizar el trauma causado por clientes que te escriben un domingo.',
      effect: { stress: -20, mentalHealth: 22 }
    },
    {
      id: 'spa_weekend',
      title: 'Fin de Semana de Retiro Silencioso',
      category: 'bienestar',
      icon: '🧖',
      price: 240,
      description: 'Tres días sin mirar Slack ni el correo. Un bálsamo que resetea tu mente casi al estado inicial.',
      effect: { stress: -45, mentalHealth: 45 }
    },
    {
      id: 'saas_ai_assistant',
      title: 'Licencia Premium Claude / GPT Team',
      category: 'herramientas',
      icon: '🤖',
      price: 60,
      description: 'Generación acelerada de copys, informes mensuales y scripts de análisis. Automatiza entregables.',
      effect: { tempProdBonus: true, brand: 4 }
    },
    {
      id: 'pro_seo_suite',
      title: 'Suite Pro (Semrush / Supermetrics)',
      category: 'herramientas',
      icon: '📊',
      price: 130,
      description: 'Informes con gráficas vistosas que dejan encantados a los clientes y ahorran horas de extracción manual.',
      effect: { reputation: 6, tech: 1 }
    },
    {
      id: 'linkedin_ghostwriting',
      title: 'Ghostwriting Viral para LinkedIn',
      category: 'marca',
      icon: '🚀',
      price: 110,
      description: 'Contrata a un redactor que publique reflexiones pedantes con frases de una sola línea para llamar la atención de cazatalentos.',
      effect: { brand: 18 }
    }
  ],

  // Satirical Achievements List
  ACHIEVEMENTS: [
    {
      id: 'first_week',
      title: 'Superviviente del Onboarding',
      icon: '🐣',
      description: 'Cerraste tu primera semana en la agencia sin dimitir ni romper el acceso de producción.'
    },
    {
      id: 'sold_the_bike',
      title: 'Maestro del Powerpoint',
      icon: '🚲',
      description: 'Lograste "vender la moto" con un reporte de vanidad y el cliente te felicitó con entusiasmo.'
    },
    {
      id: 'overtime_warrior',
      title: 'Pizzas Frías a Medianoche',
      icon: '🍕',
      description: 'Realizaste más de 10 horas extra en una sola semana por el bien de "la familia".'
    },
    {
      id: 'algorithm_victim',
      title: 'Víctima del Core Update',
      icon: '📉',
      description: 'Viste caer un 60% el tráfico de un cliente y le echaste la culpa a la volatilidad de la IA.'
    },
    {
      id: 'stealth_master',
      title: 'Cinturón Negro del Escaqueo',
      icon: '🥷',
      description: 'Alcanzaste nivel 5 en Política de Oficina y lograste que otro cargase con un despiste crítico.'
    },
    {
      id: 'burnout_edge',
      title: 'Al Filo de la Baja Médica',
      icon: '⚡',
      description: 'Tu salud mental cayó por debajo del 15% y aún así entregaste los informes a tiempo.'
    },
    {
      id: 'headhunter_magnet',
      title: 'Top Voice de Pacotilla',
      icon: '⭐',
      description: 'Alcanzaste 60 puntos de Marca Personal y los cazatalentos empezaron a spamear tu bandeja.'
    },
    {
      id: 'team_leader',
      title: 'Jefe con Látigo de Seda',
      icon: '👑',
      description: 'Alcanzaste el rango de Team Lead y empezaste a delegar las tareas más tediosas.'
    },
    {
      id: 'vanity_connoisseur',
      title: 'Tráfico de Bots y Celebraciones',
      icon: '🕶️',
      description: 'Colaste 5 reportes de métricas de vanidad consecutivos sin que nadie se percatara.'
    },
    {
      id: 'firefighter',
      title: 'Bombero Corporativo Oficial',
      icon: '🧯',
      description: 'Salvaste a un cliente con toxicidad 5 a punto de cancelar el contrato.'
    },
    {
      id: 'boss_mode_ninja',
      title: 'Reflejos de Hoja de Cálculo',
      icon: '👔',
      description: 'Activaste el Boss Mode para camuflar el simulador ante miradas indiscretas.'
    },
    {
      id: 'savings_pig',
      title: 'Cojín Financiero',
      icon: '💰',
      description: 'Acumulaste más de 10.000 € en tu cuenta corriente trabajando en agencia.'
    },
    {
      id: 'founder_ceo',
      title: 'Nuevo Lobo de Wall Street',
      icon: '🚀',
      description: 'Fundaste tu propia agencia de marketing y rompiste las cadenas del asalariado.'
    },
    {
      id: 'inhouse_paradise',
      title: 'Jubilación Dorada In-House',
      icon: '🏝️',
      description: 'Fichaste en cliente final con sueldo alto y reuniones de 30 minutos sin prisas.'
    },
    {
      id: 'partner_equity',
      title: 'El Trono de Hierro del Consejo',
      icon: '🤝',
      description: 'Te convertiste en socio de la firma y ahora miras las métricas desde la cúspide.'
    }
  ]
};
