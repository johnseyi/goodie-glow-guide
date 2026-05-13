/**
 * Goodie Glow Guide — Main Application
 * Initialises routing, navigation, and page rendering.
 *
 * No ES module imports — content.js is loaded as a plain script before
 * this file and exposes window.GoodieContent. This lets the app work
 * when opened directly via file:// without a local dev server.
 */

// content is set by content.js (loaded before this script in index.html)
const content = window.GoodieContent;

// ─────────────────────────────────────────────
// STORAGE MODULE
// ─────────────────────────────────────────────
const Storage = {
  PREFIX: 'goodie_',

  get(key) {
    try {
      const raw = localStorage.getItem(this.PREFIX + key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(this.PREFIX + key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn('Storage.set failed:', e.message);
      return false;
    }
  },

  remove(key) {
    localStorage.removeItem(this.PREFIX + key);
  },

  clear() {
    Object.keys(localStorage)
      .filter(k => k.startsWith(this.PREFIX))
      .forEach(k => localStorage.removeItem(k));
  }
};


// ─────────────────────────────────────────────
// PROGRESS MODULE
// ─────────────────────────────────────────────
const Progress = {
  _state: null,

  defaultState() {
    return {
      startDate:     new Date().toISOString(),
      currentDay:    1,
      completedDays: [],
      routineChecks: {},
      photos:        {},
      products:      []
    };
  },

  getState() {
    if (!this._state) {
      this._state = Storage.get('userProgress') || this.defaultState();
    }
    return this._state;
  },

  saveState() {
    Storage.set('userProgress', this._state);
  },

  getCurrentDay() {
    return this.getState().currentDay ?? 1;
  },

  getCompletionPercentage() {
    const completed = this.getState().completedDays?.length ?? 0;
    return Math.round((completed / 30) * 100);
  },

  getCompletedCount() {
    return this.getState().completedDays?.length ?? 0;
  },

  isDayComplete(dayNumber) {
    return this.getState().completedDays.includes(dayNumber);
  },

  isDayLocked(dayNumber) {
    const current = this.getCurrentDay();
    return dayNumber > current;
  },

  getDayChecks(day) {
    return this.getState().routineChecks?.[day] ?? { morning: [], night: [] };
  },

  toggleStep(day, period, step, checked) {
    const state = this.getState();
    if (!state.routineChecks[day]) {
      state.routineChecks[day] = { morning: [], night: [] };
    }
    const list = state.routineChecks[day][period];
    if (checked && !list.includes(step)) {
      list.push(step);
    } else if (!checked) {
      const idx = list.indexOf(step);
      if (idx > -1) list.splice(idx, 1);
    }
    this.saveState();
    this._checkDayCompletion(day);
  },

  _checkDayCompletion(day) {
    const dayData  = content.days.find(d => d.day === parseInt(day));
    if (!dayData) return;

    const checks   = this.getDayChecks(day);
    const allMorn  = dayData.morning.every(s => checks.morning.includes(s.step));
    const allNight = dayData.night.every(s => checks.night.includes(s.step));

    if (allMorn && allNight) {
      this._markDayComplete(parseInt(day));
    }
  },

  _markDayComplete(dayNumber) {
    const state = this.getState();
    if (!state.completedDays.includes(dayNumber)) {
      state.completedDays.push(dayNumber);
      if (dayNumber === state.currentDay && dayNumber < 30) {
        state.currentDay = dayNumber + 1;
      }
      this.saveState();
      GoodieApp._onDayComplete(dayNumber);
    }
  }
};


// ─────────────────────────────────────────────
// ROUTER
// ─────────────────────────────────────────────
const Router = {
  routes: {
    '/':           () => Views.renderHome(),
    '/day/:id':    (p) => Views.renderDay(parseInt(p.id)),
    '/progress':   () => Views.renderProgress(),
    '/products':   () => Views.renderProducts(),
    '/help':       () => Views.renderHelp()
  },

  init() {
    window.addEventListener('hashchange', () => this.resolve());
    this.resolve();
  },

  resolve() {
    const hash    = window.location.hash.replace('#', '') || '/';
    const matched = this._match(hash);

    if (matched) {
      matched.handler(matched.params);
    } else {
      Views.render404();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    GoodieApp._updateActiveLinks(hash);
  },

  navigate(path) {
    window.location.hash = path;
  },

  _match(path) {
    for (const [pattern, handler] of Object.entries(this.routes)) {
      const params = this._extractParams(pattern, path);
      if (params !== null) return { handler, params };
    }
    return null;
  },

  _extractParams(pattern, path) {
    const pp = pattern.split('/');
    const lp = path.split('/');
    if (pp.length !== lp.length) return null;

    const params = {};
    for (let i = 0; i < pp.length; i++) {
      if (pp[i].startsWith(':')) {
        params[pp[i].slice(1)] = decodeURIComponent(lp[i]);
      } else if (pp[i] !== lp[i]) {
        return null;
      }
    }
    return params;
  }
};


// ─────────────────────────────────────────────
// VIEWS — page rendering functions
// ─────────────────────────────────────────────
const Views = {
  _root() {
    return document.getElementById('main');
  },

  _render(html) {
    const root = this._root();
    root.innerHTML = html;
    // Re-initialise Lucide icons for newly rendered SVGs
    if (window.lucide) window.lucide.createIcons();
    // Wire up any interactive elements in the new view
    GoodieApp._bindViewEvents();
  },

  // ── HOME PAGE ──────────────────────────────
  renderHome() {
    const pct       = Progress.getCompletionPercentage();
    const completed = Progress.getCompletedCount();
    const currentDay = Progress.getCurrentDay();
    const hasStarted = completed > 0;

    const weekCards = content.weeks.map(week => {
      const dayDots = week.days.map(d => {
        const cls = Progress.isDayComplete(d) ? 'is-done'
                  : d === currentDay           ? 'is-current'
                  : '';
        return `<div class="week-card__day-dot ${cls}" aria-hidden="true"></div>`;
      }).join('');

      return `
        <article class="week-card animate-slide-up" style="animation-delay:${(week.week - 1) * 80}ms">
          <p class="week-card__number">Week ${week.week}</p>
          <h3 class="week-card__title">${week.title}</h3>
          <p class="week-card__focus">${week.focus}</p>
          <p class="week-card__description">${week.description}</p>
          <div class="week-card__days" aria-hidden="true">${dayDots}</div>
        </article>`;
    }).join('');

    const progressBar = hasStarted ? `
      <div class="progress-labelled mb-8 animate-fade-in">
        <div class="progress-labelled__label">
          <span>Your Journey</span>
          <span>${completed} / 30 days complete</span>
        </div>
        <div class="progress" role="progressbar" aria-valuenow="${completed}" aria-valuemin="0" aria-valuemax="30" aria-label="${completed} of 30 days complete">
          <div class="progress__fill progress--lg" style="width:${pct}%"></div>
        </div>
      </div>` : '';

    this._render(`
      <!-- ── HERO ── -->
      <section class="hero" aria-labelledby="hero-heading">
        <div class="container">
          <div class="hero__content">
            <span class="hero__eyebrow">
              <svg data-lucide="sparkles" aria-hidden="true" style="width:14px;height:14px"></svg>
              30-Day Skincare Programme
            </span>

            <h1 class="hero__title" id="hero-heading">
              Welcome to Your<br><span class="highlight">30-Day Glow</span> Journey
            </h1>

            <p class="hero__subtitle">
              A complete, step-by-step skincare programme built specifically for Nigerian and Ugandan skin. Simple routines. Real results. Lasting habits.
            </p>

            ${progressBar}

            <div class="hero__actions">
              <a href="#/day/${currentDay}" class="btn btn--primary btn--lg">
                <svg data-lucide="sun" aria-hidden="true"></svg>
                ${hasStarted ? `Continue — Day ${currentDay}` : 'Start Your Journey'}
              </a>
              <a href="#/progress" class="btn btn--secondary btn--lg">
                <svg data-lucide="bar-chart-2" aria-hidden="true"></svg>
                View Progress
              </a>
            </div>

            <div class="hero__stats">
              <div>
                <div class="hero__stat-value">30</div>
                <div class="hero__stat-label">Days of routines</div>
              </div>
              <div>
                <div class="hero__stat-value">4</div>
                <div class="hero__stat-label">Focused phases</div>
              </div>
              <div>
                <div class="hero__stat-value">100%</div>
                <div class="hero__stat-label">Made for you</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ── HOW IT WORKS ── -->
      <section class="section" aria-labelledby="how-heading">
        <div class="container">
          <div class="text-center mb-8">
            <span class="label">How It Works</span>
            <h2 id="how-heading" class="mt-2">Four Weeks to Glowing Skin</h2>
            <p class="lead" style="max-width:560px;margin:0 auto">Each week builds on the last. We start simple and layer in powerful treatments as your skin adjusts.</p>
          </div>

          <div class="grid--4 stagger">
            ${weekCards}
          </div>
        </div>
      </section>

      <!-- ── WHAT'S INSIDE ── -->
      <section class="section" style="background:var(--color-bg-muted)" aria-labelledby="inside-heading">
        <div class="container">
          <div class="text-center mb-8">
            <span class="label">What's Inside</span>
            <h2 id="inside-heading" class="mt-2">Everything You Need to Glow</h2>
          </div>

          <div class="grid stagger">
            <div class="card card--highlight animate-slide-up">
              <div class="cluster mb-4">
                <div style="width:48px;height:48px;background:var(--color-bg-overlay);border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center">
                  <svg data-lucide="check-circle" class="icon-lg icon-primary" aria-hidden="true"></svg>
                </div>
              </div>
              <h3>Daily Checklists</h3>
              <p class="text-secondary">Step-by-step morning and night routines with checkboxes. Your progress is saved automatically — even if you close the page.</p>
            </div>

            <div class="card card--highlight animate-slide-up" style="animation-delay:80ms">
              <div class="cluster mb-4">
                <div style="width:48px;height:48px;background:rgba(107,142,111,0.1);border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center">
                  <svg data-lucide="leaf" class="icon-lg" style="color:var(--color-secondary)" aria-hidden="true"></svg>
                </div>
              </div>
              <h3>Natural Treatments</h3>
              <p class="text-secondary">Turmeric masks, ginger shots, and ice therapy — powerful natural remedies with clear, step-by-step recipes.</p>
            </div>

            <div class="card card--highlight animate-slide-up" style="animation-delay:160ms">
              <div class="cluster mb-4">
                <div style="width:48px;height:48px;background:rgba(212,175,55,0.1);border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center">
                  <svg data-lucide="camera" class="icon-lg icon-accent" aria-hidden="true"></svg>
                </div>
              </div>
              <h3>Progress Tracking</h3>
              <p class="text-secondary">Before and after photo prompts at Days 1, 10, 20, and 30. See your transformation unfold.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ── CONTACT STRIP ── -->
      <section class="contact-strip" aria-labelledby="contact-heading">
        <div class="container">
          <h2 id="contact-heading">Have Questions? We're Here.</h2>
          <p>Chat with Goodie directly — we respond to every message.</p>
          <div class="cluster">
            <a
              href="https://wa.me/2348063214942?text=Hi%20Goodie!%20I%20have%20a%20question%20about%20the%20Glow%20Guide."
              class="btn btn--whatsapp"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with Goodie on WhatsApp"
            >
              <svg data-lucide="message-circle" aria-hidden="true"></svg>
              WhatsApp: 08063214942
            </a>
            <a
              href="https://instagram.com/its.goodie"
              class="btn btn--secondary"
              style="color:white;border-color:rgba(255,255,255,0.5)"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg data-lucide="instagram" aria-hidden="true"></svg>
              @its.goodie
            </a>
          </div>
        </div>
      </section>
    `);
  },

  // ── DAY PAGE ───────────────────────────────
  renderDay(dayNumber) {
    const day = content.days.find(d => d.day === dayNumber);
    if (!day) { this.render404(); return; }

    const checks     = Progress.getDayChecks(dayNumber);
    const isComplete = Progress.isDayComplete(dayNumber);
    const isLocked   = Progress.isDayLocked(dayNumber);

    const buildStepItem = (step, period) => {
      const done = checks[period]?.includes(step.step);
      return `
        <li class="routine-checklist__item">
          <label class="checkbox-item ${done ? 'is-checked' : ''}">
            <input
              class="checkbox-item__input routine-checklist__input"
              type="checkbox"
              id="day${dayNumber}-${period}-${step.step}"
              ${done ? 'checked' : ''}
              ${isComplete ? 'disabled' : ''}
              data-day="${dayNumber}"
              data-period="${period}"
              data-step="${step.step}"
              aria-describedby="hint-${dayNumber}-${period}-${step.step}"
            >
            <span class="checkbox-item__label">
              <span class="step-name">${_cap(step.step)} — ${step.product}</span>
              <span class="step-details" id="hint-${dayNumber}-${period}-${step.step}">
                ${step.duration} &nbsp;·&nbsp; ${step.instructions}
              </span>
            </span>
          </label>
        </li>`;
    };

    const morningSteps = day.morning.map(s => buildStepItem(s, 'morning')).join('');
    const nightSteps   = day.night.map(s => buildStepItem(s, 'night')).join('');

    const avoidItems = day.avoid.map(a => `<li>${a}</li>`).join('');

    const specialNote = day.specialNote ? `
      <div class="special-note animate-fade-in" role="note">
        <svg data-lucide="info" class="icon-md icon-primary" aria-hidden="true" style="display:inline;vertical-align:middle;margin-right:6px"></svg>
        ${day.specialNote}
      </div>` : '';

    const remedy = day.naturalRemedy ? `
      <div class="remedy-box animate-slide-up">
        <p class="remedy-box__title">${day.naturalRemedy.name}</p>
        <p class="remedy-box__timing">When: ${day.naturalRemedy.timing}</p>
        <p class="remedy-box__subtitle">You'll need</p>
        <ul>${day.naturalRemedy.ingredients.map(i => `<li>${i}</li>`).join('')}</ul>
        <p class="remedy-box__subtitle">Steps</p>
        <ol>${day.naturalRemedy.instructions.map(i => `<li>${i}</li>`).join('')}</ol>
        <p class="remedy-box__benefits">${day.naturalRemedy.benefits}</p>
      </div>` : '';

    const completeBanner = isComplete ? `
      <div class="card" style="background:linear-gradient(135deg,#f0f7f1,#fff);border-color:var(--color-success);border-left:4px solid var(--color-success);text-align:center;padding:var(--space-8)" role="status">
        <svg data-lucide="check-circle" style="width:48px;height:48px;color:var(--color-success);margin:0 auto var(--space-3)" aria-hidden="true"></svg>
        <h3 style="color:var(--color-success)">Day ${dayNumber} Complete!</h3>
        <p class="text-secondary">Well done. Your skin thanks you.</p>
        ${dayNumber < 30
          ? `<a href="#/day/${dayNumber + 1}" class="btn btn--primary mt-4">Day ${dayNumber + 1} →</a>`
          : `<a href="#/progress" class="btn btn--accent mt-4 animate-pulse-glow">See Your Transformation</a>`
        }
      </div>` : '';

    const lockedBanner = isLocked ? `
      <div class="card" style="text-align:center;padding:var(--space-8)" role="status">
        <svg data-lucide="lock" style="width:48px;height:48px;color:var(--color-text-muted);margin:0 auto var(--space-3)" aria-hidden="true"></svg>
        <h3>Day ${dayNumber} is locked</h3>
        <p class="text-secondary">Complete Day ${dayNumber - 1} first to unlock this day.</p>
        <a href="#/day/${Progress.getCurrentDay()}" class="btn btn--primary mt-4">Go to Current Day</a>
      </div>` : '';

    const prevDay = dayNumber > 1  ? `<a href="#/day/${dayNumber - 1}" class="btn btn--ghost btn--sm day-nav__btn" aria-label="Go to Day ${dayNumber - 1}"><svg data-lucide="chevron-left" aria-hidden="true"></svg> Day ${dayNumber - 1}</a>` : '';
    const nextDay = dayNumber < 30 ? `<a href="#/day/${dayNumber + 1}" class="btn btn--ghost btn--sm day-nav__btn" aria-label="Go to Day ${dayNumber + 1}">Day ${dayNumber + 1} <svg data-lucide="chevron-right" aria-hidden="true"></svg></a>` : '';

    this._render(`
      <!-- ── DAY HEADER ── -->
      <header class="day-header" role="banner">
        <div class="container">
          <div>
            <div class="day-header__meta">
              <span class="badge badge--week day-header__badge">Week ${day.week} · ${day.phase}</span>
              ${isComplete ? '<span class="badge badge--success">Complete</span>' : ''}
            </div>
            <h1 class="day-header__title">Day ${day.day} — ${day.title}</h1>
            <p class="day-header__subtitle">Your ${day.phase.toLowerCase()} phase continues.</p>
          </div>
          <nav class="day-nav" aria-label="Day navigation">
            ${prevDay}
            ${nextDay}
          </nav>
        </div>
      </header>

      <!-- ── DAY CONTENT ── -->
      <div class="section">
        <div class="container">
          <div class="sidebar-layout">

            <!-- Main column: routines -->
            <div class="sidebar-layout__main stack" style="--stack-gap:var(--space-8)">

              ${lockedBanner}
              ${completeBanner}

              ${!isLocked && !isComplete ? `
              <!-- Morning routine -->
              <fieldset class="routine-checklist" id="morning-routine">
                <legend class="routine-checklist__legend">
                  <svg data-lucide="sun" aria-hidden="true"></svg>
                  Morning Routine
                </legend>
                <ul class="routine-checklist__list" role="list">${morningSteps}</ul>
              </fieldset>

              <!-- Night routine -->
              <fieldset class="routine-checklist" id="night-routine">
                <legend class="routine-checklist__legend">
                  <svg data-lucide="moon" aria-hidden="true"></svg>
                  Night Routine
                </legend>
                <ul class="routine-checklist__list" role="list">${nightSteps}</ul>
              </fieldset>
              ` : ''}

              ${remedy}

            </div>

            <!-- Sidebar: tip + avoid + note -->
            <aside class="sidebar-layout__aside stack" style="--stack-gap:var(--space-6)" aria-label="Day guidance">

              <!-- Progress ring -->
              <div class="card text-center" aria-hidden="true">
                <svg class="progress-ring" viewBox="0 0 120 120" width="100" height="100" style="margin:0 auto">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="var(--color-bg-muted)" stroke-width="8"/>
                  <circle
                    class="progress-ring__fill"
                    cx="60" cy="60" r="52"
                    fill="none"
                    stroke="var(--color-accent)"
                    stroke-width="8"
                    stroke-linecap="round"
                    stroke-dasharray="326.73"
                    stroke-dashoffset="${326.73 - (326.73 * ((dayNumber - 1) / 30))}"
                    transform="rotate(-90 60 60)"
                  />
                  <text class="progress-ring__day"   x="60" y="52" text-anchor="middle" dominant-baseline="middle">Day</text>
                  <text class="progress-ring__number" x="60" y="72" text-anchor="middle" dominant-baseline="middle">${dayNumber}</text>
                </svg>
                <p class="text-muted" style="font-size:var(--text-sm);margin-top:var(--space-2)">of 30</p>
              </div>

              <!-- Tip -->
              <div class="tip-box">
                <p class="tip-box__label">
                  <svg data-lucide="sparkles" aria-hidden="true"></svg>
                  Today's Tip
                </p>
                <p>${day.tip}</p>
              </div>

              <!-- Avoid -->
              <div class="card">
                <h3 style="font-size:var(--text-base);margin-bottom:var(--space-3);display:flex;align-items:center;gap:var(--space-2)">
                  <svg data-lucide="alert-circle" class="icon-md" style="color:var(--color-warning)" aria-hidden="true"></svg>
                  Skip These Today
                </h3>
                <ul class="avoid-list" role="list">${avoidItems}</ul>
              </div>

              ${specialNote}

              <!-- WhatsApp help -->
              <a
                href="https://wa.me/2348063214942?text=Hi%20Goodie!%20I'm%20on%20Day%20${dayNumber}%20and%20I%20have%20a%20question."
                class="btn btn--whatsapp btn--full"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg data-lucide="message-circle" aria-hidden="true"></svg>
                Question? Chat with Goodie
              </a>

            </aside>
          </div>
        </div>
      </div>
    `);
  },

  // ── PROGRESS PAGE ──────────────────────────
  renderProgress() {
    const completed  = Progress.getCompletedCount();
    const pct        = Progress.getCompletionPercentage();
    const currentDay = Progress.getCurrentDay();

    const dayGrid = content.days.map(day => {
      const done    = Progress.isDayComplete(day.day);
      const current = day.day === currentDay;
      const locked  = Progress.isDayLocked(day.day);

      const cls = done ? 'is-complete' : current ? 'is-current' : locked ? 'is-locked' : '';
      const icon = done ? 'check-circle' : current ? 'star' : 'circle';

      return `
        <a href="#/day/${day.day}" class="card card--day card--interactive ${cls}" aria-label="Day ${day.day}: ${day.title}${done ? ' — complete' : current ? ' — current day' : locked ? ' — locked' : ''}">
          <div class="cluster justify-between mb-2">
            <span class="badge ${done ? 'badge--success' : current ? 'badge--accent' : 'badge--muted'}">Day ${day.day}</span>
            <svg data-lucide="${icon}" class="icon-md ${done ? 'icon-success' : current ? 'icon-accent' : 'icon-muted'}" aria-hidden="true"></svg>
          </div>
          <p style="font-size:var(--text-sm);font-weight:600;margin:0;color:var(--color-text-primary)">${day.title}</p>
          <p style="font-size:var(--text-xs);color:var(--color-text-muted);margin:var(--space-1) 0 0">Week ${day.week} · ${day.phase}</p>
        </a>`;
    }).join('');

    this._render(`
      <section class="section" aria-labelledby="progress-heading">
        <div class="container">
          <div class="text-center mb-8">
            <span class="label">Your Journey</span>
            <h1 id="progress-heading" class="mt-2">My Progress</h1>
          </div>

          <!-- Overall progress -->
          <div class="card card--highlight mb-8 animate-scale-in">
            <div class="cluster justify-between mb-4" style="flex-wrap:wrap;gap:var(--space-4)">
              <div>
                <p class="label">Overall Progress</p>
                <p style="font-size:var(--text-3xl);font-weight:700;color:var(--color-primary);line-height:1;margin:var(--space-2) 0">${completed}<span style="font-size:var(--text-lg);color:var(--color-text-muted)">/30 days</span></p>
              </div>
              <div style="text-align:right">
                <p class="label">Current Day</p>
                <p style="font-size:var(--text-3xl);font-weight:700;color:var(--color-accent);line-height:1;margin:var(--space-2) 0">${currentDay}</p>
              </div>
            </div>
            <div class="progress-labelled">
              <div class="progress-labelled__label">
                <span>${pct}% complete</span>
                <span>${30 - completed} days remaining</span>
              </div>
              <div class="progress" role="progressbar" aria-valuenow="${completed}" aria-valuemin="0" aria-valuemax="30" aria-label="${completed} of 30 days complete">
                <div class="progress__fill progress--lg" style="width:${pct}%"></div>
              </div>
            </div>

            <div class="cluster mt-6" style="justify-content:flex-start;flex-wrap:wrap;gap:var(--space-2)">
              <a href="#/day/${currentDay}" class="btn btn--primary">
                <svg data-lucide="sun" aria-hidden="true"></svg>
                Go to Day ${currentDay}
              </a>
              ${completed === 30 ? `<a href="#/day/1" class="btn btn--ghost">View Day 1 Again</a>` : ''}
            </div>
          </div>

          <!-- Day grid -->
          <h2 class="mb-4" style="font-size:var(--text-xl)">All 30 Days</h2>
          <div class="grid--days stagger" role="list" aria-label="All 30 days">
            ${dayGrid}
          </div>
        </div>
      </section>
    `);
  },

  // ── PRODUCTS PAGE ──────────────────────────
  renderProducts() {
    const productCards = Object.values(content.products).map(p => `
      <div class="card animate-slide-up" role="listitem">
        <p class="label mb-2">${p.use}</p>
        <h3 style="font-size:var(--text-lg);margin-bottom:var(--space-2)">${p.name}</h3>
        <p class="text-secondary text-sm">${p.use}</p>
      </div>`).join('');

    this._render(`
      <section class="section" aria-labelledby="products-heading">
        <div class="container">
          <div class="text-center mb-8">
            <span class="label">Goodie Products</span>
            <h1 id="products-heading" class="mt-2">Your Product Guide</h1>
            <p class="lead" style="max-width:520px;margin:0 auto">Every product in this guide is a Goodie product. Here's exactly what each one does and when to use it.</p>
          </div>
          <div class="grid stagger" role="list">
            ${productCards}
          </div>
          <div class="contact-strip mt-8" style="border-radius:var(--radius-lg)">
            <h2>Need to Order Products?</h2>
            <p>Chat with us directly to place your order.</p>
            <div class="cluster">
              <a href="https://wa.me/2348063214942?text=Hi%20Goodie!%20I%20want%20to%20order%20the%20Glow%20Guide%20products." class="btn btn--whatsapp" target="_blank" rel="noopener noreferrer">
                <svg data-lucide="message-circle" aria-hidden="true"></svg>
                Order via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    `);
  },

  // ── HELP PAGE ──────────────────────────────
  renderHelp() {
    const faqs = [
      { q: "My skin is breaking out — should I stop?", a: "No! Breakouts in the first 2 weeks often mean your skin is detoxing and adjusting. Keep going, be gentle, don't pick. If breakouts persist past Week 2 or are severe, chat with us on WhatsApp." },
      { q: "I missed a day — should I restart?", a: "Never restart. Just pick up where you left off. One missed day doesn't undo your progress. The routine is cumulative — every day you show up builds on the previous ones." },
      { q: "My skin feels tight and dry after cleansing.", a: "Use less product and cooler water. Pat dry immediately and apply moisturiser while your skin is still damp. If it persists, you may be over-cleansing — once in the morning is fine on low-activity days." },
      { q: "Can I add extra products I already own?", a: "We recommend sticking to the Goodie products for the full 30 days. Adding unknown products makes it harder to know what's working. After Day 30, introduce new products one at a time." },
      { q: "The turmeric mask left my face yellow!", a: "Rinse again with a small amount of cleanser and cool water. The yellow tint is temporary and fades within 30–60 minutes. Next time, add a teaspoon of gram flour (chickpea flour) to the mask — it helps bind the turmeric and reduce staining." },
      { q: "Is sunscreen really necessary on cloudy days?", a: "Yes — 80% of UV rays pass through clouds. UVA rays (the ones that cause dark spots and ageing) also come through windows. SPF every morning, every day, is the most impactful thing you can do for your skin long-term." }
    ];

    const faqItems = faqs.map((faq, i) => `
      <div class="card animate-slide-up" style="animation-delay:${i * 60}ms">
        <h3 style="font-size:var(--text-base);margin-bottom:var(--space-3);display:flex;align-items:flex-start;gap:var(--space-2)">
          <svg data-lucide="help-circle" class="icon-md icon-primary" style="flex-shrink:0;margin-top:2px" aria-hidden="true"></svg>
          ${faq.q}
        </h3>
        <p class="text-secondary" style="margin:0;padding-left:calc(20px + var(--space-2))">${faq.a}</p>
      </div>`).join('');

    this._render(`
      <section class="section" aria-labelledby="help-heading">
        <div class="container">
          <div class="text-center mb-8">
            <span class="label">Troubleshooting</span>
            <h1 id="help-heading" class="mt-2">We've Got You</h1>
            <p class="lead" style="max-width:520px;margin:0 auto">Common questions answered. Still stuck? Chat with us directly.</p>
          </div>
          <div class="stack" style="--stack-gap:var(--space-4);max-width:720px;margin:0 auto">
            ${faqItems}
          </div>
          <div class="contact-strip mt-8" style="border-radius:var(--radius-lg)">
            <h2>Still Have Questions?</h2>
            <p>We respond to every WhatsApp message, usually within a few hours.</p>
            <div class="cluster">
              <a href="https://wa.me/2348063214942?text=Hi%20Goodie!%20I%20need%20help%20with%20the%20Glow%20Guide." class="btn btn--whatsapp" target="_blank" rel="noopener noreferrer">
                <svg data-lucide="message-circle" aria-hidden="true"></svg>
                WhatsApp: 08063214942
              </a>
            </div>
          </div>
        </div>
      </section>
    `);
  },

  // ── 404 ────────────────────────────────────
  render404() {
    this._render(`
      <div class="empty-state section">
        <svg data-lucide="frown" aria-hidden="true"></svg>
        <h3>Page Not Found</h3>
        <p>We couldn't find what you were looking for.</p>
        <a href="#/" class="btn btn--primary">Go Home</a>
      </div>
    `);
  }
};


// ─────────────────────────────────────────────
// MAIN APP CONTROLLER
// ─────────────────────────────────────────────
const GoodieApp = {

  init() {
    this._setupNavigation();
    this._updateFooterYear();
    Router.init();
  },

  // ── Navigation ──────────────────────────────
  _setupNavigation() {
    const toggle   = document.querySelector('[data-nav-toggle]');
    const drawer   = document.querySelector('[data-nav-drawer]');
    const backdrop = document.querySelector('[data-nav-backdrop]');

    if (!toggle || !drawer) return;

    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      isOpen ? this._closeNav(toggle, drawer, backdrop) : this._openNav(toggle, drawer, backdrop);
    });

    backdrop?.addEventListener('click', () => this._closeNav(toggle, drawer, backdrop));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        this._closeNav(toggle, drawer, backdrop);
      }
    });

    // Close drawer on nav link click (mobile)
    drawer.querySelectorAll('.nav__link, .nav__cta').forEach(link => {
      link.addEventListener('click', () => this._closeNav(toggle, drawer, backdrop));
    });
  },

  _openNav(toggle, drawer, backdrop) {
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    drawer.classList.add('is-open');
    backdrop?.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
    // Focus first link in drawer
    drawer.querySelector('a')?.focus();
  },

  _closeNav(toggle, drawer, backdrop) {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    drawer.classList.remove('is-open');
    backdrop?.classList.remove('is-visible');
    document.body.style.overflow = '';
    toggle.focus();
  },

  // ── Active link highlighting ─────────────────
  _updateActiveLinks(hash) {
    const path = hash || '/';

    document.querySelectorAll('[data-nav-link], [data-bottom-link]').forEach(link => {
      link.classList.remove('is-active');
    });

    // Match nav links to current route
    const map = {
      '/':         ['home'],
      '/progress': ['progress'],
      '/products': ['products'],
      '/help':     ['help']
    };

    // Day routes
    if (path.startsWith('/day/')) {
      document.querySelectorAll('[data-nav-link="day"], [data-bottom-link="day"]')
        .forEach(el => el.classList.add('is-active'));
      return;
    }

    const keys = map[path];
    if (keys) {
      keys.forEach(key => {
        document.querySelectorAll(`[data-nav-link="${key}"], [data-bottom-link="${key}"]`)
          .forEach(el => el.classList.add('is-active'));
      });
    }
  },

  // ── Bind events in rendered views ───────────
  _bindViewEvents() {
    // Routine checkboxes
    document.querySelectorAll('.routine-checklist__input').forEach(input => {
      input.addEventListener('change', (e) => {
        const { day, period, step } = e.target.dataset;
        Progress.toggleStep(day, period, step, e.target.checked);

        // Update label strikethrough immediately
        const label = e.target.closest('.checkbox-item');
        if (label) label.classList.toggle('is-checked', e.target.checked);

        // Update progress ring text
        this._refreshProgressRing();
      });
    });
  },

  _refreshProgressRing() {
    const ring = document.querySelector('.progress-ring__fill');
    const pct  = Progress.getCompletionPercentage();
    if (ring) {
      const circumference = 326.73;
      ring.style.strokeDashoffset = circumference - (circumference * pct / 100);
    }
  },

  // ── Day completion callback ──────────────────
  _onDayComplete(dayNumber) {
    // Re-render the day view to show the completion banner
    Views.renderDay(dayNumber);
  },

  // ── Footer year ─────────────────────────────
  _updateFooterYear() {
    const el = document.getElementById('footer-year');
    if (el) el.textContent = new Date().getFullYear();
  }
};


// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

// Capitalise first letter
function _cap(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : str;
}


// ─────────────────────────────────────────────
// BOOT
// ─────────────────────────────────────────────
// This script sits at the bottom of <body> with no defer/async, so by the
// time the browser executes it the entire DOM is already built. No
// DOMContentLoaded listener is needed — just run immediately.
(function boot() {
  if (!content) {
    // content.js failed or loaded out of order
    var el = document.getElementById('main');
    if (el) el.innerHTML = '<div class="empty-state section"><h3>Could not load content</h3><p>Please refresh the page. If the problem persists, try opening the file from a local server.</p></div>';
    console.error('[Goodie] window.GoodieContent is not set. Make sure content.js loads before app.js.');
    return;
  }
  GoodieApp.init();
  // Lucide loads async — call createIcons now if already available,
  // otherwise the onload handler on the <script> tag handles it.
  if (window.lucide) window.lucide.createIcons();
}());
