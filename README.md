# 🚀 Agency Hustle: The Marketing Agency Career Sim

Un simulador de rol y gestión corporativa en navegador ambientado en el salvaje ecosistema de las agencias de marketing digital.

---

## 🕹️ Características Principales

- **Gestión de Recursos y Turnos:** Cada turno equivale a una semana laboral. Gestiona Puntos de Acción (horas semanales), Salud Mental, Estrés, Reputación Interna, Marca Personal y Dinero en cuenta.
- **4 Especializaciones Iniciales:**
  - Trainee SEO & Contenidos
  - Becario de Paid Media / PPC
  - Junior Community & Social Media
  - Junior Account Executive
- **4 Tipos de Agencias:** Boutique Creativa, Factoría Cárnica, Consultora Multinacional o Startup de Moda.
- **Árbol de Habilidades:** Técnica, Negociación, Productividad, Política de Oficina / Escaqueo y Liderazgo.
- **Sistema de Clientes Procedurales:** Gestión de entregables, satisfacción, expectativas delirantes y la táctica de *"Vender la Moto"* (métricas de vanidad).
- **Motor de Crisis y Dilemas:** Más de 25 eventos contextuales con consecuencias diferidas y ramificaciones éticas.
- **👔 Panic Button / Boss Mode:** Pulsa `ESC` en cualquier momento para camuflar el juego bajo una hoja de cálculo corporativa ultra-realista.
- **Mercado Laboral & Múltiples Finales:** Promociones internas, ofertas de cazatalentos en LinkedIn, y finales como Founder & CEO, In-House VP, Socio de la Firma, o despido y colapso por burnout.

---

## 🛠️ Ejecución Local

Dado que utiliza módulos nativos JavaScript (ES6), ejecútalo a través de un servidor HTTP local:

```bash
# Con Python
python -m http.server 8000

# Con Node.js (npx)
npx serve .
```

Abre en tu navegador: [http://localhost:8000](http://localhost:8000)

---

## 📂 Arquitectura del Proyecto

```
agency-hustle/
├── index.html            # Shell principal, vistas y modales
├── styles/
│   ├── main.css          # Variables CSS, resets y layout SaaS
│   ├── components.css    # Tarjetas, métricas, árbol de skills, feed Slack
│   └── boss-screen.css   # Camuflaje modo Excel/Sheets
├── js/
│   ├── config.js         # Catálogo de roles, agencias, habilidades y logros
│   ├── state.js          # Gestor de estado reactivo (PubSub) y LocalStorage
│   ├── projects.js       # Generador procedural de clientes y entregables
│   ├── events.js         # Motor de eventos, crisis y dilemas éticos
│   ├── ui.js             # Renderizado del DOM, animaciones y Boss Mode
│   └── app.js            # Bucle de juego y ciclo semanal
└── README.md
```
