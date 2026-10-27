/* ==========================================================================
   AGENCY HUSTLE: THE MARKETING AGENCY CAREER SIM
   Events Engine: Random Crises, Ethical Dilemmas, Branching & Deferred Flags
   ========================================================================== */

export const EVENTS_DATABASE = [
  // 1. La Auditoría Fantasma
  {
    id: 'evt_ghost_audit',
    title: '👻 La Auditoría Fantasma',
    type: 'dilemma',
    text: 'Revisando Analytics, descubres que un script erróneo insertado por el Socio Fundador de la agencia estuvo duplicando las conversiones artificialmente durante 6 meses para inflar el bonus de éxito. ¿Qué haces?',
    options: [
      {
        text: 'Corregir el script en silencio sin decir una sola palabra.',
        reqLabel: 'Requiere Técnica ≥ 3',
        isAvailable: (s) => s.player.skills.tech >= 3,
        resolve: (state) => {
          state.setFlag('founder_error_silenced', true);
          return {
            text: 'Arreglas el código de puntillas. Nadie habla de ello, pero el socio te lanza una mirada de complicidad en la cocina.',
            stress: +5,
            reputation: +10
          };
        }
      },
      {
        text: 'Publicar el hallazgo en el canal #general de Slack pidiendo explicaciones.',
        reqLabel: 'Cero filtro',
        isAvailable: () => true,
        resolve: (state) => {
          state.setFlag('founder_enemy', true);
          return {
            text: '¡Escándalo total! El socio te llama a su despacho a gritos. Te ganas la simpatía de los becarios, pero tu futuro en la agencia pende de un hilo.',
            reputation: -30,
            stress: +35,
            personalBrand: +15
          };
        }
      },
      {
        text: 'Ignorarlo por completo. "No es mi problema, a mí no me pagan para esto".',
        reqLabel: 'Requiere Política ≥ 2',
        isAvailable: (s) => s.player.skills.pol >= 2,
        resolve: () => ({
          text: 'Cierras la pestaña y miras hacia otro lado con maestría. La ignorancia es el mejor escudo contra el despido.',
          stress: -5
        })
      }
    ]
  },

  // 2. El Fichaje Tentador
  {
    id: 'evt_tentative_offer',
    title: '💼 El Fichaje Tentador de la Consultora',
    type: 'dilemma',
    condition: (s) => s.player.personalBrand >= 35,
    text: 'Un socio de una multinacional te contacta por privado. Te ofrece un incremento salarial del 60% inmediato, pero te advierte que "allí la jornada termina cuando se acaban las tareas (habitualmente a las 22:30h)".',
    options: [
      {
        text: 'Aceptar el cheque y prepararse para no tener vida personal.',
        isAvailable: () => true,
        resolve: (state) => {
          state.updatePlayer({
            salary: Math.round(state.player.salary * 1.6),
            agencyTypeId: 'consultancy',
            agencyName: 'McKinsey & Deloittics Global'
          });
          return {
            text: 'Fichas por la consultora. Tu cuenta bancaria engorda, pero empiezas a soñar con tablas dinámicas de Excel y gráficos de cascada.',
            stress: +25,
            reputation: +15
          };
        }
      },
      {
        text: 'Usar la oferta como chantaje para exigir una subida en tu agencia actual.',
        reqLabel: 'Requiere Negociación ≥ 4',
        isAvailable: (s) => s.player.skills.neg >= 4,
        resolve: (state) => {
          const bump = 120;
          state.updatePlayer({ salary: state.player.salary + bump });
          return {
            text: `Enseñas la oferta a dirección con una ceja levantada. Sudando frío, te aumentan ${bump}€/sem con tal de que no te vayas.`,
            reputation: +10,
            stress: +5
          };
        }
      },
      {
        text: 'Rechazar la oferta educadamente: la salud mental no se negocia.',
        isAvailable: () => true,
        resolve: () => ({
          text: 'Duermes tranquilo esa noche sabiendo que aún puedes disfrutar de tus fines de semana.',
          mentalHealth: +10,
          stress: -10
        })
      }
    ]
  },

  // 3. Crisis del Algoritmo
  {
    id: 'evt_algorithm_crash',
    title: '📉 Cataclismo del Algoritmo (Core Update)',
    type: 'crisis',
    text: 'Google o Meta ha desplegado una actualización masiva un martes por la tarde. El tráfico orgánico y el ROAS de tus cuentas caen en picado un 45%. Los clientes están convocando reuniones de urgencia.',
    options: [
      {
        text: 'Redactar un informe técnico denso culpando a "la volatilidad de la IA de Silicon Valley".',
        reqLabel: 'Requiere Negociación ≥ 3',
        isAvailable: (s) => s.player.skills.neg >= 3,
        resolve: () => ({
          text: 'El cliente no entendió nada de lo que dijiste sobre "fluctuaciones heurísticas", pero asintió con cara de preocupación y pospuso la bronca.',
          reputation: +5,
          stress: +10
        })
      },
      {
        text: 'Meter 10 horas extra sin dormir para reestructurar las campañas y el contenido.',
        isAvailable: () => true,
        resolve: (state) => {
          state.updatePlayer({ hoursOvertime: state.player.hoursOvertime + 10 });
          return {
            text: 'Consigues frenar la hemorragia de datos a costa de ojeras monumentales y 4 tazas de café aguado.',
            mentalHealth: -15,
            stress: +20,
            reputation: +15
          };
        }
      },
      {
        text: 'Filtrar el rumor de que el cliente tiene la web mal programada por sus desarrolladores.',
        reqLabel: 'Requiere Política ≥ 4',
        isAvailable: (s) => s.player.skills.pol >= 4,
        resolve: () => ({
          text: 'Derivas toda la culpa al programador freelance del cliente. Éxito absoluto: el cliente le echa la bronca a él.',
          reputation: +8,
          stress: -5
        })
      }
    ]
  },

  // 4. Presión de Fin de Mes
  {
    id: 'evt_end_of_month_crunch',
    title: '🍕 Crunch de Fin de Mes ("Somos una Familia")',
    type: 'dilemma',
    text: 'Viernes a las 19:30h. El Director de Cuentas pide pizzas de oferta y anuncia con entusiasmo que nadie se marcha hasta que todos los informes mensuales queden subidos a Drive.',
    options: [
      {
        text: 'Quedarte hasta las 2 de la madrugada y hacer bromas forzadas con el equipo.',
        isAvailable: () => true,
        resolve: () => ({
          text: 'Te comes una porción de pizza fría de pepperoni. Los jefes anotan tu compromiso en su libreta mental.',
          mentalHealth: -12,
          stress: +15,
          reputation: +15
        })
      },
      {
        text: 'Escabullirte con sigilo diciendo que "tienes una cita con el dentista a las 20:00h".',
        reqLabel: 'Requiere Política ≥ 3',
        isAvailable: (s) => s.player.skills.pol >= 3,
        resolve: () => ({
          text: 'Sales por la puerta de emergencia con la mochila al hombro mientras los demás abren latas de Red Bull.',
          mentalHealth: +10,
          stress: -10,
          reputation: -5
        })
      }
    ]
  },

  // 5. Viernes a las 17:58
  {
    id: 'evt_friday_panic_call',
    title: '📞 Llamada Histérica: Viernes a las 17:58',
    type: 'crisis',
    text: 'Tuena tu móvil de empresa a dos minutos de apagar el ordenador. Es el cliente con mayor presupuesto, gritando que "su cuñado no ve el anuncio en Google al buscar desde el móvil".',
    options: [
      {
        text: 'Coger la llamada con tono ultra paciente y explicarle la segmentación geográfica.',
        reqLabel: 'Requiere Negociación ≥ 2',
        isAvailable: (s) => s.player.skills.neg >= 2,
        resolve: () => ({
          text: 'Tras 40 minutos de agonía telefónica, el cliente se calma tras entender que su cuñado está de vacaciones en Menorca.',
          stress: +15,
          reputation: +10
        })
      },
      {
        text: 'Poner el teléfono en modo avión y fingir "problemas de cobertura en el metro".',
        isAvailable: () => true,
        resolve: () => ({
          text: 'Apagas el terminal de un tirón. El lunes a las 09:00h ya habrá otro incendio nuevo que tape este.',
          mentalHealth: +5,
          stress: -5
        })
      }
    ]
  },

  // 6. El Becario Ha Borrado la Campaña
  {
    id: 'evt_intern_blunder',
    title: '🔥 El Becario Ha Borrado la Campaña Principal',
    type: 'crisis',
    text: 'Un recién llegado confundió el botón de pausar con el de eliminar el histórico de pujas de Google Ads de una cuenta de 20.000€ mensuales. Está hiperventilando en el baño.',
    options: [
      {
        text: 'Ayudarle a reconstruirlo desde el log de cambios y enseñarle sin delatarle.',
        reqLabel: 'Requiere Liderazgo ≥ 3',
        isAvailable: (s) => s.player.skills.lead >= 3,
        resolve: (state) => {
          state.setFlag('junior_loyal_ally', true);
          return {
            text: 'Reviertes la mayor parte del desaguisado. El becario te mira como si fueras un dios viviente.',
            stress: +10,
            reputation: +12,
            mentalHealth: +5
          };
        }
      },
      {
        text: 'Reportarlo de inmediato a dirección para que ruede su cabeza y no la tuya.',
        isAvailable: () => true,
        resolve: () => ({
          text: 'El becario es despedido esa misma tarde. Dirección agradece tu lealtad corporativa, aunque tus compañeros guardan silencio.',
          reputation: +5,
          stress: -5,
          mentalHealth: -10
        })
      }
    ]
  },

  // 7. La Reunión que Pudo Haber Sido un Email
  {
    id: 'evt_useless_meeting',
    title: '😴 La Reunión de 3 Horas que Pudo Ser un Email',
    type: 'dilemma',
    text: 'Un mando intermedio convoca a 14 personas para debatir si el botón de la newsletter debe ser azul cian o azul ultramar. Llevan 90 minutos de monólogo sin llegar a ninguna conclusión.',
    options: [
      {
        text: 'Dejar el micro muteado y avanzar tareas de tus proyectos con disimulo.',
        reqLabel: 'Requiere Productividad ≥ 3',
        isAvailable: (s) => s.player.skills.prod >= 3,
        resolve: () => ({
          text: 'Completas dos auditorías mientras asientes con la cabeza a la cámara cada 10 minutos. Una jugada maestra.',
          stress: -5,
          mentalHealth: +5
        })
      },
      {
        text: 'Interrumpir proponiendo hacer un test A/B y cerrar la reunión en 3 minutos.',
        reqLabel: 'Requiere Técnica ≥ 4',
        isAvailable: (s) => s.player.skills.tech >= 4,
        resolve: () => ({
          text: 'Todo el mundo te mira con devoción por salvarles de la tortura. El convocante queda en evidencia pero el equipo te vitorea.',
          reputation: +15,
          personalBrand: +5
        })
      },
      {
        text: 'Resignarte, aguantar la chapa en silencio y fingir interés.',
        isAvailable: () => true,
        resolve: () => ({
          text: 'Pasan las 3 horas de monólogo. Te duele la cabeza de tanto asentir, pero no te has buscado enemigos.',
          stress: +5,
          mentalHealth: -5
        })
      }
    ]
  },

  // 8. Vendehumos en LinkedIn
  {
    id: 'evt_linkedin_plagiarist',
    title: '🕶️ El Compañero Vendehumos en LinkedIn',
    type: 'gossip',
    text: 'Ves en tu feed de LinkedIn que un compañero del departamento ha copiado palabra por palabra tu última estrategia de contenidos, presentándola como un éxito personal suyo con 800 likes y comentarios de felicitación.',
    options: [
      {
        text: 'Comentar en el post felicitándole con ironía y adjuntando capturas de tu autoría.',
        isAvailable: () => true,
        resolve: () => ({
          text: 'Guerra abierta en comentarios. El post se llena de palomitas, pero la dirección te pide no montar escándalos en redes.',
          personalBrand: +15,
          reputation: -10,
          stress: +15
        })
      },
      {
        text: 'Aprender la lección y empezar tú mismo a publicar reflexiones pedantes para inflar tu marca.',
        reqLabel: 'Requiere Política ≥ 2',
        isAvailable: (s) => s.player.skills.pol >= 2,
        resolve: () => ({
          text: 'Comienzas a publicar historias inventadas con moraleja de liderazgo. Pronto te llaman "Top Voice de pacotilla".',
          personalBrand: +25,
          stress: +5
        })
      }
    ]
  },

  // 9. El Café de la Oficina se ha Acabado
  {
    id: 'evt_no_coffee_crisis',
    title: '☕ La Rebelión del Grano de Café',
    type: 'dilemma',
    text: 'Por recortes presupuestarios, la máquina de café de grano es sustituida por sobres de café soluble de marca blanca. El departamento de creatividad amenaza con una huelga de brazos caídos.',
    options: [
      {
        text: 'Organizar una vaquilla comunitaria para comprar una cafetera italiana y granos de especialidad.',
        isAvailable: () => true,
        resolve: (state) => {
          state.updatePlayer({ money: state.player.money - 20 });
          return {
            text: 'Te conviertes en el héroe no oficial del pasillo. El olor a buen café devuelve la dignidad al equipo.',
            reputation: +10,
            mentalHealth: +10
          };
        }
      },
      {
        text: 'Aprovechar para bajar a la cafetería de abajo 4 veces al día a perder tiempo.',
        reqLabel: 'Requiere Escaqueo ≥ 3',
        isAvailable: (s) => s.player.skills.pol >= 3,
        resolve: () => ({
          text: 'Ganas 3 horas de escaqueo a la semana comentando cotilleos de la oficina en la terraza del bar.',
          stress: -15,
          mentalHealth: +15
        })
      }
    ]
  },

  // 10. Migración en Pleno Black Friday
  {
    id: 'evt_black_friday_migration',
    title: '🛍️ Migración Web a 3 Días del Black Friday',
    type: 'crisis',
    text: 'El cliente de e-commerce más grande decide que es "el momento ideal" para migrar su tienda online a una nueva plataforma porque al sobrino del dueño le pareció más bonita.',
    options: [
      {
        text: 'Negarte en rotundo y poner por escrito que no te responsabilizas del desastre.',
        reqLabel: 'Requiere Negociación ≥ 5',
        isAvailable: (s) => s.player.skills.neg >= 5,
        resolve: () => ({
          text: 'El cliente se asusta ante tu seguridad jurídica y pospone el suicidio comercial para enero.',
          reputation: +20,
          stress: -5
        })
      },
      {
        text: 'Aceptar la orden pero cobrando un recargo nocturno de emergencia.',
        isAvailable: () => true,
        resolve: (state) => {
          state.updatePlayer({ money: state.player.money + 350 });
          return {
            text: 'Trabajas 72 horas seguidas con Red Bull en vena. La web sobrevive por milagro y tu cuenta recibe un suplemento.',
            stress: +30,
            mentalHealth: -25
          };
        }
      }
    ]
  },

  // 11. Oferta de Cliente para Irte con Ellos (In-House)
  {
    id: 'evt_client_poaching',
    title: '🤫 La Propuesta Indecente del Cliente VIP',
    type: 'dilemma',
    condition: (s) => s.player.level >= 2,
    text: 'Tras una reunión, el Director General de uno de tus mejores clientes te lleva aparte: "Oye, te pagamos el doble si dejas la agencia y te vienes a llevar nuestro marketing in-house".',
    options: [
      {
        text: 'Estudiar la propuesta en secreto y pedir un contrato blindado.',
        reqLabel: 'Requiere Negociación ≥ 6',
        isAvailable: (s) => s.player.skills.neg >= 6,
        resolve: (state) => {
          state.setFlag('inhouse_poach_ready', true);
          return {
            text: 'El cliente te envía una oferta formal espectacular para cuando decidas dar el salto definitivo.',
            personalBrand: +20,
            stress: -10
          };
        }
      },
      {
        text: 'Delatar al cliente ante la dirección de tu agencia para ganar puntos de lealtad.',
        isAvailable: () => true,
        resolve: () => ({
          text: 'La agencia le aplica una penalización por cláusula de no competencia y a ti te nombran empleado del mes (sin aumento económico).',
          reputation: +25,
          stress: +5
        })
      }
    ]
  },

  // 12. Cambio de Logo con 50 Revisiones
  {
    id: 'evt_logo_revisions',
    title: '📐 "Un 10% Más Grande y con Más Chispa"',
    type: 'dilemma',
    text: 'Un cliente rechaza por décima vez las creatividades porque "el logo no respira bastante poderío" y pide que lo hagas "más dinámico, rollo Apple pero con colores de fiesta".',
    options: [
      {
        text: 'Enviarle exactamente el mismo diseño con un 2% más de saturación y cobrar otra revisión.',
        reqLabel: 'Requiere Negociación ≥ 3',
        isAvailable: (s) => s.player.skills.neg >= 3,
        resolve: () => ({
          text: 'El cliente responde emocionado: "¡Ahora sí! ¡Esto es exactamente lo que tenía en la cabeza!". Todos respiran aliviados.',
          reputation: +8,
          stress: -5
        })
      },
      {
        text: 'Rehacer todo desde cero de madrugada quejándote amargamente.',
        isAvailable: () => true,
        resolve: () => ({
          text: 'Entregas 6 variantes nuevas. El cliente escoge la primera que hiciste hace tres semanas.',
          mentalHealth: -10,
          stress: +12
        })
      }
    ]
  },

  // 13. Petición de Viralidad Orgánica sin Presupuesto
  {
    id: 'evt_viral_request',
    title: '🚀 "Quiero que se Haga Viral Orgánicamente"',
    type: 'dilemma',
    text: 'El cliente de una marca de zapatos ortopédicos exige que su próximo reel de Instagram tenga al menos 1 millón de reproducciones pero especifica que su presupuesto de pauta es de 0 euros.',
    options: [
      {
        text: 'Proponer una idea absurda de baile ridículo en TikTok.',
        isAvailable: () => true,
        resolve: () => ({
          text: 'El vídeo consigue 300 visitas, la mitad de familiares de los empleados. El cliente culpa al algoritmo.',
          stress: +5
        })
      },
      {
        text: 'Convencerle con maestría de que el objetivo real debe ser "captación de leads de alto valor".',
        reqLabel: 'Requiere Negociación ≥ 4',
        isAvailable: (s) => s.player.skills.neg >= 4,
        resolve: () => ({
          text: 'Le cambias el briefing sin que se dé cuenta y le vendes una auditoría de funnels. Maestro de la oratoria.',
          reputation: +15,
          personalBrand: +10
        })
      }
    ]
  },

  // 14. Inspección de Trabajo Sorpresa
  {
    id: 'evt_work_inspection',
    title: '🚨 Inspección de Trabajo en la Oficina',
    type: 'crisis',
    text: 'Aparecen dos inspectores de trabajo sin avisar pidiendo las hojas de registro horario de los últimos tres meses. Dirección entra en pánico total tratando de ocultar a los becarios.',
    options: [
      {
        text: 'Firmar tranquilamente tu registro exacto de 40 horas como manda el manual.',
        isAvailable: () => true,
        resolve: () => ({
          text: 'Cumples con el teatro corporativo. Los inspectores levantan acta y la agencia respira con alivio temporal.',
          reputation: +5
        })
      },
      {
        text: 'Aprovechar la confusión para salir a desayunar un pincho de tortilla de hora y media.',
        reqLabel: 'Requiere Política ≥ 3',
        isAvailable: (s) => s.player.skills.pol >= 3,
        resolve: () => ({
          text: 'Vuelves cuando los inspectores ya se han ido. Nadie se percató de tu ausencia en el caos.',
          mentalHealth: +10,
          stress: -10
        })
      }
    ]
  },

  // 15. Rumor de ERE / Despidos Masivos
  {
    id: 'evt_layoff_rumors',
    title: '🗣️ Rumores de Despidos en el Pasillo',
    type: 'gossip',
    text: 'Se rumorea que la pérdida de dos clientes grandes obligará a la agencia a prescindir del 20% de la plantilla antes de que termine el trimestre.',
    options: [
      {
        text: 'Hacer horas extra visibles y pasearse con carpetas por el despacho del CEO.',
        reqLabel: 'Requiere Política ≥ 4',
        isAvailable: (s) => s.player.skills.pol >= 4,
        resolve: () => ({
          text: 'Te aseguras de que todos te vean como un recurso imprescindible en la trinchera.',
          reputation: +15,
          stress: +10
        })
      },
      {
        text: 'Actualizar tu CV y activar la insignia "Open to Work" en privado en LinkedIn.',
        isAvailable: () => true,
        resolve: (state) => {
          state.updatePlayer({ personalBrand: state.player.personalBrand + 15 });
          return {
            text: 'Mejoras tu escaparate profesional. Dos recruiters ya han visitado tu perfil.',
            personalBrand: +15,
            stress: -5
          };
        }
      }
    ]
  },

  // 16. El Cliente VIP no Renueva el Retainer
  {
    id: 'evt_lost_retainer_pitch',
    title: '💔 Pérdida Inminente del Retainer Principal',
    type: 'crisis',
    text: 'El cliente que paga el 30% de la facturación de la agencia anuncia que saca a concurso su cuenta y exige una propuesta rompedora en 48 horas.',
    options: [
      {
        text: 'Liderar la presentación con un plan de automatización e IA agresivo.',
        reqLabel: 'Requiere Liderazgo ≥ 4',
        isAvailable: (s) => s.player.skills.lead >= 4,
        resolve: () => ({
          text: 'El cliente queda boquiabierto con la presentación y renueva por un año más. Eres el salvador de la firma.',
          reputation: +30,
          personalBrand: +20,
          stress: +15
        })
      },
      {
        text: 'Dejar que el marrón lo gestione el Director de Cuentas y limitar tu trabajo a lo básico.',
        isAvailable: () => true,
        resolve: () => ({
          text: 'El cliente finalmente se marcha a otra agencia, pero nadie puede culparte a ti directamente.',
          reputation: -5,
          stress: -5
        })
      }
    ]
  },

  // 17. Cena de Empresa con Barra Libre
  {
    id: 'evt_open_bar_dinner',
    title: '🥂 Cena de Empresa con Barra Libre',
    type: 'dilemma',
    text: 'Llega la temida cena anual de empresa. Tras la tercera ronda de gin-tonics, el ambiente se relaja peligrosamente y la gente empieza a decir verdades sin filtro a los jefes.',
    options: [
      {
        text: 'Beber agua con gas, escuchar los trapos sucios y retirarte a las 23:30h como un profesional.',
        reqLabel: 'Requiere Política ≥ 3',
        isAvailable: (s) => s.player.skills.pol >= 3,
        resolve: () => ({
          text: 'Obtienes información valiosísima sobre quién sube y quién cae, sin comprometer tu imagen.',
          reputation: +15,
          mentalHealth: +5
        })
      },
      {
        text: 'Subirte a cantar karaoke con el socio y contar chistes sobre los clientes.',
        isAvailable: () => true,
        resolve: () => ({
          text: 'La noche fue épica, pero al despertar el sábado recuerdas haber imitado al cliente VIP delante del CEO.',
          mentalHealth: -10,
          stress: +20,
          reputation: -10
        })
      }
    ]
  },

  // 18. El CEO Descubre la IA Generativa
  {
    id: 'evt_ceo_discovers_ai',
    title: '🤖 El CEO Descubre ChatGPT y Pide Bajar Horas',
    type: 'dilemma',
    text: 'El director general ha vuelto de una conferencia de innovación convencido de que "con la IA ahora todo se hace en 5 minutos" y propone reducir los tiempos de entrega a la mitad.',
    options: [
      {
        text: 'Demostrarle con una auditoría técnica los riesgos de alucinaciones y pérdidas de SEO.',
        reqLabel: 'Requiere Técnica ≥ 5',
        isAvailable: (s) => s.player.skills.tech >= 5,
        resolve: () => ({
          text: 'Le enseñas un desastre real de IA y logras que entienda que la herramienta requiere supervisión experta.',
          reputation: +18,
          personalBrand: +10
        })
      },
      {
        text: 'Asentir con entusiasmo y usar la IA para entregar tareas en 10 minutos cobrando las 8 horas.',
        reqLabel: 'Requiere Productividad ≥ 4',
        isAvailable: (s) => s.player.skills.prod >= 4,
        resolve: () => ({
          text: 'El truco del siglo: entregas a tiempo en tiempo récord y dedicas las horas sobrantes a descansar.',
          mentalHealth: +20,
          stress: -15
        })
      },
      {
        text: 'Aceptar las nuevas exigencias sin rechistar y apechugar con la carga.',
        isAvailable: () => true,
        resolve: () => ({
          text: 'El CEO se sale con la suya. Te toca trabajar a marchas forzadas para llegar a los plazos irreales.',
          stress: +12,
          mentalHealth: -8
        })
      }
    ]
  },

  // 19. Audio de WhatsApp de 8 Minutos
  {
    id: 'evt_whatsapp_voice_note',
    title: '🎙️ El Audio de WhatsApp de 8:43 Minutos',
    type: 'dilemma',
    text: 'Lunes a las 08:30h. El cliente te manda una nota de voz interminable grabada mientras conduce, llena de ruidos de claxon y divagaciones sobre su infancia.',
    options: [
      {
        text: 'Pasar el audio por una herramienta de transcripción y responder con 3 puntos clave.',
        reqLabel: 'Requiere Productividad ≥ 3',
        isAvailable: (s) => s.player.skills.prod >= 3,
        resolve: () => ({
          text: 'En 30 segundos tienes el resumen estructurado. El cliente queda fascinado por tu capacidad de síntesis.',
          reputation: +10,
          stress: -5
        })
      },
      {
        text: 'Escucharlo a velocidad 1x tomando notas detalladas mientras se te enfría el café.',
        isAvailable: () => true,
        resolve: () => ({
          text: 'Pierdes media mañana intentando descifrar si quería cambiar el banner o el horario de apertura.',
          mentalHealth: -8,
          stress: +10
        })
      }
    ]
  },

  // 20. El Cliente que no Paga pero Pide Informes
  {
    id: 'evt_unpaid_invoices',
    title: '🧾 El Cliente Moroso con Exigencias VIP',
    type: 'dilemma',
    text: 'Un cliente adeuda tres facturas trimestrales pero sigue enviando correos con la palabra "URGENTE" en mayúsculas exigiendo informes semanales detallados.',
    options: [
      {
        text: 'Congelar el servicio discretamente hasta que contabilidad confirme la transferencia.',
        reqLabel: 'Requiere Negociación ≥ 4',
        isAvailable: (s) => s.player.skills.neg >= 4,
        resolve: () => ({
          text: 'Mantienes tu postura con educación exquisita. Al cabo de dos días el cliente realiza el abono.',
          reputation: +15,
          stress: -5
        })
      },
      {
        text: 'Seguir trabajando por miedo a perder la cuenta y que la bronca te salpique a ti.',
        isAvailable: () => true,
        resolve: () => ({
          text: 'Sigues regalando tu tiempo a una empresa insolvente. El cansancio se acumula en tu espalda.',
          mentalHealth: -15,
          stress: +15
        })
      }
    ]
  },

  // 21. Headhunter Halagador con Errata
  {
    id: 'evt_recruiter_typo',
    title: '📬 "Hola [NOMBRE_CANDIDATO], me impresiona tu perfil"',
    type: 'gossip',
    text: 'Un reclutador te escribe un mensaje privado en LinkedIn con el texto de plantilla sin rellenar, elogiando tu "increíble trayectoria en la empresa [EMPRESA_ACTUAL]".',
    options: [
      {
        text: 'Responderle con otra plantilla automatizada pidiendo el rango salarial por adelantado.',
        isAvailable: () => true,
        resolve: (state) => {
          state.updatePlayer({ personalBrand: state.player.personalBrand + 8 });
          return {
            text: 'El recruiter se disculpa avergonzado y te revela una horquilla salarial muy jugosa.',
            personalBrand: +8
          };
        }
      },
      {
        text: 'Hacer una captura, tapar el nombre y subirla con ironía a tu muro de LinkedIn.',
        isAvailable: () => true,
        resolve: () => ({
          text: 'El post se hace viral en el mundillo de marketing con 2.000 likes de otros currantes quemados.',
          personalBrand: +20,
          reputation: -5
        })
      }
    ]
  },

  // 22. "No Somos Compañeros, Somos una Familia"
  {
    id: 'evt_family_culture_meeting',
    title: '🫂 Reunión Sorpresa: "Cultura y Valores"',
    type: 'dilemma',
    text: 'La dirección organiza un taller obligatorio un jueves por la tarde para crear dinámicas de confianza y pedir que todos "se pongan la camiseta de la agencia con orgullo y sin mirar el reloj".',
    options: [
      {
        text: 'Lanzar un discurso emotivo fingiendo emoción corporativa absoluta.',
        reqLabel: 'Requiere Política ≥ 4',
        isAvailable: (s) => s.player.skills.pol >= 4,
        resolve: () => ({
          text: 'Los directores casi sueltan una lágrima. Te ganas su confianza total para la próxima evaluación.',
          reputation: +20,
          mentalHealth: -5
        })
      },
      {
        text: 'Preguntar con inocencia si la pertenencia a la familia incluye pagas extraordinarias y dietas.',
        isAvailable: () => true,
        resolve: () => ({
          text: 'Silencio sepulcral en la sala. Tus compañeros intentan ahogar la risa mirando al suelo.',
          reputation: -15,
          personalBrand: +10,
          stress: +10
        })
      }
    ]
  },

  // 23. Crisis de Reputación en Twitter
  {
    id: 'evt_social_media_crisis',
    title: '🔥 Tweet Accidental desde la Cuenta Oficial',
    type: 'crisis',
    text: 'El community manager de un cliente se confundió de cuenta y tuiteó una opinión política incendiaria con insultos desde la cuenta oficial de una marca de papillas infantiles.',
    options: [
      {
        text: 'Publicar un comunicado de humor autocrítico y convertir el desliz en un meme simpático.',
        reqLabel: 'Requiere Negociación ≥ 5',
        isAvailable: (s) => s.player.skills.neg >= 5,
        resolve: () => ({
          text: 'La respuesta es tan ingeniosa que la marca gana 10.000 seguidores nuevos y felicita a la agencia.',
          reputation: +25,
          personalBrand: +25,
          stress: +10
        })
      },
      {
        text: 'Borrar el tweet, apagar las notificaciones y decir que "han sufrido un ciberataque ruso".',
        isAvailable: () => true,
        resolve: () => ({
          text: 'La excusa cuela ante la prensa tradicional, aunque los foros de marketing se burlan durante semanas.',
          reputation: +5,
          stress: +10
        })
      }
    ]
  },

  // 24. El Favor Personal del Socio
  {
    id: 'evt_founder_favor',
    title: '👨‍👧‍👦 El Favor Personal: "La Web de mi Cuñado"',
    type: 'dilemma',
    text: 'El socio director se acerca con una sonrisa empalagosa: "Oye, sé que estás a tope, pero ¿podrías echarle un ojo a la tienda de pádel de mi cuñado este fin de semana? Te lo recompensaré".',
    options: [
      {
        text: 'Hacerlo en tu tiempo libre y recordárselo cuando toque pedir un aumento.',
        isAvailable: () => true,
        resolve: (state) => {
          state.setFlag('favored_by_founder', true);
          return {
            text: 'Le dejas la tienda optimizada. El cuñado está feliz y el socio te debe un favor de los grandes.',
            reputation: +20,
            mentalHealth: -15,
            stress: +15
          };
        }
      },
      {
        text: 'Decirle con educación que tus horas laborales están dedicadas al 100% a los clientes de pago.',
        reqLabel: 'Requiere Negociación ≥ 4',
        isAvailable: (s) => s.player.skills.neg >= 4,
        resolve: () => ({
          text: 'Pones límites sanos a tu tiempo. El socio frunce el ceño pero respeta tu profesionalidad.',
          mentalHealth: +10,
          stress: -5
        })
      }
    ]
  },

  // 25. Pitcheo a Concurso Público
  {
    id: 'evt_public_tender_pitch',
    title: '🏛️ Concurso Público contra 12 Agencias Rivales',
    type: 'crisis',
    text: 'La agencia opta a una licitación de una marca pública millonaria. Hay que preparar 150 páginas de pliego técnico en 3 días. Todo el departamento debe arrimar el hombro.',
    options: [
      {
        text: 'Asumir la dirección del pliego técnico y aportar automatizaciones únicas.',
        reqLabel: 'Requiere Técnica ≥ 6',
        isAvailable: (s) => s.player.skills.tech >= 6,
        resolve: (state) => {
          state.updatePlayer({ money: state.player.money + 500 });
          return {
            text: '¡Ganáis la licitación! La agencia se asegura un año de récord y te otorgan un bonus económico inmediato.',
            reputation: +30,
            personalBrand: +20,
            stress: +20
          };
        }
      },
      {
        text: 'Ayudar con tareas de maquetación estándar sin asumir la responsabilidad final.',
        isAvailable: () => true,
        resolve: () => ({
          text: 'El concurso se pierde por 2 décimas, pero nadie señala a tu departamento.',
          stress: +10
        })
      }
    ]
  },

  // 26. Caída Mundial de Meta Ads durante el Cyber Monday
  {
    id: 'evt_meta_blackout',
    title: '🌐 Caída Mundial de Meta Ads en Pleno Cyber Monday',
    type: 'crisis',
    text: 'El Administrador de Anuncios de Meta se cae a nivel planetario en el día con mayor volumen de ventas del año. Los paneles de métricas muestran cero euros y los directores están en shock.',
    options: [
      {
        text: 'Desviar inmediatamente los presupuestos a Google Ads Search y campañas de email urgente.',
        reqLabel: 'Requiere Técnica ≥ 4',
        isAvailable: (s) => s.player.skills.tech >= 4,
        resolve: () => ({
          text: 'Salvas la facturación de tus clientes gracias a los canales alternativos. Te consideran un estratega brillante.',
          reputation: +25,
          personalBrand: +15,
          stress: +15
        })
      },
      {
        text: 'Enviar un correo masivo avisando de que es un problema global ajeno a la agencia y esperar.',
        isAvailable: () => true,
        resolve: () => ({
          text: 'No cometes errores, aunque los clientes quedan frustrados por las ventas perdidas.',
          stress: +10
        })
      }
    ]
  },

  // 27. Se Filtra la Tabla Salarial en Slack
  {
    id: 'evt_salary_leak',
    title: '👀 Se Filtra la Tabla Salarial en #general',
    type: 'gossip',
    text: 'Un descuido de Recursos Humanos provoca que durante 7 minutos sea visible un PDF con los sueldos brutos de toda la plantilla. Descubres que el nuevo becario gana más que tú por ser hijo de un amigo del socio.',
    options: [
      {
        text: 'Pedir cita inmediata con el Director General con el PDF impreso en la mano.',
        reqLabel: 'Requiere Negociación ≥ 5',
        isAvailable: (s) => s.player.skills.neg >= 5,
        resolve: (state) => {
          const raise = 200;
          state.updatePlayer({ salary: state.player.salary + raise });
          return {
            text: `El director, avergonzado y temeroso de una fuga de talento, te firma un aumento inmediato de ${raise}€/sem.`,
            reputation: +10,
            stress: +10
          };
        }
      },
      {
        text: 'Alimentar la ira colectiva en los grupos clandestinos de WhatsApp de compañeros.',
        isAvailable: () => true,
        resolve: () => ({
          text: 'El ambiente laboral se vuelve un polvorín. El descontento generalizado te reconforta moralmente.',
          stress: +15,
          mentalHealth: -10
        })
      }
    ]
  }
];

export class EventEngine {
  constructor() {
    this.usedEventIds = new Set();
  }

  /**
   * Evaluates deferred narrative flags and returns a triggerable event or null
   */
  evaluateDeferredEvents(state) {
    const flags = state.flags;

    // Follow-up: Founder rewards loyalty after silent error fix
    if (flags.founder_error_silenced && !flags.founder_reward_fired && state.turn.week >= 4) {
      state.setFlag('founder_reward_fired', true);
      return {
        id: 'evt_deferred_founder_bonus',
        title: '🎁 La Recompensa en la Sombra del Socio',
        type: 'opportunity',
        text: 'El socio fundador te llama a su despacho a puerta cerrada: "Aprecio la discreción de hace unas semanas con aquel problema de Analytics. Buen trabajo. Toma esto como agradecimiento". Te entrega un bonus en mano.',
        options: [
          {
            text: 'Aceptar el sobre con agradecimiento y mantener la lealtad profesional.',
            isAvailable: () => true,
            resolve: (s) => {
              s.updatePlayer({ money: s.player.money + 400, reputation: s.player.reputation + 15 });
              return { text: 'Guardas el dinero en el bolsillo. Has ganado un valioso protector en la cúpula directiva.' };
            }
          }
        ]
      };
    }

    // Follow-up: Founder hostility after public scandal
    if (flags.founder_enemy && !flags.founder_hostility_fired && state.turn.week >= 3) {
      state.setFlag('founder_hostility_fired', true);
      return {
        id: 'evt_deferred_founder_punishment',
        title: '🧊 La Congeladora de Dirección',
        type: 'crisis',
        text: 'Desde que expusiste el error en Slack, la dirección te ha retirado las cuentas más rentables y te ha asignado al cliente más insoportable y conflictivo del archivo.',
        options: [
          {
            text: 'Aguantar el chaparrón y demostrar que eres indestructible.',
            isAvailable: () => true,
            resolve: (s) => {
              s.updatePlayer({ stress: s.player.stress + 20, mentalHealth: s.player.mentalHealth - 15 });
              return { text: 'Aceptas el castigo con orgullo. Tu resistencia al estrés se pone a prueba al límite.' };
            }
          }
        ]
      };
    }

    return null;
  }

  /**
   * Pulls an appropriate contextual or random event
   */
  getRandomEvent(state) {
    // First, check if any deferred event should trigger
    const deferred = this.evaluateDeferredEvents(state);
    if (deferred) return deferred;

    // Filter available events based on conditions and usage
    const eligible = EVENTS_DATABASE.filter(evt => {
      if (this.usedEventIds.has(evt.id)) return false;
      if (evt.condition && !evt.condition(state)) return false;
      return true;
    });

    if (eligible.length === 0) {
      // Reset used pool if exhausted
      this.usedEventIds.clear();
      return EVENTS_DATABASE[Math.floor(Math.random() * EVENTS_DATABASE.length)];
    }

    const chosen = eligible[Math.floor(Math.random() * eligible.length)];
    this.usedEventIds.add(chosen.id);
    return chosen;
  }
}
