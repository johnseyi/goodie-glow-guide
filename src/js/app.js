/**
 * Goodie Glow Guide — Main Application
 * Initialises routing, navigation, and page rendering.
 *
 * Wrapped in an IIFE so all module-level consts (including `content`) are
 * scoped here and can never collide with globals set by content.js.
 */
(function () {

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
    return this.getState().routineChecks?.[day] ?? { morning: [], night: [], remedy: false };
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
  },

  // Saves completion without triggering a re-render (used by the complete button)
  markDayCompleteQuiet(dayNumber) {
    const state = this.getState();
    if (!state.completedDays.includes(dayNumber)) {
      state.completedDays.push(dayNumber);
      if (dayNumber === state.currentDay && dayNumber < 30) {
        state.currentDay = dayNumber + 1;
      }
      this.saveState();
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

    // ── Step item builder ──────────────────────
    const buildStepItem = (step, period) => {
      const done  = checks[period]?.includes(step.step) ?? false;
      const id    = `chk-${dayNumber}-${period}-${step.step}`;
      return `
        <li class="routine-checklist__item">
          <label class="checkbox-item ${done ? 'is-checked' : ''}" for="${id}">
            <input
              class="checkbox-item__input routine-checklist__input"
              type="checkbox"
              id="${id}"
              ${done ? 'checked' : ''}
              ${isComplete ? 'disabled' : ''}
              data-day="${dayNumber}"
              data-period="${period}"
              data-step="${step.step}"
            >
            <span class="checkbox-item__label">
              <span class="step-name">${_cap(step.step.replace(/-/g,' '))} — ${step.product}</span>
              <span class="step-meta">${step.duration}</span>
            </span>
          </label>
          <details class="step-details-panel"${done ? ' open' : ''}>
            <summary aria-label="How to: ${step.product}">
              <span>How to</span>
              <svg data-lucide="chevron-down" aria-hidden="true"></svg>
            </summary>
            <p class="step-details-panel__body">${step.instructions}</p>
          </details>
        </li>`;
    };

    // ── Routine section builder ────────────────
    const buildRoutine = (steps, period, label, icon) => {
      const doneCount  = steps.filter(s => checks[period]?.includes(s.step)).length;
      const allDone    = doneCount === steps.length;
      return `
        <fieldset class="routine-checklist" id="${period}-routine">
          <legend class="routine-checklist__legend">
            <svg data-lucide="${icon}" aria-hidden="true"></svg>
            ${label}
            <span class="routine-checklist__counter${allDone ? ' is-done' : ''}" id="${period}-counter">${doneCount}/${steps.length}</span>
          </legend>
          <ul class="routine-checklist__list" role="list">
            ${steps.map(s => buildStepItem(s, period)).join('')}
          </ul>
        </fieldset>`;
    };

    // ── Natural remedy ─────────────────────────
    const remedyDone = checks.remedy === true;
    const remedy = day.naturalRemedy ? `
      <div class="remedy-box animate-slide-up">
        <div style="display:flex;align-items:center;gap:var(--space-2);margin-bottom:var(--space-3)">
          <svg data-lucide="leaf" style="width:20px;height:20px;color:var(--color-secondary)" aria-hidden="true"></svg>
          <p class="remedy-box__title" style="margin:0">${day.naturalRemedy.name}</p>
        </div>
        <p class="remedy-box__timing">When: ${day.naturalRemedy.timing}</p>
        <p class="remedy-box__subtitle">You'll need</p>
        <ul>${day.naturalRemedy.ingredients.map(i => `<li>${i}</li>`).join('')}</ul>
        <p class="remedy-box__subtitle">Steps</p>
        <ol>${day.naturalRemedy.instructions.map(i => `<li>${i}</li>`).join('')}</ol>
        <p class="remedy-box__benefits">${day.naturalRemedy.benefits}</p>
        ${!isComplete ? `
        <label class="remedy-done" for="remedy-done-${dayNumber}">
          <input
            type="checkbox"
            class="checkbox-item__input"
            id="remedy-done-${dayNumber}"
            ${remedyDone ? 'checked' : ''}
            data-day="${dayNumber}"
            data-period="remedy"
            data-step="remedy"
          >
          I did this treatment today
        </label>` : ''}
      </div>` : '';

    // ── Photo upload card (Days 1, 10, 20, 30) ─
    const photoDay = [1, 10, 20, 30].includes(dayNumber) || day.hasPhotoPrompt;
    const savedPhoto = Storage.get(`photo_day${dayNumber}`);
    const photoLabel = dayNumber === 1 ? 'Before photo' : dayNumber === 30 ? 'After photo' : 'Progress photo';
    const photoCard = photoDay ? `
      <div class="photo-card animate-slide-up">
        <div class="photo-card__header">
          <svg data-lucide="camera" aria-hidden="true"></svg>
          <h3>${photoLabel} — Day ${dayNumber}</h3>
        </div>
        <p class="text-secondary" style="font-size:var(--text-sm);margin-bottom:var(--space-4)">
          Natural lighting, same spot each time. This is your glow record.
        </p>
        ${savedPhoto ? `
          <div class="photo-card__preview">
            <img src="${savedPhoto}" alt="Your Day ${dayNumber} progress photo" class="photo-card__img">
            <button class="btn btn--ghost btn--sm photo-card__delete" data-delete-photo="${dayNumber}" aria-label="Remove Day ${dayNumber} photo">
              <svg data-lucide="trash-2" aria-hidden="true"></svg> Remove
            </button>
          </div>` : `
          <label class="photo-upload" for="photo-input-${dayNumber}">
            <svg data-lucide="upload-cloud" aria-hidden="true"></svg>
            <span>Tap to add photo</span>
            <input type="file" id="photo-input-${dayNumber}" accept="image/*" capture="environment"
              class="photo-upload__input" data-photo-day="${dayNumber}"
              aria-label="Upload Day ${dayNumber} progress photo">
          </label>`}
      </div>` : '';

    // ── Special note ───────────────────────────
    const specialNote = day.specialNote ? `
      <div class="special-note animate-fade-in" role="note">
        <svg data-lucide="info" class="icon-md icon-primary" aria-hidden="true"
          style="display:inline;vertical-align:middle;margin-right:6px"></svg>
        ${day.specialNote}
      </div>` : '';

    // ── Banners ────────────────────────────────
    const completeBanner = isComplete ? `
      <div class="complete-banner" role="status">
        <svg data-lucide="check-circle" class="complete-icon" aria-hidden="true"></svg>
        <h3>Day ${dayNumber} Complete!</h3>
        <p>Your skin thanks you. Keep the momentum going.</p>
        ${dayNumber < 30
          ? `<a href="#/day/${dayNumber + 1}" class="btn btn--primary">Continue to Day ${dayNumber + 1} →</a>`
          : `<a href="#/progress" class="btn btn--accent animate-pulse-glow">See Your Full Transformation</a>`
        }
      </div>` : '';

    const lockedBanner = isLocked ? `
      <div class="card" style="text-align:center;padding:var(--space-8)" role="status">
        <svg data-lucide="lock" style="width:48px;height:48px;color:var(--color-text-muted);margin:0 auto var(--space-3)" aria-hidden="true"></svg>
        <h3>Day ${dayNumber} is locked</h3>
        <p class="text-secondary">Complete Day ${dayNumber - 1} first to unlock this day.</p>
        <a href="#/day/${Progress.getCurrentDay()}" class="btn btn--primary mt-4">Go to Current Day</a>
      </div>` : '';

    // ── Nav arrows ─────────────────────────────
    const prevDay = dayNumber > 1
      ? `<a href="#/day/${dayNumber - 1}" class="btn btn--ghost btn--sm" aria-label="Go to Day ${dayNumber - 1}">
           <svg data-lucide="chevron-left" aria-hidden="true"></svg> Day ${dayNumber - 1}
         </a>` : '';
    const nextDay = dayNumber < 30
      ? `<a href="#/day/${dayNumber + 1}" class="btn btn--ghost btn--sm" aria-label="Go to Day ${dayNumber + 1}">
           Day ${dayNumber + 1} <svg data-lucide="chevron-right" aria-hidden="true"></svg>
         </a>` : '';

    // ── Progress ring ──────────────────────────
    const completedCount = Progress.getCompletedCount();
    const ringOffset = 326.73 - (326.73 * (completedCount / 30));

    // ── Complete button bar ────────────────────
    const totalSteps = day.morning.length + day.night.length;
    const doneSteps  = (checks.morning?.length ?? 0) + (checks.night?.length ?? 0);
    const canComplete = !isComplete && !isLocked && doneSteps >= totalSteps;

    const completeBar = !isComplete && !isLocked ? `
      <div class="day-complete-bar" id="day-complete-bar">
        <div class="container">
          <div class="day-complete-bar__inner">
            <p class="day-complete-bar__status">
              <strong id="step-counter">${doneSteps}/${totalSteps}</strong> steps done
            </p>
            <button
              class="btn btn--primary"
              id="mark-complete-btn"
              data-day="${dayNumber}"
              ${canComplete ? '' : 'disabled'}
              aria-label="Mark Day ${dayNumber} as complete"
            >
              <svg data-lucide="check-circle" aria-hidden="true"></svg>
              Mark Day ${dayNumber} Complete
            </button>
          </div>
        </div>
      </div>` : '';

    this._render(`
      <!-- ── DAY HEADER ── -->
      <header class="day-header" role="banner">
        <div class="container">
          <div>
            <div class="day-header__meta">
              <span class="badge badge--week day-header__badge">Week ${day.week} · ${day.phase}</span>
              ${isComplete ? '<span class="badge badge--success">✓ Complete</span>' : ''}
            </div>
            <h1 class="day-header__title">Day ${day.day} — ${day.title}</h1>
            <p class="day-header__subtitle">${day.phase} phase · Week ${day.week} of 4</p>
          </div>
          <nav class="day-nav" aria-label="Day navigation">
            ${prevDay}
            ${nextDay}
          </nav>
        </div>
      </header>

      <!-- ── SWIPE HINT (mobile) ── -->
      <p class="swipe-hint" aria-hidden="true">
        <svg data-lucide="chevron-left" aria-hidden="true"></svg>
        Swipe or use arrow keys to change days
        <svg data-lucide="chevron-right" aria-hidden="true"></svg>
      </p>

      <!-- ── DAY CONTENT ── -->
      <div class="section" style="padding-top:var(--space-8)">
        <div class="container">
          <div class="sidebar-layout">

            <!-- Main: routines -->
            <div class="sidebar-layout__main stack" style="--stack-gap:var(--space-8)">

              ${lockedBanner}
              ${completeBanner}

              ${!isLocked ? `
                ${buildRoutine(day.morning, 'morning', 'Morning Routine', 'sun')}
                ${buildRoutine(day.night,   'night',   'Night Routine',   'moon')}
              ` : ''}

              ${remedy}
              ${photoCard}

            </div>

            <!-- Sidebar: ring + tip + avoid + note -->
            <aside class="sidebar-layout__aside stack" style="--stack-gap:var(--space-5)" aria-label="Day guidance">

              <!-- Progress ring -->
              <div class="card text-center" aria-label="${completedCount} of 30 days complete">
                <svg class="progress-ring" viewBox="0 0 120 120" width="110" height="110" style="margin:0 auto;display:block">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="var(--color-bg-muted)" stroke-width="8"/>
                  <circle
                    class="progress-ring__fill"
                    cx="60" cy="60" r="52"
                    fill="none"
                    stroke="var(--color-accent)"
                    stroke-width="8"
                    stroke-linecap="round"
                    stroke-dasharray="326.73"
                    stroke-dashoffset="${ringOffset}"
                    transform="rotate(-90 60 60)"
                  />
                  <text class="progress-ring__day"    x="60" y="50" text-anchor="middle" dominant-baseline="middle">Day</text>
                  <text class="progress-ring__number" x="60" y="72" text-anchor="middle" dominant-baseline="middle">${dayNumber}</text>
                </svg>
                <p style="font-size:var(--text-xs);color:var(--color-text-muted);margin-top:var(--space-2)">${completedCount}/30 complete</p>
              </div>

              <!-- Today's tip -->
              <div class="tip-box">
                <p class="tip-box__label">
                  <svg data-lucide="sparkles" aria-hidden="true"></svg>
                  Today's Tip
                </p>
                <p>${day.tip}</p>
              </div>

              <!-- What to avoid -->
              <div class="card">
                <h3 style="font-size:var(--text-base);margin-bottom:var(--space-3);display:flex;align-items:center;gap:var(--space-2)">
                  <svg data-lucide="alert-circle" class="icon-md" style="color:var(--color-warning)" aria-hidden="true"></svg>
                  Skip These Today
                </h3>
                <ul class="avoid-list" role="list">
                  ${day.avoid.map(a => `<li>${a}</li>`).join('')}
                </ul>
              </div>

              ${specialNote}

              <!-- WhatsApp help -->
              <a
                href="https://wa.me/2348063214942?text=Hi%20Goodie!%20I'm%20on%20Day%20${dayNumber}%20and%20I%20have%20a%20question."
                class="btn btn--whatsapp btn--full"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with Goodie on WhatsApp about Day ${dayNumber}"
              >
                <svg data-lucide="message-circle" aria-hidden="true"></svg>
                Need Help? Chat with Goodie
              </a>

            </aside>
          </div>
        </div>
      </div>

      ${completeBar}
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
    this._setupKeyboardNav();
    this._setupSwipeNav();
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

        // Remedy checkbox is tracked separately
        if (period === 'remedy') {
          const state = Progress.getState();
          if (!state.routineChecks[day]) state.routineChecks[day] = { morning: [], night: [] };
          state.routineChecks[day].remedy = e.target.checked;
          Progress.saveState();
          return;
        }

        Progress.toggleStep(day, period, step, e.target.checked);

        const label = e.target.closest('.checkbox-item');
        if (label) label.classList.toggle('is-checked', e.target.checked);

        this._refreshCompleteBar(parseInt(day));
      });
    });

    // Mark complete button
    const completeBtn = document.getElementById('mark-complete-btn');
    if (completeBtn) {
      completeBtn.addEventListener('click', () => {
        const dayNum = parseInt(completeBtn.dataset.day);
        Progress.markDayCompleteQuiet(dayNum);
        _launchConfetti();
        _showToast(dayNum < 30
          ? `Day ${dayNum} done! Keep glowing — Day ${dayNum + 1} is next.`
          : 'Day 30 complete! You did it. Welcome to the glow side!', 'success');
        completeBtn.disabled = true;
        completeBtn.innerHTML = '<svg data-lucide="check" aria-hidden="true"></svg> Day Complete!';
        if (window.lucide) window.lucide.createIcons();
        setTimeout(() => {
          Router.navigate(dayNum < 30 ? `/day/${dayNum + 1}` : '/progress');
        }, 2200);
      });
    }

    // Photo upload
    document.querySelectorAll('.photo-upload__input').forEach(input => {
      input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const dayNum = parseInt(e.target.dataset.photoDay);
        _compressImage(file, (dataUrl) => {
          try {
            Storage.set(`photo_day${dayNum}`, dataUrl);
            Views.renderDay(dayNum); // re-render to show preview
          } catch {
            _showToast('Photo too large to save. Try a smaller image.', 'warning');
          }
        });
      });
    });

    // Photo delete
    document.querySelectorAll('[data-delete-photo]').forEach(btn => {
      btn.addEventListener('click', () => {
        const dayNum = parseInt(btn.dataset.deletePhoto);
        Storage.remove(`photo_day${dayNum}`);
        Views.renderDay(dayNum);
      });
    });
  },

  _refreshCompleteBar(dayNumber) {
    const btn = document.getElementById('mark-complete-btn');
    if (!btn) return;
    const day = content.days.find(d => d.day === dayNumber);
    if (!day) return;

    const checks     = Progress.getDayChecks(dayNumber);
    const totalSteps = day.morning.length + day.night.length;
    const doneSteps  = (checks.morning?.length ?? 0) + (checks.night?.length ?? 0);

    btn.disabled = doneSteps < totalSteps;

    const counter = document.getElementById('step-counter');
    if (counter) counter.textContent = `${doneSteps}/${totalSteps}`;

    // Update per-routine counters
    ['morning', 'night'].forEach(period => {
      const el = document.getElementById(`${period}-counter`);
      if (!el) return;
      const periodSteps = period === 'morning' ? day.morning.length : day.night.length;
      const done = checks[period]?.length ?? 0;
      el.textContent = `${done}/${periodSteps}`;
      el.classList.toggle('is-done', done === periodSteps);
    });
  },

  // ── Keyboard navigation (← → between days) ──
  _setupKeyboardNav() {
    document.addEventListener('keydown', (e) => {
      const hash = window.location.hash;
      if (!hash.startsWith('#/day/')) return;
      const day = parseInt(hash.replace('#/day/', ''));
      if (isNaN(day)) return;
      if (e.key === 'ArrowRight' && day < 30) { e.preventDefault(); Router.navigate(`/day/${day + 1}`); }
      if (e.key === 'ArrowLeft'  && day > 1)  { e.preventDefault(); Router.navigate(`/day/${day - 1}`); }
    });
  },

  // ── Swipe navigation ─────────────────────────
  _setupSwipeNav() {
    let startX = 0;
    document.addEventListener('touchstart', (e) => { startX = e.changedTouches[0].screenX; }, { passive: true });
    document.addEventListener('touchend', (e) => {
      const hash = window.location.hash;
      if (!hash.startsWith('#/day/')) return;
      const day  = parseInt(hash.replace('#/day/', ''));
      const diff = e.changedTouches[0].screenX - startX;
      if (Math.abs(diff) < 60) return; // ignore small swipes
      if (diff < 0 && day < 30) Router.navigate(`/day/${day + 1}`); // swipe left → next
      if (diff > 0 && day > 1)  Router.navigate(`/day/${day - 1}`); // swipe right → prev
    }, { passive: true });
  },

  // ── Day completion callback ──────────────────
  _onDayComplete(dayNumber) {
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

function _cap(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : str;
}

// Toast notification
function _showToast(message, type) {
  type = type || 'success';
  var toast = document.getElementById('goodie-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'goodie-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = 'toast toast--' + type + ' is-visible';
  clearTimeout(toast._t);
  toast._t = setTimeout(function() { toast.classList.remove('is-visible'); }, 3500);
}

// Confetti burst
function _launchConfetti() {
  var colors = ['#8B6F47', '#D4AF37', '#6B8E6F', '#FAF8F5', '#C47A2B', '#ffffff'];
  for (var i = 0; i < 60; i++) {
    (function(i) {
      var p = document.createElement('div');
      p.className = 'confetti-particle';
      var size = 4 + Math.random() * 8;
      p.style.cssText = [
        'left:' + (Math.random() * 100) + '%',
        'background:' + colors[Math.floor(Math.random() * colors.length)],
        'width:' + size + 'px',
        'height:' + size + 'px',
        'animation-delay:' + (Math.random() * 400) + 'ms',
        'animation-duration:' + (700 + Math.random() * 900) + 'ms',
        'border-radius:' + (Math.random() > 0.5 ? '50%' : '2px')
      ].join(';');
      document.body.appendChild(p);
      p.addEventListener('animationend', function() { p.remove(); });
    }(i));
  }
}

// Compress image to base64 JPEG, max 400px on longest side
function _compressImage(file, callback) {
  var reader = new FileReader();
  reader.onload = function(e) {
    var img = new Image();
    img.onload = function() {
      var MAX = 400;
      var w = img.width, h = img.height;
      if (w > h) { if (w > MAX) { h = Math.round(h * MAX / w); w = MAX; } }
      else        { if (h > MAX) { w = Math.round(w * MAX / h); h = MAX; } }
      var canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      callback(canvas.toDataURL('image/jpeg', 0.65));
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}


// ─────────────────────────────────────────────
// BOOT
// ─────────────────────────────────────────────
// This script sits at the bottom of <body> with no defer/async, so by the
// time the browser executes it the entire DOM is already built. No
// DOMContentLoaded listener is needed — just run immediately.
(function boot() {
  var main = document.getElementById('main');

  function showError(msg) {
    if (main) main.innerHTML = '<div style="padding:2rem;font-family:sans-serif"><strong style="color:red">Boot error:</strong><pre style="white-space:pre-wrap;font-size:13px;margin-top:8px">' + msg + '</pre></div>';
    console.error('[Goodie] Boot error:', msg);
  }

  if (!content) {
    showError('window.GoodieContent is not set — content.js may have failed to load or ran out of order.');
    return;
  }

  try {
    GoodieApp.init();
  } catch (e) {
    showError(e.stack || e.message || String(e));
    return;
  }

  if (window.lucide) window.lucide.createIcons();
}());

}()); // end app IIFE
