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
  },

  // Current consecutive streak (ending at the highest completed day)
  calculateStreak() {
    const days = [...this.getState().completedDays].sort((a, b) => a - b);
    if (!days.length) return 0;
    let streak = 1;
    for (let i = days.length - 1; i > 0; i--) {
      if (days[i] === days[i - 1] + 1) { streak++; } else { break; }
    }
    return streak;
  },

  // {done, total} for a given week number
  getWeekProgress(weekNum) {
    const week = content.weeks.find(w => w.week === weekNum);
    if (!week) return { done: 0, total: 0 };
    const done = week.days.filter(d => this.isDayComplete(d)).length;
    return { done, total: week.days.length };
  },

  // Count saved progress photos
  getPhotoCount() {
    return [1, 10, 20, 30].filter(d => Storage.get('photo_day' + d)).length;
  },

  // Morning vs night completion rates across completed days
  getRoutineConsistency() {
    const state      = this.getState();
    const completed  = state.completedDays;
    if (!completed.length) return { morningRate: 0, nightRate: 0, morningDone: 0, nightDone: 0, total: 0 };
    let morningDone = 0, nightDone = 0;
    completed.forEach(dayNum => {
      const checks  = state.routineChecks?.[dayNum] || { morning: [], night: [] };
      const dayData = content.days.find(d => d.day === dayNum);
      if (!dayData) return;
      if ((checks.morning?.length ?? 0) >= dayData.morning.length) morningDone++;
      if ((checks.night?.length   ?? 0) >= dayData.night.length)   nightDone++;
    });
    return {
      morningRate: Math.round((morningDone / completed.length) * 100),
      nightRate:   Math.round((nightDone   / completed.length) * 100),
      morningDone, nightDone, total: completed.length
    };
  },

  // Array of achievement objects with unlocked status
  checkAchievements() {
    const state      = this.getState();
    const completed  = state.completedDays;
    const streak     = this.calculateStreak();
    const photoCount = this.getPhotoCount();
    return [
      { id: 'first-step',   name: 'First Step',       icon: 'play-circle', desc: 'Complete Day 1',                 unlocked: completed.includes(1) },
      { id: 'week-warrior', name: 'Week Warrior',      icon: 'award',       desc: 'Finish all 7 days of Week 1',    unlocked: [1,2,3,4,5,6,7].every(d => completed.includes(d)) },
      { id: 'consistency',  name: 'Consistency Queen', icon: 'flame',       desc: 'Achieve a 7-day streak',         unlocked: streak >= 7 },
      { id: 'halfway',      name: 'Halfway Hero',      icon: 'star',        desc: 'Complete 15 days',               unlocked: completed.length >= 15 },
      { id: 'photo-pro',    name: 'Photo Pro',         icon: 'camera',      desc: 'Upload all 4 progress photos',   unlocked: photoCount >= 4 },
      { id: 'glow-master',  name: 'Glow Master',       icon: 'sparkles',    desc: 'Complete all 30 days',           unlocked: completed.length >= 30 }
    ];
  },

  // Contextual motivational message
  getMotivationalMessage() {
    const n = this.getCompletedCount();
    if (n === 0)       return "Welcome! Your 30-day glow journey starts now. Day 1 is ready for you.";
    if (n < 7)         return `${n} day${n > 1 ? 's' : ''} in — you're building something real. Keep going!`;
    if (n === 7)       return "One full week! Your skin is already learning to love the care you're giving it. 💖";
    if (n < 14)        return "Week 2 is your breakthrough zone. The habit is forming — feel the momentum!";
    if (n === 14)      return "Two weeks done! You're exactly halfway. Your skin is visibly changing.";
    if (n < 21)        return "More than halfway! The glow is real now — people around you will start to notice. ✨";
    if (n === 21)      return "21 days — science says the habit is yours for life. The last stretch starts now! 💪🏾";
    if (n < 30)        return `Just ${30 - n} day${30 - n > 1 ? 's' : ''} left. Finish as strong as you started!`;
    return "30 DAYS COMPLETE! You did it. Look at your before and after — the glow is REAL. 🎊";
  }
};


// ─────────────────────────────────────────────
// ILLUSTRATION HELPER
// ─────────────────────────────────────────────
function _getStepIllustration(stepSlug) {
  const illu = window.GoodieIllustrations;
  if (!illu) return '';
  return illu[stepSlug] || illu['default'] || '';
}


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
    trackEvent('navigation', 'page_view', hash);
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

      const weekIllu = window.GoodieIllustrations?.week?.[week.week] || '';
      return `
        <article class="week-card animate-slide-up" style="animation-delay:${(week.week - 1) * 80}ms">
          ${weekIllu ? `<div class="week-card__illustration" aria-hidden="true">${weekIllu}</div>` : ''}
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
              A complete, step-by-step skincare programme built specifically for African skin. Simple routines. Real results. Lasting habits.
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
              href="https://instagram.com/Its_g.o.o.d.i.e"
              class="btn btn--secondary"
              style="color:white;border-color:rgba(255,255,255,0.5)"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg data-lucide="instagram" aria-hidden="true"></svg>
              @Its_g.o.o.d.i.e
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
      const done     = checks[period]?.includes(step.step) ?? false;
      const id       = `chk-${dayNumber}-${period}-${step.step}`;
      const illuSvg  = _getStepIllustration(step.step);
      return `
        <li class="routine-checklist__item">
          ${illuSvg ? `<div class="step-visual" aria-hidden="true">${illuSvg}</div>` : ''}
          <div class="step-body">
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
          </div>
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

              <button
                type="button"
                class="btn btn--ghost btn--full"
                onclick="GoodieApp.exportDay(${dayNumber})"
                aria-label="Print Day ${dayNumber} routine as PDF"
              >
                <svg data-lucide="printer" aria-hidden="true"></svg>
                Print This Day
              </button>

            </aside>
          </div>
        </div>
      </div>

      ${completeBar}
    `);
  },

  // ── PROGRESS DASHBOARD ────────────────────────
  renderProgress() {
    const completed   = Progress.getCompletedCount();
    const pct         = Progress.getCompletionPercentage();
    const currentDay  = Progress.getCurrentDay();
    const streak      = Progress.calculateStreak();
    const photoCount  = Progress.getPhotoCount();
    const achievements = Progress.checkAchievements();
    const consistency = Progress.getRoutineConsistency();
    const message     = Progress.getMotivationalMessage();
    const startDate   = Progress.getState().startDate;

    // ── Ring maths (r=82, circumference≈515) ──
    const CIRC  = 515.22;
    const offset = CIRC - (CIRC * pct / 100);

    // ── Week progress bars ─────────────────────
    const weekBarColors = ['var(--color-primary)', 'var(--color-secondary)', 'var(--color-accent)', 'var(--color-primary-light)'];
    const weekBars = content.weeks.map((w, i) => {
      const wp  = Progress.getWeekProgress(w.week);
      const wpct = wp.total ? Math.round((wp.done / wp.total) * 100) : 0;
      return `
        <div class="week-bar animate-slide-up" style="animation-delay:${i * 80}ms">
          <div class="week-bar__top">
            <span class="week-bar__label">
              <span class="week-bar__dot" style="background:${weekBarColors[i]}"></span>
              Week ${w.week} — ${w.title}
            </span>
            <span class="week-bar__meta">${wp.done}/${wp.total} days · ${wpct}%</span>
          </div>
          <div class="week-bar__track" role="progressbar" aria-valuenow="${wp.done}" aria-valuemax="${wp.total}">
            <div class="week-bar__fill" style="width:${wpct}%;background:${weekBarColors[i]}"></div>
          </div>
        </div>`;
    }).join('');

    // ── 30-day calendar ────────────────────────
    const calWeeks = content.weeks.map(w => {
      const tiles = w.days.map(dayNum => {
        const day     = content.days.find(d => d.day === dayNum);
        const done    = Progress.isDayComplete(dayNum);
        const current = dayNum === currentDay;
        const locked  = Progress.isDayLocked(dayNum);
        const hasPhoto = [1,10,20,30].includes(dayNum) && Storage.get('photo_day' + dayNum);

        const cls   = done ? 'cal-tile--done' : current ? 'cal-tile--current' : locked ? 'cal-tile--locked' : 'cal-tile--available';
        const icon  = done ? 'check' : current ? 'star' : locked ? 'lock' : 'circle';
        const label = `Day ${dayNum}: ${day ? day.title : ''}${done ? ' — done' : current ? ' — today' : locked ? ' — locked' : ''}`;
        const tag   = done || current ? 'a' : 'div';
        const href  = (done || current) ? ` href="#/day/${dayNum}"` : '';

        return `
          <${tag}${href} class="cal-tile ${cls}" title="${label}" aria-label="${label}">
            <span class="cal-tile__num">${dayNum}</span>
            <svg data-lucide="${icon}" class="cal-tile__icon" aria-hidden="true"></svg>
            ${hasPhoto ? '<span class="cal-tile__photo" aria-label="photo uploaded">📷</span>' : ''}
          </${tag}>`;
      }).join('');

      return `
        <div class="cal-week-group">
          <p class="cal-week-label">
            <span class="cal-week-label__dot" style="background:${weekBarColors[w.week - 1]}"></span>
            Week ${w.week} — ${w.phase}
          </p>
          <div class="cal-row">${tiles}</div>
        </div>`;
    }).join('');

    // ── Photo journey ──────────────────────────
    const photoSlots = [
      { day: 1,  label: 'Before',   sublabel: 'Day 1' },
      { day: 10, label: 'Week 2',   sublabel: 'Day 10' },
      { day: 20, label: 'Week 3',   sublabel: 'Day 20' },
      { day: 30, label: 'After',    sublabel: 'Day 30' }
    ].map(slot => {
      const photo   = Storage.get('photo_day' + slot.day);
      const canAdd  = !Progress.isDayLocked(slot.day);
      return `
        <div class="photo-slot${photo ? '' : ' photo-slot--empty'}">
          <p class="photo-slot__label">${slot.label}</p>
          <p class="photo-slot__sublabel">${slot.sublabel}</p>
          ${photo
            ? `<a href="#/day/${slot.day}" class="photo-slot__link">
                 <img src="${photo}" alt="Day ${slot.day} progress photo" class="photo-slot__img">
               </a>`
            : `<a href="#/day/${slot.day}" class="photo-slot__add" aria-label="Add Day ${slot.day} photo"${!canAdd ? ' tabindex="-1" aria-disabled="true"' : ''}>
                 <svg data-lucide="${canAdd ? 'camera' : 'lock'}" aria-hidden="true"></svg>
                 <span>${canAdd ? 'Add photo' : 'Locked'}</span>
               </a>`}
        </div>`;
    }).join('');

    const hasAnyPhoto = photoCount > 0;

    // ── Achievements ───────────────────────────
    const achievementCards = achievements.map((a, i) => `
      <div class="achievement-card${a.unlocked ? '' : ' achievement-card--locked'} animate-slide-up" style="animation-delay:${i * 60}ms">
        <div class="achievement-card__icon">
          <svg data-lucide="${a.icon}" aria-hidden="true"></svg>
        </div>
        <p class="achievement-card__name">${a.name}</p>
        <p class="achievement-card__desc">${a.desc}</p>
        ${a.unlocked ? '<span class="achievement-card__tick" aria-label="Unlocked">✓</span>' : '<svg data-lucide="lock" class="achievement-card__lock" aria-hidden="true"></svg>'}
      </div>`).join('');

    // ── Consistency ────────────────────────────
    const consistencySection = completed > 0 ? `
      <div class="section" style="padding:var(--space-12) 0">
        <div class="container">
          <h2 class="mb-6" style="font-size:var(--text-xl)">Routine Consistency</h2>
          <div class="grid--2" style="gap:var(--space-4)">
            <div class="card">
              <div class="cluster mb-3">
                <svg data-lucide="sun" style="color:var(--color-accent);width:20px;height:20px" aria-hidden="true"></svg>
                <strong>Morning Routine</strong>
                <span class="badge badge--accent" style="margin-left:auto">${consistency.morningRate}%</span>
              </div>
              <div class="progress"><div class="progress__fill" style="width:${consistency.morningRate}%"></div></div>
              <p style="font-size:var(--text-xs);color:var(--color-text-muted);margin-top:var(--space-2)">
                ${consistency.morningDone} of ${consistency.total} days fully completed
              </p>
            </div>
            <div class="card">
              <div class="cluster mb-3">
                <svg data-lucide="moon" style="color:var(--color-primary);width:20px;height:20px" aria-hidden="true"></svg>
                <strong>Night Routine</strong>
                <span class="badge badge--week" style="margin-left:auto">${consistency.nightRate}%</span>
              </div>
              <div class="progress"><div class="progress__fill" style="width:${consistency.nightRate}%"></div></div>
              <p style="font-size:var(--text-xs);color:var(--color-text-muted);margin-top:var(--space-2)">
                ${consistency.nightDone} of ${consistency.total} days fully completed
              </p>
            </div>
          </div>
          ${consistency.nightRate < consistency.morningRate - 10
            ? `<p class="tip-box" style="margin-top:var(--space-4)">
                 <span class="tip-box__label"><svg data-lucide="sparkles" aria-hidden="true"></svg> Tip</span>
                 Your night routine needs a little love! Try setting a 9 PM reminder — night routines are where the real repair happens. 🌙
               </p>` : ''}
        </div>
      </div>` : '';

    // ── Start date display ─────────────────────
    const startedOn = startDate
      ? new Date(startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      : null;
    const expectedDone = startDate
      ? new Date(new Date(startDate).getTime() + 30 * 24 * 60 * 60 * 1000)
          .toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      : null;

    this._render(`
      <!-- ── PAGE HEADER ── -->
      <div class="progress-page-header">
        <div class="container">
          <span class="label" style="color:rgba(255,255,255,0.6)">Your Journey</span>
          <h1 id="progress-heading" style="color:white;margin-bottom:var(--space-2)">My Progress</h1>
          <p class="motivational-message">${message}</p>
        </div>
      </div>

      <!-- ── HERO: RING + STATS ── -->
      <div class="progress-hero">
        <div class="container">
          <div class="progress-hero__layout">

            <!-- Large progress ring -->
            <div class="progress-hero__ring-wrap">
              <svg viewBox="0 0 200 200" width="200" height="200"
                   class="pring-lg" aria-label="${pct}% of 30 days complete">
                <defs>
                  <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#8B6F47"/>
                    <stop offset="100%" stop-color="#D4AF37"/>
                  </linearGradient>
                </defs>
                <circle cx="100" cy="100" r="82" fill="none"
                        stroke="var(--color-bg-muted)" stroke-width="12"/>
                <circle cx="100" cy="100" r="82" fill="none"
                        stroke="url(#ring-grad)" stroke-width="12"
                        stroke-linecap="round"
                        stroke-dasharray="${CIRC}"
                        stroke-dashoffset="${CIRC}"
                        transform="rotate(-90 100 100)"
                        class="pring-lg__fill"
                        data-target="${offset}"/>
                <text x="100" y="86"  text-anchor="middle" class="pring-lg__pct"  dominant-baseline="middle">${pct}%</text>
                <text x="100" y="112" text-anchor="middle" class="pring-lg__days" dominant-baseline="middle">${completed}/30</text>
                <text x="100" y="130" text-anchor="middle" class="pring-lg__sub"  dominant-baseline="middle">days</text>
              </svg>
              ${streak > 1 ? `
              <div class="streak-badge">
                <svg data-lucide="flame" aria-hidden="true"></svg>
                ${streak}-day streak!
              </div>` : ''}
            </div>

            <!-- Stat cards -->
            <div class="stats-grid">
              <div class="stat-card animate-slide-up">
                <div class="stat-card__icon" style="background:rgba(74,124,89,0.1)">
                  <svg data-lucide="check-circle" style="color:var(--color-success)" aria-hidden="true"></svg>
                </div>
                <div>
                  <p class="stat-card__value" data-count-to="${completed}">${completed}</p>
                  <p class="stat-card__label">Days Complete</p>
                </div>
              </div>
              <div class="stat-card animate-slide-up" style="animation-delay:80ms">
                <div class="stat-card__icon" style="background:rgba(212,175,55,0.12)">
                  <svg data-lucide="flame" style="color:var(--color-accent-dark)" aria-hidden="true"></svg>
                </div>
                <div>
                  <p class="stat-card__value" data-count-to="${streak}">${streak}</p>
                  <p class="stat-card__label">Day Streak</p>
                </div>
              </div>
              <div class="stat-card animate-slide-up" style="animation-delay:160ms">
                <div class="stat-card__icon" style="background:rgba(139,111,71,0.08)">
                  <svg data-lucide="camera" style="color:var(--color-primary)" aria-hidden="true"></svg>
                </div>
                <div>
                  <p class="stat-card__value" data-count-to="${photoCount}">${photoCount}</p>
                  <p class="stat-card__label">Photos Taken</p>
                </div>
              </div>
            </div>

          </div>

          <!-- Quick actions -->
          <div class="cluster mt-6" style="flex-wrap:wrap;gap:var(--space-3)">
            <a href="#/day/${currentDay}" class="btn btn--primary">
              <svg data-lucide="sun" aria-hidden="true"></svg>
              Continue — Day ${currentDay}
            </a>
            <a href="https://wa.me/2348063214942?text=Hi%20Goodie!%20I've%20completed%20${completed}%20days%20of%20the%20Glow%20Guide!"
               class="btn btn--whatsapp" target="_blank" rel="noopener noreferrer">
              <svg data-lucide="message-circle" aria-hidden="true"></svg>
              Share with Goodie
            </a>
            <button class="btn btn--secondary" onclick="GoodieApp.exportProgress()" type="button">
              <svg data-lucide="download" aria-hidden="true"></svg>
              Download Progress Report
            </button>
          </div>

          ${startedOn ? `
          <p style="font-size:var(--text-xs);color:var(--color-text-muted);margin-top:var(--space-4)">
            Started ${startedOn} · Expected completion ${expectedDone}
          </p>` : ''}
        </div>
      </div>

      <!-- ── WEEK PROGRESS ── -->
      <div class="section" style="background:var(--color-bg-muted);padding:var(--space-12) 0">
        <div class="container">
          <h2 style="font-size:var(--text-xl);margin-bottom:var(--space-6)">Weekly Progress</h2>
          <div class="week-bars">${weekBars}</div>
        </div>
      </div>

      <!-- ── 30-DAY CALENDAR ── -->
      <div class="section" style="padding:var(--space-12) 0">
        <div class="container">
          <h2 style="font-size:var(--text-xl);margin-bottom:var(--space-2)">Your 30-Day Journey</h2>
          <p style="font-size:var(--text-sm);color:var(--color-text-muted);margin-bottom:var(--space-6)">
            Tap any completed day to revisit its routine
          </p>
          <div class="cal-calendar" aria-label="30-day progress calendar">
            ${calWeeks}
          </div>
        </div>
      </div>

      <!-- ── PHOTO JOURNEY ── -->
      <div class="section" style="background:var(--color-bg-muted);padding:var(--space-12) 0">
        <div class="container">
          <h2 style="font-size:var(--text-xl);margin-bottom:var(--space-2)">Photo Journey</h2>
          <p style="font-size:var(--text-sm);color:var(--color-text-muted);margin-bottom:var(--space-6)">
            ${hasAnyPhoto ? 'Your transformation documented at key milestones.' : 'Upload your before photo on Day 1 to track your amazing transformation!'}
          </p>
          <div class="photo-journey">${photoSlots}</div>
        </div>
      </div>

      <!-- ── CONSISTENCY ── -->
      ${consistencySection}

      <!-- ── ACHIEVEMENTS ── -->
      <div class="section" style="padding:var(--space-12) 0">
        <div class="container">
          <h2 style="font-size:var(--text-xl);margin-bottom:var(--space-2)">Achievements</h2>
          <p style="font-size:var(--text-sm);color:var(--color-text-muted);margin-bottom:var(--space-6)">
            ${achievements.filter(a => a.unlocked).length} of ${achievements.length} unlocked
          </p>
          <div class="achievement-grid">${achievementCards}</div>
        </div>
      </div>

      <!-- ── EMPTY STATE (no days) ── -->
      ${completed === 0 ? `
      <div class="container" style="text-align:center;padding-bottom:var(--space-12)">
        <p style="color:var(--color-text-muted);font-size:var(--text-sm)">
          Your stats will fill in as you complete your daily routines.
        </p>
        <a href="#/day/1" class="btn btn--primary mt-4">
          <svg data-lucide="play-circle" aria-hidden="true"></svg>
          Start Day 1 Now
        </a>
      </div>` : ''}
    `);
  },

  // ── PRODUCTS PAGE ──────────────────────────
  renderProducts() {
    // Rich product definitions (keyed to match content.products ids)
    const RICH = {
      facewash: {
        category: 'Cleanser', color: '#8B6F47', initial: 'CW',
        desc: 'A brightening gel cleanser that lifts away impurities and excess oil while Vitamin C starts evening your skin tone from Day 1.',
        howToUse: 'Wet face, apply a small coin-sized amount, massage in gentle circular motions for 60 seconds, rinse thoroughly with lukewarm water. Pat dry — never rub. Use morning and evening.',
        waitTime: 'Apply serum or next step immediately after patting dry.',
        ingredients: ['Vitamin C (Ascorbic Acid) — brightens dark spots, boosts collagen, fades hyperpigmentation', 'Aloe Vera — soothes irritation and locks in moisture after cleansing', 'Glycerin — draws water into the skin and prevents post-cleanse dryness'],
        bestFor: 'All skin types, especially oily and combination. Targets uneven tone, dark spots, and dullness.',
        pairs: 'Pairs perfectly with everything in the Goodie Glow range.',
        tips: ['Use lukewarm water only — hot water strips your moisture barrier', 'Rinse for a full 30 seconds; leftover residue clogs pores', 'Skin feels tight after? You\'re using too much — halve the amount']
      },
      ceramideFacewash: {
        category: 'Cleanser', color: '#7A6B55', initial: 'CF',
        desc: 'A gentle ceramide-rich cleanser that cleans without stripping. Perfect for sensitive or dry skin types that find the Vitamin C wash too active.',
        howToUse: 'Wet face, apply a small amount, massage gently for 60 seconds, rinse thoroughly. Pat dry. Use morning and evening.',
        waitTime: 'Apply serum or next step immediately after patting dry.',
        ingredients: ['Ceramide NP — restores and reinforces the skin barrier', 'Glycerin — draws and retains moisture', 'Panthenol (B5) — soothes irritation and supports healing'],
        bestFor: 'Dry, sensitive, or compromised skin. Anyone experiencing redness or tightness from other cleansers.',
        pairs: 'Use with any serum or moisturiser. Ideal base for sensitive skin routines.',
        tips: ['If your skin feels tight after the Vitamin C wash, switch to this', 'Great for mornings when your skin feels dry — less active, more nourishing', 'Build up to the Vitamin C wash over 1–2 weeks if you\'re very sensitive']
      },
      toner: {
        category: 'Toner', color: '#6B8E6F', initial: 'TO',
        desc: 'A hydrating, pore-refining toner that balances your skin\'s pH after cleansing and preps it to absorb moisturiser more effectively. Used every evening.',
        howToUse: 'After evening cleanse, apply a small amount to a cotton pad and swipe gently across face and neck. Or press a few drops directly into skin with clean hands. Evening use only.',
        waitTime: 'Wait 30 seconds, then moisturise.',
        ingredients: ['Niacinamide (B3) — minimises pores, regulates oil production', 'Rose Water — calms and hydrates, reduces redness', 'Hyaluronic Acid — immediately hydrates and plumps skin'],
        bestFor: 'All skin types. Essential for balancing after cleansing and maximising moisturiser absorption.',
        pairs: 'Use after cleanse, before moisturiser in your evening routine.',
        tips: ['Don\'t skip this — it restores your skin\'s pH after cleansing so moisturiser works better', 'Less cotton pad pressure = less irritation. Gentle swipes only', 'Try pressing it in with fingertips instead of a pad for a more nourishing feel']
      },
      vitaminCSerum: {
        category: 'Serum (AM)', color: '#D4AF37', initial: 'VC',
        desc: 'A potent brightening serum that fades dark spots, evens skin tone, and gives you that lit-from-within glow. Your morning weapon from Week 2 onwards.',
        howToUse: 'In the morning, after cleansing, apply 2–3 drops to face and neck. Press gently into skin — don\'t rub. Follow with moisturiser.',
        waitTime: 'Wait 30 seconds before applying moisturiser to let the serum absorb.',
        ingredients: ['Vitamin C 15% — clinical brightening at the effective concentration', 'Ferulic Acid — stabilises Vitamin C and boosts its effectiveness', 'Vitamin E — antioxidant protection, supports skin repair'],
        bestFor: 'All skin types targeting hyperpigmentation, dark spots, post-acne marks, and dullness.',
        pairs: 'Morning use only. Follow with Moisturizer as the final step.',
        tips: ['Store in a cool, dark place — Vitamin C oxidises in heat and light', 'If your serum turns orange/brown, it\'s oxidised — replace it', 'Apply to fully dry skin to minimise tingling']
      },
      niacinamideSerum: {
        category: 'Serum (AM)', color: '#527056', initial: 'NI',
        desc: 'A gentle multi-tasking serum that regulates oil, minimises pores, and starts evening your skin tone. Your Week 1 morning foundation serum.',
        howToUse: 'In the morning, after cleansing, apply 3–4 drops to face and neck. Press into skin gently. Follow with moisturiser.',
        waitTime: 'Wait 30 seconds before moisturiser.',
        ingredients: ['Niacinamide 10% — pore-minimising, oil-regulating, brightening powerhouse', 'Zinc PCA — controls sebum, reduces breakouts', 'Panthenol (B5) — deep hydration and barrier repair'],
        bestFor: 'All skin types. Especially effective for oily, acne-prone skin. Gentle enough for beginners.',
        pairs: 'Morning use. Safe with all other products in the routine.',
        tips: ['If you experience any flushing or redness, reduce to every other morning', 'The most beginner-friendly active serum — very low irritation risk', 'Can also be used as an evening serum if you want extra pore-care at night']
      },
      alphaArbutin: {
        category: 'Serum (AM)', color: '#C4A882', initial: 'AA',
        desc: 'A targeted brightening serum that fades stubborn dark spots and post-acne marks by inhibiting melanin production at the source.',
        howToUse: 'In the morning, after cleansing, apply 2–3 drops to face focusing on dark spots. Press gently into skin. Follow with moisturiser.',
        waitTime: 'Wait 30 seconds before moisturiser.',
        ingredients: ['Alpha Arbutin 2% — inhibits tyrosinase to slow melanin production', 'Hyaluronic Acid — plumps and hydrates while brightening', 'Niacinamide — synergistic brightening and pore-minimising'],
        bestFor: 'Hyperpigmentation, dark spots, post-acne marks, and uneven skin tone on all skin types.',
        pairs: 'Morning use. Safe with Vitamin C. Can alternate with Vitamin C Serum.',
        tips: ['Focus application on areas with dark spots for best results', 'Safe to use daily — very gentle despite its effectiveness', 'Results build over 4–8 weeks of consistent use']
      },
      hyaluronicAcid: {
        category: 'Serum (AM)', color: '#89B4CC', initial: 'HA',
        desc: 'A hydration powerhouse that draws water into the skin, plumps fine lines, and leaves your face looking dewy and full — all day.',
        howToUse: 'In the morning, after cleansing, apply 2–3 drops to slightly damp skin. Press gently into face and neck. Follow immediately with moisturiser to lock in the hydration.',
        waitTime: 'Apply moisturiser immediately — do not let it dry fully.',
        ingredients: ['Hyaluronic Acid (multi-weight) — penetrates at multiple skin depths for layered hydration', 'Glycerin — humectant that draws moisture from the air', 'Aloe Vera — soothes and delivers instant surface hydration'],
        bestFor: 'Dry, dehydrated skin. Anyone looking plumper, dewier skin. Works on all skin types.',
        pairs: 'Apply to damp skin for maximum effect. Always seal with moisturiser immediately after.',
        tips: ['Apply to damp skin — it draws in existing moisture, amplifying the effect', 'If you live in a dry climate, seal very quickly with moisturiser', 'Can be layered with other serums for maximum hydration']
      },
      moisturizer: {
        category: 'Moisturizer', color: '#A8896A', initial: 'MO',
        desc: 'A lightweight, non-greasy moisturizer that seals in your serum, strengthens your moisture barrier, and keeps skin soft and plump all day.',
        howToUse: 'Morning: after serum, apply a small amount to face and neck in upward strokes, then follow with sunscreen. Evening: after toner, apply generously — night is when your skin repairs.',
        waitTime: 'No waiting needed — apply sunscreen immediately after.',
        ingredients: ['Ceramides — rebuild and strengthen the skin barrier', 'Shea Butter — deeply nourishing, seals in moisture', 'Squalane — lightweight oil that mimics skin\'s natural sebum'],
        bestFor: 'All skin types. Essential for dry and dehydrated skin. Even oily skin needs moisturizer.',
        pairs: 'Always before sunscreen in the morning routine.',
        tips: ['Apply while skin is still slightly damp from serum — seals in more moisture', 'A little goes a long way — pea-sized to 5p coin is enough', 'Don\'t skip because your skin feels oily — skipping causes MORE oil production']
      },
      sunscreen: {
        category: 'SPF 50+', color: '#2E6DA4', initial: 'SP',
        desc: 'A broad-spectrum SPF 50+ that protects against UVA (ageing, dark spots) and UVB (burning) rays. The final — and most critical — morning step.',
        howToUse: 'MORNING ONLY. Apply two-finger length to face, neck, and any exposed skin as the very last step after moisturiser. Use 15 minutes before going outside. Reapply every 4 hours if you\'re in the sun.',
        waitTime: 'No waiting — this is your final morning step. Then you\'re good to go!',
        ingredients: ['Zinc Oxide / Titanium Dioxide — physical blockers that sit on skin and deflect UV', 'Niacinamide — brightens and reduces post-sun inflammation', 'Vitamin E — antioxidant that neutralises UV-generated free radicals'],
        bestFor: 'Everyone. No exceptions. Every skin type, every day — cloudy or sunny.',
        pairs: 'Always the last step in the morning — after moisturiser, never before.',
        tips: ['Two-finger length is the magic amount — less and you lose protection', 'Apply 15 minutes before stepping outside', 'Reapply every 4 hours if you\'re outdoors — one morning application isn\'t enough all day', 'SPF on cloudy days is not optional — 80% of UV rays pass through clouds']
      }
    };

    // Build product cards
    const productCards = Object.entries(RICH).map(([key, p], i) => {
      const base    = content.products[key] || {};
      const ingredients = p.ingredients.map(ing => `<li>${ing}</li>`).join('');
      const tips        = p.tips.map(t => `<li>${t}</li>`).join('');
      return `
        <article class="product-card card animate-slide-up" style="animation-delay:${i * 60}ms" aria-label="${base.name || p.initial}">
          <div class="product-card__header">
            <div class="product-card__avatar" style="background:${p.color}" aria-hidden="true">
              <span>${p.initial}</span>
            </div>
            <div class="product-card__info">
              <span class="badge product-badge--${p.category.toLowerCase().replace(/\s+/g, '-')}">${p.category}</span>
              <h3 class="product-card__name">${base.name || key}</h3>
              <p class="product-card__desc">${p.desc}</p>
            </div>
          </div>
          <div class="product-card__sections">
            <details class="product-section">
              <summary><svg data-lucide="play-circle" aria-hidden="true"></svg> How to Use <svg data-lucide="chevron-down" class="product-section__arrow" aria-hidden="true"></svg></summary>
              <div class="product-section__body">
                <p>${p.howToUse}</p>
                <p class="product-section__wait"><svg data-lucide="clock" aria-hidden="true"></svg> ${p.waitTime}</p>
              </div>
            </details>
            <details class="product-section">
              <summary><svg data-lucide="leaf" aria-hidden="true"></svg> Key Ingredients <svg data-lucide="chevron-down" class="product-section__arrow" aria-hidden="true"></svg></summary>
              <div class="product-section__body">
                <ul class="product-section__list">${ingredients}</ul>
              </div>
            </details>
            <details class="product-section">
              <summary><svg data-lucide="users" aria-hidden="true"></svg> Best For <svg data-lucide="chevron-down" class="product-section__arrow" aria-hidden="true"></svg></summary>
              <div class="product-section__body">
                <p>${p.bestFor}</p>
                <p class="product-section__pairs"><strong>Pairs with:</strong> ${p.pairs}</p>
              </div>
            </details>
            <details class="product-section">
              <summary><svg data-lucide="sparkles" aria-hidden="true"></svg> Tips &amp; Tricks <svg data-lucide="chevron-down" class="product-section__arrow" aria-hidden="true"></svg></summary>
              <div class="product-section__body">
                <ul class="product-section__list product-section__tips">${tips}</ul>
              </div>
            </details>
          </div>
        </article>`;
    }).join('');

    // Application order flow
    const amSteps = [
      { label: 'Cleanser',   color: '#8B6F47' },
      { label: 'Toner',      color: '#6B8E6F' },
      { label: 'Vit C Serum',color: '#D4AF37' },
      { label: 'Moisturiser',color: '#A8896A' },
      { label: 'SPF 50',     color: '#2E6DA4' }
    ];
    const pmSteps = [
      { label: 'Cleanser',   color: '#8B6F47' },
      { label: 'Toner',      color: '#6B8E6F' },
      { label: 'Niacinamide',color: '#527056' },
      { label: 'Eye Cream',  color: '#8B6F47' },
      { label: 'Moisturiser',color: '#A8896A' }
    ];
    const buildFlow = (steps, icon, label) => `
      <div class="routine-flow">
        <div class="routine-flow__label">
          <svg data-lucide="${icon}" aria-hidden="true"></svg> ${label}
        </div>
        <div class="routine-flow__steps" role="list">
          ${steps.map((s, i) => `
            <div class="routine-flow__step" role="listitem">
              <div class="routine-flow__bubble" style="background:${s.color}">
                <span>${i + 1}</span>
              </div>
              <p class="routine-flow__name">${s.label}</p>
            </div>
            ${i < steps.length - 1 ? '<svg data-lucide="arrow-right" class="routine-flow__arrow" aria-hidden="true"></svg>' : ''}
          `).join('')}
        </div>
      </div>`;

    // Pairing guide
    const pairings = [
      { combo: 'Vitamin C + Niacinamide',      icon: 'check-circle', type: 'good', note: 'Safe together! The old myth is debunked. Use Vit C in AM, Niacinamide in PM.' },
      { combo: 'Hyaluronic Acid + Everything', icon: 'check-circle', type: 'good', note: 'Universal hydrator — pairs with every product in the routine.' },
      { combo: 'Toner + Any Serum',            icon: 'check-circle', type: 'good', note: 'Toner first, always. It primes skin to absorb serums better.' },
      { combo: 'SPF + Makeup',                 icon: 'check-circle', type: 'good', note: 'Apply SPF as a base before foundation. Wait 2 minutes before makeup.' },
      { combo: 'Multiple acids at once',        icon: 'alert-triangle', type: 'warn', note: 'Don\'t combine this routine with other acid products (AHA/BHA/retinol) — it will cause irritation.' },
      { combo: 'Random product mixing',         icon: 'alert-triangle', type: 'warn', note: 'Stick to Goodie products for 30 days. Adding unknowns makes it impossible to track what\'s working.' }
    ];
    const pairingCards = pairings.map(p => `
      <div class="pairing-item pairing-item--${p.type}">
        <svg data-lucide="${p.icon}" aria-hidden="true"></svg>
        <div>
          <strong>${p.combo}</strong>
          <p>${p.note}</p>
        </div>
      </div>`).join('');

    this._render(`
      <!-- ── PAGE HEADER ── -->
      <div class="page-header">
        <div class="container">
          <span class="label" style="color:rgba(255,255,255,0.6)">Your Skincare Arsenal</span>
          <h1 style="color:white;margin-bottom:var(--space-2)">Your Product Guide</h1>
          <p style="color:rgba(255,255,255,0.85);max-width:520px;margin:0">
            Everything you need to know about every Goodie product in your kit — ingredients, techniques, and pro tips.
          </p>
        </div>
      </div>

      <!-- ── APPLICATION ORDER ── -->
      <div style="background:var(--color-bg-card);border-bottom:1px solid var(--color-border);padding:var(--space-8) 0">
        <div class="container">
          <h2 style="font-size:var(--text-lg);margin-bottom:var(--space-6)">
            <svg data-lucide="layers" style="display:inline;vertical-align:middle;width:20px;height:20px;margin-right:6px;color:var(--color-primary)" aria-hidden="true"></svg>
            Order of Application
          </h2>
          <p style="font-size:var(--text-xs);color:var(--color-text-muted);margin-bottom:var(--space-5)">Thinnest → thickest consistency. Each product preps the next.</p>
          <div class="stack" style="--stack-gap:var(--space-5)">
            ${buildFlow(amSteps, 'sun', 'Morning Routine')}
            ${buildFlow(pmSteps, 'moon', 'Evening Routine')}
          </div>
        </div>
      </div>

      <!-- ── PRODUCT CARDS ── -->
      <div class="section" style="padding:var(--space-10) 0">
        <div class="container">
          <h2 style="font-size:var(--text-xl);margin-bottom:var(--space-6)">The Full Product Range</h2>
          <div class="products-grid">
            ${productCards}
          </div>
        </div>
      </div>

      <!-- ── PAIRING GUIDE ── -->
      <div style="background:var(--color-bg-muted);padding:var(--space-10) 0">
        <div class="container">
          <h2 style="font-size:var(--text-xl);margin-bottom:var(--space-2)">
            <svg data-lucide="git-merge" style="display:inline;vertical-align:middle;width:20px;height:20px;margin-right:6px;color:var(--color-primary)" aria-hidden="true"></svg>
            Product Pairing Guide
          </h2>
          <p style="font-size:var(--text-sm);color:var(--color-text-muted);margin-bottom:var(--space-6)">What works well together — and what to avoid.</p>
          <div class="pairing-grid">${pairingCards}</div>
        </div>
      </div>

      <!-- ── ORDER CTA ── -->
      <div class="contact-strip">
        <div class="container">
          <h2>Need to Order or Restock?</h2>
          <p>Message us directly — we deliver across Africa.</p>
          <div class="cluster" style="justify-content:center">
            <a href="https://wa.me/2348063214942?text=Hi%20Goodie!%20I%20want%20to%20order%20the%20Glow%20Guide%20products." class="btn btn--whatsapp" target="_blank" rel="noopener noreferrer">
              <svg data-lucide="message-circle" aria-hidden="true"></svg>
              Order via WhatsApp
            </a>
            <a href="https://instagram.com/Its_g.o.o.d.i.e" class="btn btn--secondary" style="color:white;border-color:rgba(255,255,255,0.4)" target="_blank" rel="noopener noreferrer">
              <svg data-lucide="heart" aria-hidden="true"></svg>
              @Its_g.o.o.d.i.e
            </a>
          </div>
        </div>
      </div>
    `);
  },

  // ── HELP PAGE ──────────────────────────────
  renderHelp() {
    const FAQ_CATEGORIES = [
      {
        id: 'getting-started',
        title: 'Getting Started',
        icon: 'play-circle',
        items: [
          { q: 'I just received my products. Where do I start?', a: 'Go to Day 1 and take your before photos first — lighting, no filter, three angles. Then follow the Day 1 morning routine. Everything in the guide is ordered for you; just follow the daily prompts.' },
          { q: 'Do I need all the products before I start?', a: 'No. The absolute minimum to start is cleanser and moisturiser. Add other products as you get them. The guide will prompt you when each new product is introduced.' },
          { q: 'Can I skip days or do them out of order?', a: 'You can skip days — life happens! Just pick up from the next day rather than restarting. The guide is cumulative, not a strict countdown. What matters is consistency over perfection.' },
          { q: 'What if I\'ve never had a skincare routine before?', a: 'Perfect timing. The routine is already 3 steps — cleanse, serum, moisturise. If even that feels like too much on Day 1, do just cleanser + moisturiser. Build from there. Your skin will adapt within 7–10 days.' }
        ]
      },
      {
        id: 'product-questions',
        title: 'Product Questions',
        icon: 'package',
        items: [
          { q: 'My skin feels tight after cleansing. What\'s wrong?', a: 'Three possible causes: using too much product, rinsing with hot water, or leaving product on too long. Use a 50p coin-sized amount, lukewarm water only, and apply moisturiser while skin is still slightly damp.' },
          { q: 'My products are pilling (rolling off my face). Why?', a: 'You\'re applying the next step too quickly or using too much product. Wait 30–60 seconds between layers, use less product, and pat — don\'t rub. Start with the thinnest consistency first.' },
          { q: 'Can I use these products if I\'m pregnant or breastfeeding?', a: 'Our formulas are gentle and avoid high-risk ingredients. That said, always consult your doctor or dermatologist before starting any new skincare routine during pregnancy.' },
          { q: 'I ran out of one product. Can I substitute it?', a: 'For cleanser and moisturiser, a plain gentle alternative is fine temporarily. For serums, skip that step rather than substituting — using the wrong concentration of actives can cause irritation. Contact us to restock quickly.' }
        ]
      },
      {
        id: 'skin-reactions',
        title: 'Skin Reactions',
        icon: 'alert-circle',
        items: [
          { q: 'I\'m breaking out more than before — should I stop?', a: 'Week 2–3 purging is completely normal and is actually a sign the products are working. Your skin is clearing out what was hiding underneath. Unless breakouts are painful or spreading to the neck/chest, keep going. If concerned, WhatsApp us a photo.' },
          { q: 'My skin looks red and irritated. What do I do?', a: 'Stop all actives (serums) immediately. Use only cleanser and moisturiser for 3–5 days until your skin calms down. Then reintroduce one product at a time. If redness is severe or spreading, contact us right away: 08063214942.' },
          { q: 'I\'m not seeing results after 2 weeks. Is it working?', a: 'Yes — but skin cell turnover takes 28 days. The real transformation shows from Day 15 onwards. Week 1–2 is your skin adjusting. Week 3–4 is when people start noticing a difference. Trust the process and take your progress photos.' },
          { q: 'The Vitamin C serum stings slightly. Is that normal?', a: 'A mild tingle is normal for Vitamin C — it means it\'s working. A burning or lasting sting is not normal. If it burns: rinse immediately, check that your skin is fully dry before applying (apply to slightly damp skin can amplify actives), and try every other day to build tolerance.' }
        ]
      },
      {
        id: 'routine-questions',
        title: 'Routine Questions',
        icon: 'calendar',
        items: [
          { q: 'I forgot to do my routine yesterday. Am I starting over?', a: 'Never restart. One missed day means zero lost progress. Your skin has already absorbed and benefited from every previous day. Just continue from today and keep going.' },
          { q: 'Can I wear makeup while doing the programme?', a: 'Absolutely. Apply makeup after your moisturiser in the morning. The key is thorough cleansing at night — double cleansing (micellar water first, then face wash) is ideal if you wear heavy makeup.' },
          { q: 'What if I\'m travelling during the 30 days?', a: 'Pack your essentials in travel-size bottles: cleanser, moisturiser, SPF are non-negotiable. The serums are your "nice to have." A simplified routine on travel days is better than skipping entirely.' },
          { q: 'Can I do the morning and night routine at the same time?', a: 'You can combine them in an emergency, but it\'s not ideal — morning and night serve different purposes. If you miss morning, just do the night routine and pick up normally tomorrow.' }
        ]
      },
      {
        id: 'technical',
        title: 'App & Technical',
        icon: 'settings',
        items: [
          { q: 'My progress disappeared or won\'t save.', a: 'This is a browser storage issue. Check that cookies and local storage are enabled in your browser settings. Try opening the app in a fresh browser tab or a different browser (Chrome or Safari work best).' },
          { q: 'My progress photos won\'t upload.', a: 'Photos should be under 2MB for best results. Try taking a fresh photo with your phone camera instead of uploading from your gallery. If it still fails, try a different browser.' },
          { q: 'The app isn\'t loading on my phone.', a: 'Works best on Chrome (Android) or Safari (iOS). Make sure your browser is up to date. Try clearing your browser cache or opening in a new tab.' }
        ]
      }
    ];

    const faqItems = FAQ_CATEGORIES.map(cat => {
      const items = cat.items.map((faq, j) => {
        const searchData = (faq.q + ' ' + faq.a).toLowerCase().replace(/'/g, '');
        return `
          <details class="faq-item" data-search="${searchData}">
            <summary class="faq-item__summary">
              <span class="faq-item__q">${faq.q}</span>
              <svg data-lucide="chevron-down" class="faq-item__arrow" aria-hidden="true"></svg>
            </summary>
            <div class="faq-item__answer">${faq.a}</div>
          </details>`;
      }).join('');
      return `
        <div class="faq-category" data-cat="${cat.id}">
          <h3 class="faq-category__title">
            <svg data-lucide="${cat.icon}" aria-hidden="true"></svg>
            ${cat.title}
          </h3>
          <div class="faq-list">${items}</div>
        </div>`;
    }).join('');

    this._render(`
      <!-- ── PAGE HEADER ── -->
      <div class="page-header">
        <div class="container">
          <span class="label" style="color:rgba(255,255,255,0.6)">Support</span>
          <h1 style="color:white;margin-bottom:var(--space-2)">We're Here to Help</h1>
          <p style="color:rgba(255,255,255,0.85);max-width:520px;margin:0">
            Answers to the most common questions. Still stuck? We respond to every WhatsApp message within 4 hours.
          </p>
        </div>
      </div>

      <!-- ── QUICK CONTACT ── -->
      <div class="quick-contact">
        <div class="container">
          <div class="quick-contact__inner">
            <div class="quick-contact__text">
              <p class="quick-contact__title">Talk to Goodie Directly</p>
              <p class="quick-contact__sub">Response time: usually within 4 hours</p>
            </div>
            <div class="cluster" style="gap:var(--space-2)">
              <a href="https://wa.me/2348063214942?text=Hi%20Goodie!%20I%20need%20help%20with%20the%20Glow%20Guide." class="btn btn--whatsapp btn--sm" target="_blank" rel="noopener noreferrer">
                <svg data-lucide="message-circle" aria-hidden="true"></svg>
                08063214942
              </a>
              <a href="https://instagram.com/Its_g.o.o.d.i.e" class="btn btn--secondary btn--sm" target="_blank" rel="noopener noreferrer">
                @Its_g.o.o.d.i.e
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- ── SEARCH ── -->
      <div class="section" style="padding:var(--space-10) 0">
        <div class="container">
          <div class="faq-search" role="search">
            <svg data-lucide="search" aria-hidden="true"></svg>
            <input
              type="search"
              id="faq-search"
              class="faq-search__input"
              placeholder="Search for help… e.g. 'breakout', 'tight skin', 'skip day'"
              aria-label="Search frequently asked questions"
              autocomplete="off"
            >
          </div>

          <!-- FAQ accordion -->
          <div id="faq-container" class="faq-container" aria-live="polite">
            ${faqItems}
          </div>

          <!-- No results message (hidden by default) -->
          <div id="faq-empty" class="faq-empty" hidden>
            <svg data-lucide="search-x" aria-hidden="true"></svg>
            <p>No results found. Try different keywords or <a href="https://wa.me/2348063214942" target="_blank" rel="noopener noreferrer">ask us directly on WhatsApp</a>.</p>
          </div>
        </div>
      </div>

      <!-- ── DECISION TREE ── -->
      <div style="background:var(--color-bg-muted);padding:var(--space-10) 0">
        <div class="container">
          <h2 style="font-size:var(--text-xl);margin-bottom:var(--space-6)">Quick Problem Solver</h2>
          <div class="decision-grid">
            <div class="decision-card">
              <div class="decision-card__icon" style="background:rgba(192,57,43,0.1)">
                <svg data-lucide="alert-octagon" style="color:#C0392B" aria-hidden="true"></svg>
              </div>
              <h4>Painful reaction or swelling?</h4>
              <p>Stop everything immediately. Rinse with cool water. Call us: 08063214942</p>
              <a href="https://wa.me/2348063214942?text=Hi%20Goodie!%20I'm%20having%20a%20reaction%20to%20my%20products%20and%20need%20urgent%20help." class="btn btn--sm" style="background:#C0392B;color:white;border-color:#C0392B" target="_blank" rel="noopener noreferrer">
                Contact Now
              </a>
            </div>
            <div class="decision-card">
              <div class="decision-card__icon" style="background:rgba(212,175,55,0.1)">
                <svg data-lucide="zap" style="color:var(--color-accent-dark)" aria-hidden="true"></svg>
              </div>
              <h4>Mild breakout in Week 1–3?</h4>
              <p>This is normal purging. Keep going gently, don't pick, and drink more water.</p>
              <a href="#/help" class="btn btn--secondary btn--sm">Read the FAQ above</a>
            </div>
            <div class="decision-card">
              <div class="decision-card__icon" style="background:rgba(74,124,89,0.1)">
                <svg data-lucide="clock" style="color:var(--color-success)" aria-hidden="true"></svg>
              </div>
              <h4>No visible results yet?</h4>
              <p>Skin takes 28 days to turn over. Real change shows at Day 15–20. Check your Day 1 photo.</p>
              <a href="#/progress" class="btn btn--secondary btn--sm">View My Progress</a>
            </div>
            <div class="decision-card">
              <div class="decision-card__icon" style="background:rgba(139,111,71,0.1)">
                <svg data-lucide="package" style="color:var(--color-primary)" aria-hidden="true"></svg>
              </div>
              <h4>Product or application question?</h4>
              <p>Check the full product guide — every product has a "How to Use" and "Tips" section.</p>
              <a href="#/products" class="btn btn--secondary btn--sm">Go to Products</a>
            </div>
          </div>
        </div>
      </div>

      <!-- ── CONTACT FORM / WHATSAPP ── -->
      <div class="section" style="padding:var(--space-10) 0">
        <div class="container" style="max-width:640px">
          <h2 style="font-size:var(--text-xl);margin-bottom:var(--space-2)">Send Us a Message</h2>
          <p style="font-size:var(--text-sm);color:var(--color-text-muted);margin-bottom:var(--space-6)">
            Fill this in and we'll open WhatsApp with your message pre-written. Quick and easy.
          </p>
          <form class="contact-form" id="help-contact-form" novalidate>
            <div class="form-group">
              <label class="form-label" for="cf-name">Your name</label>
              <input type="text" id="cf-name" class="form-input" placeholder="e.g. Amara" autocomplete="given-name">
            </div>
            <div class="form-group">
              <label class="form-label" for="cf-topic">Topic</label>
              <select id="cf-topic" class="form-select">
                <option value="general">General question</option>
                <option value="reaction">Skin reaction</option>
                <option value="product">Product question</option>
                <option value="results">Not seeing results</option>
                <option value="order">Order / restock</option>
                <option value="technical">App issue</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="cf-message">Your message</label>
              <textarea id="cf-message" class="form-textarea" rows="4"
                placeholder="Describe what's happening and which day you're on…"></textarea>
            </div>
            <button type="submit" class="btn btn--whatsapp btn--full" id="cf-submit">
              <svg data-lucide="message-circle" aria-hidden="true"></svg>
              Open WhatsApp with This Message
            </button>
          </form>
        </div>
      </div>

      <!-- ── COMMUNITY ── -->
      <div class="contact-strip">
        <div class="container">
          <h2>Join the Goodie Community</h2>
          <p>Share your progress, get tips, and celebrate with other Goodie Babes doing the 30-day journey. Tag us — we repost transformations!</p>
          <div class="cluster" style="justify-content:center;flex-wrap:wrap">
            <a href="https://instagram.com/Its_g.o.o.d.i.e" class="btn btn--secondary" style="color:white;border-color:rgba(255,255,255,0.4)" target="_blank" rel="noopener noreferrer">
              <svg data-lucide="heart" aria-hidden="true"></svg>
              Follow @Its_g.o.o.d.i.e
            </a>
            <span class="btn btn--ghost" style="color:rgba(255,255,255,0.7);cursor:default">
              #GoodieGlowUp
            </span>
          </div>
        </div>
      </div>
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
    this._setupKeyboardShortcuts();
    this._setupOfflineBanner();
    this._setupDarkMode();
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
    // Animate large progress ring (progress page)
    var lgRing = document.querySelector('.pring-lg__fill');
    if (lgRing) {
      var target = parseFloat(lgRing.getAttribute('data-target'));
      // Two rAF frames so the initial dashoffset (empty) has been painted
      requestAnimationFrame(function() {
        requestAnimationFrame(function() {
          lgRing.style.transition = 'stroke-dashoffset 1400ms cubic-bezier(0.34, 1.56, 0.64, 1)';
          lgRing.style.strokeDashoffset = target;
        });
      });
    }

    // Count-up animation for stat values
    document.querySelectorAll('[data-count-to]').forEach(function(el) {
      var tgt = parseInt(el.getAttribute('data-count-to'), 10);
      if (!tgt) return;
      var dur = 900, t0 = performance.now();
      (function tick(now) {
        var p = Math.min((now - t0) / dur, 1);
        var e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(e * tgt);
        if (p < 1) requestAnimationFrame(tick);
      }(t0));
    });

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
        _launchConfetti(dayNum === 30);
        _showToast(dayNum < 30
          ? `Day ${dayNum} done! Keep glowing — Day ${dayNum + 1} is next.`
          : 'Day 30 complete! You did it. Welcome to the glow side!', 'success');
        completeBtn.disabled = true;
        completeBtn.innerHTML = '<svg data-lucide="check" aria-hidden="true"></svg> Day Complete!';
        if (window.lucide) window.lucide.createIcons();

        trackEvent('progress', 'day_complete', 'day_' + dayNum);
        this._checkMilestone(dayNum);

        if (dayNum === 30) {
          setTimeout(() => this._showCompletionModal(), 1800);
        } else {
          setTimeout(() => Router.navigate(`/day/${dayNum + 1}`), 2200);
        }
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
            trackEvent('engagement', 'photo_upload', 'day_' + dayNum);
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

    // FAQ search (help page) — debounced to avoid jank on slow devices
    const faqSearch = document.getElementById('faq-search');
    if (faqSearch) {
      faqSearch.addEventListener('input', _debounce(() => {
        const query = faqSearch.value.trim().toLowerCase();
        if (query) trackEvent('help', 'faq_search', query);
        const items = document.querySelectorAll('.faq-item');
        const cats  = document.querySelectorAll('.faq-category');
        const empty = document.getElementById('faq-empty');
        let visible = 0;

        items.forEach(item => {
          const match = !query || (item.getAttribute('data-search') || '').includes(query);
          item.hidden = !match;
          if (match) visible++;
        });

        cats.forEach(cat => {
          cat.hidden = [...cat.querySelectorAll('.faq-item')].every(i => i.hidden);
        });

        if (empty) empty.hidden = visible > 0;
      }, 200));
    }

    // Help contact form → pre-filled WhatsApp
    const helpForm = document.getElementById('help-contact-form');
    if (helpForm) {
      helpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name    = (document.getElementById('cf-name')?.value.trim())   || 'a customer';
        const topic   = document.getElementById('cf-topic')?.value            || 'general';
        const message = (document.getElementById('cf-message')?.value.trim()) || '';
        const labels  = {
          general: 'General question', reaction: 'Skin reaction',
          product: 'Product question', results: 'Not seeing results',
          order: 'Order / restock',    technical: 'App issue'
        };
        const text = `Hi Goodie! My name is ${name}.\n\nTopic: ${labels[topic] || topic}\n\n${message}`;
        window.open(`https://wa.me/2348063214942?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
      });
    }
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

  // ── Keyboard shortcuts (?, h, n, p, Esc) ────
  _setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const hash  = window.location.hash;
      const isDay = hash.startsWith('#/day/');
      const day   = isDay ? parseInt(hash.replace('#/day/', '')) : null;

      if (e.key === '?') {
        e.preventDefault();
        this._toggleShortcutsModal();
      } else if (e.key === 'h') {
        e.preventDefault();
        Router.navigate('/');
      } else if (e.key === 'n' && isDay && day < 30) {
        e.preventDefault();
        Router.navigate(`/day/${day + 1}`);
      } else if (e.key === 'p' && isDay && day > 1) {
        e.preventDefault();
        Router.navigate(`/day/${day - 1}`);
      } else if (e.key === 'Escape') {
        this._closeShortcutsModal();
        this._closeCompletionModal();
      }
    });
  },

  _toggleShortcutsModal() {
    const existing = document.getElementById('shortcuts-modal');
    if (existing) { existing.remove(); return; }
    const modal = document.createElement('div');
    modal.id = 'shortcuts-modal';
    modal.className = 'shortcuts-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Keyboard shortcuts');
    modal.innerHTML = `
      <div class="shortcuts-modal__backdrop"></div>
      <div class="shortcuts-modal__panel" tabindex="-1">
        <div class="shortcuts-modal__header">
          <h3>Keyboard Shortcuts</h3>
          <button class="shortcuts-modal__close" aria-label="Close shortcuts" id="sc-close">
            <svg data-lucide="x" aria-hidden="true"></svg>
          </button>
        </div>
        <ul class="shortcuts-list">
          <li><kbd>?</kbd><span>Show / hide this panel</span></li>
          <li><kbd>h</kbd><span>Go to Home</span></li>
          <li><kbd>n</kbd><span>Next day (on a day page)</span></li>
          <li><kbd>p</kbd><span>Previous day (on a day page)</span></li>
          <li><kbd>→</kbd><span>Next day (on a day page)</span></li>
          <li><kbd>←</kbd><span>Previous day (on a day page)</span></li>
          <li><kbd>Esc</kbd><span>Close any open panel or modal</span></li>
        </ul>
      </div>`;
    document.body.appendChild(modal);
    if (window.lucide) window.lucide.createIcons();
    modal.querySelector('.shortcuts-modal__backdrop').addEventListener('click', () => modal.remove());
    modal.querySelector('#sc-close').addEventListener('click', () => modal.remove());
    requestAnimationFrame(() => modal.classList.add('is-visible'));
    modal.querySelector('.shortcuts-modal__panel').focus();
  },

  _closeShortcutsModal() {
    const m = document.getElementById('shortcuts-modal');
    if (m) m.remove();
  },

  // ── Offline / online banner ──────────────────
  _setupOfflineBanner() {
    const show = () => {
      if (document.getElementById('offline-banner')) return;
      const bar = document.createElement('div');
      bar.id = 'offline-banner';
      bar.className = 'offline-banner';
      bar.setAttribute('role', 'alert');
      bar.innerHTML = `
        <svg data-lucide="wifi-off" aria-hidden="true"></svg>
        <span>You're offline. Your progress is saved locally — the guide still works fully.</span>
        <button class="offline-banner__close" aria-label="Dismiss" id="offline-dismiss">
          <svg data-lucide="x" aria-hidden="true"></svg>
        </button>`;
      document.body.appendChild(bar);
      if (window.lucide) window.lucide.createIcons();
      bar.querySelector('#offline-dismiss').addEventListener('click', () => bar.remove());
      requestAnimationFrame(() => bar.classList.add('is-visible'));
    };
    const hide = () => {
      const bar = document.getElementById('offline-banner');
      if (bar) bar.remove();
      _showToast('Back online!', 'success');
    };
    window.addEventListener('offline', show);
    window.addEventListener('online',  hide);
    if (!navigator.onLine) show();
  },

  // ── Dark mode toggle ─────────────────────────
  _setupDarkMode() {
    const saved = Storage.get('dark_mode');
    if (saved) document.documentElement.setAttribute('data-theme', 'dark');

    const nav = document.querySelector('.nav');
    if (!nav) return;
    const btn = document.createElement('button');
    btn.id = 'dark-mode-toggle';
    btn.className = 'nav__theme-btn';
    const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark';
    const sync   = () => {
      btn.setAttribute('aria-label', isDark() ? 'Switch to light mode' : 'Switch to dark mode');
      btn.innerHTML = `<svg data-lucide="${isDark() ? 'sun' : 'moon'}" aria-hidden="true"></svg>`;
      if (window.lucide) window.lucide.createIcons();
    };
    sync();
    nav.insertBefore(btn, nav.querySelector('.nav__toggle'));
    btn.addEventListener('click', () => {
      if (isDark()) {
        document.documentElement.removeAttribute('data-theme');
        Storage.remove('dark_mode');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        Storage.set('dark_mode', '1');
      }
      sync();
      trackEvent('ui', 'dark_mode_toggle', isDark() ? 'dark' : 'light');
    });
  },

  // ── Milestone toasts (weeks, Day 15) ─────────
  _checkMilestone(dayNum) {
    const weeks = { 7: 'Week 1', 14: 'Week 2', 21: 'Week 3', 28: 'Week 4' };
    if (weeks[dayNum]) {
      setTimeout(() => _showToast(`${weeks[dayNum]} complete! You're glowing! ✦`, 'success'), 2700);
      trackEvent('milestone', 'week_complete', weeks[dayNum]);
    }
    if (dayNum === 15) {
      setTimeout(() => _showToast('Halfway there! Day 15 done — your skin is already changing.', 'success'), 2700);
      trackEvent('milestone', 'halfway', 'day_15');
    }
  },

  // ── Day 30 completion modal ───────────────────
  _showCompletionModal() {
    if (document.getElementById('completion-modal')) return;
    const streak = Progress.calculateStreak();
    const waText = encodeURIComponent(
      'I just completed the Goodie 30-Day Glow Guide! 30 days of consistent skincare done ✨ #GoodieGlowUp'
    );
    const modal = document.createElement('div');
    modal.id = 'completion-modal';
    modal.className = 'completion-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'cm-title');
    modal.innerHTML = `
      <div class="completion-modal__backdrop"></div>
      <div class="completion-modal__panel" tabindex="-1">
        <div class="completion-modal__sparks">✦ ✦ ✦</div>
        <div class="completion-modal__icon">
          <svg data-lucide="award" aria-hidden="true"></svg>
        </div>
        <h2 id="cm-title" class="completion-modal__title">30 Days Complete!</h2>
        <p class="completion-modal__sub">
          You've finished the <strong>Goodie Glow Guide</strong>. Your commitment, your skin,
          and your glow — all real. We are so proud of you. 🌟
        </p>
        <div class="completion-modal__stats">
          <div class="completion-modal__stat">
            <strong>30</strong><span>Days Done</span>
          </div>
          <div class="completion-modal__stat">
            <strong>${streak}</strong><span>Day Streak</span>
          </div>
        </div>
        <div class="completion-modal__actions">
          <a href="https://wa.me/2348063214942?text=${waText}"
             class="btn btn--whatsapp" target="_blank" rel="noopener noreferrer">
            <svg data-lucide="message-circle" aria-hidden="true"></svg>
            Share on WhatsApp
          </a>
          <button class="btn btn--primary" id="cm-progress">
            <svg data-lucide="bar-chart-2" aria-hidden="true"></svg>
            See My Progress
          </button>
        </div>
        <button class="completion-modal__dismiss" id="cm-dismiss" aria-label="Close">
          <svg data-lucide="x" aria-hidden="true"></svg>
        </button>
      </div>`;
    document.body.appendChild(modal);
    if (window.lucide) window.lucide.createIcons();

    const close = () => modal.remove();
    modal.querySelector('.completion-modal__backdrop').addEventListener('click', close);
    modal.querySelector('#cm-dismiss').addEventListener('click', close);
    modal.querySelector('#cm-progress').addEventListener('click', () => {
      close();
      Router.navigate('/progress');
    });
    requestAnimationFrame(() => modal.classList.add('is-visible'));
    modal.querySelector('.completion-modal__panel').focus();
    trackEvent('milestone', 'day_30_complete', 'modal_shown');
  },

  _closeCompletionModal() {
    const m = document.getElementById('completion-modal');
    if (m) m.remove();
  },

  // ── Footer year ─────────────────────────────
  _updateFooterYear() {
    const el = document.getElementById('footer-year');
    if (el) el.textContent = new Date().getFullYear();
  },

  // ── PDF / Print: Progress Report ────────────
  exportProgress() {
    const completed   = Progress.getCompletedCount();
    const pct         = Progress.getCompletionPercentage();
    const streak      = Progress.calculateStreak();
    const startDate   = Progress.getState().startDate;
    const today       = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    const startedOn   = startDate
      ? new Date(startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      : 'Not recorded';
    const expectedEnd = startDate
      ? new Date(new Date(startDate).getTime() + 30 * 24 * 60 * 60 * 1000)
          .toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      : '—';

    const weekRows = content.weeks.map(w => {
      const wp   = Progress.getWeekProgress(w.week);
      const wpct = wp.total ? Math.round((wp.done / wp.total) * 100) : 0;
      const status = wp.done === wp.total ? 'Complete ✓'
                   : wp.done > 0          ? 'In Progress'
                   :                        'Not started';
      return `<tr>
        <td>Week ${w.week}</td>
        <td>${w.title}</td>
        <td>${w.focus}</td>
        <td>${wp.done} / ${wp.total}</td>
        <td>${wpct}%</td>
        <td>${status}</td>
      </tr>`;
    }).join('');

    const calHTML = content.weeks.map(w => {
      const dots = w.days.map(d => {
        const done    = Progress.isDayComplete(d);
        const current = d === Progress.getCurrentDay();
        const cls     = done ? 'pcd--done' : current ? 'pcd--now' : '';
        return `<span class="pcd ${cls}">${d}</span>`;
      }).join('');
      return `<div class="pcr"><span class="pcw">W${w.week}</span>${dots}</div>`;
    }).join('');

    const photoHTML = [
      { day: 1,  label: 'Before — Day 1'   },
      { day: 10, label: 'Week 2 — Day 10'  },
      { day: 20, label: 'Week 3 — Day 20'  },
      { day: 30, label: 'After — Day 30'   }
    ].map(slot => {
      const photo = Storage.get('photo_day' + slot.day);
      return photo
        ? `<div class="pp"><img src="${photo}" alt="${slot.label}" class="pp__img"><p class="pp__lbl">${slot.label}</p></div>`
        : `<div class="pp pp--empty"><div class="pp__ph"></div><p class="pp__lbl">${slot.label}</p></div>`;
    }).join('');

    const el = document.createElement('div');
    el.id = 'print-overlay';
    el.innerHTML = `
      <div class="pr">
        <header class="pr-hd">
          <p class="pr-hd__brand">Goodie Glow Guide</p>
          <p class="pr-hd__sub">Progress Report &bull; ${today}</p>
        </header>

        <div class="pr-stats">
          <div class="pr-stat"><span class="pr-stat__v">${completed}</span><span class="pr-stat__l">Days Done</span></div>
          <div class="pr-stat"><span class="pr-stat__v">${pct}%</span><span class="pr-stat__l">Complete</span></div>
          <div class="pr-stat"><span class="pr-stat__v">${streak}</span><span class="pr-stat__l">Streak</span></div>
          <div class="pr-stat"><span class="pr-stat__v">${30 - completed}</span><span class="pr-stat__l">Remaining</span></div>
        </div>
        <p class="pr-meta">Started: ${startedOn} &nbsp;&bull;&nbsp; Expected completion: ${expectedEnd}</p>

        <h2 class="pr-h2">Weekly Breakdown</h2>
        <table class="pr-tbl">
          <thead><tr><th>Week</th><th>Theme</th><th>Focus</th><th>Done</th><th>%</th><th>Status</th></tr></thead>
          <tbody>${weekRows}</tbody>
        </table>

        <h2 class="pr-h2">30-Day Calendar</h2>
        <div class="pr-cal">${calHTML}</div>
        <p class="pr-cal-leg">
          <span class="pcd pcd--done">1</span> Completed &nbsp;
          <span class="pcd pcd--now">1</span> Current &nbsp;
          <span class="pcd">1</span> Not yet
        </p>

        <h2 class="pr-h2 pr-pb">Photo Journey</h2>
        <div class="pr-photos">${photoHTML}</div>

        <footer class="pr-ft">
          Goodie Beauty &amp; Skincare &bull; 08063214942 &bull; @Its_g.o.o.d.i.e
        </footer>
      </div>`;

    document.body.appendChild(el);
    window.addEventListener('afterprint', function _clean() {
      if (el.parentNode) el.parentNode.removeChild(el);
      window.removeEventListener('afterprint', _clean);
    });
    window.print();
    trackEvent('progress', 'export_pdf', 'progress_report');
  },

  // ── PDF / Print: Daily Routine ───────────────
  exportDay(dayNumber) {
    const day = content.days.find(d => d.day === dayNumber);
    if (!day) return;

    const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    const buildStep = step => `
      <li class="ps">
        <span class="ps__box">&#9633;</span>
        <div class="ps__body">
          <strong>${_cap(step.step.replace(/-/g, ' '))} &mdash; ${step.product}</strong>
          <span class="ps__dur">${step.duration}</span>
          <p class="ps__inst">${step.instructions}</p>
        </div>
      </li>`;

    const remedyHTML = day.naturalRemedy ? `
      <h2 class="pr-h2">Natural Treatment: ${day.naturalRemedy.name}</h2>
      <p><strong>When:</strong> ${day.naturalRemedy.timing}</p>
      <p><strong>You'll need:</strong> ${day.naturalRemedy.ingredients.join(', ')}</p>
      <ol class="pr-ol">${day.naturalRemedy.instructions.map(i => `<li>${i}</li>`).join('')}</ol>
      <p class="pr-remedy-note">${day.naturalRemedy.benefits}</p>` : '';

    const avoidItems = day.avoid.map(a => `<li>${a}</li>`).join('');

    const el = document.createElement('div');
    el.id = 'print-overlay';
    el.innerHTML = `
      <div class="pr">
        <header class="pr-hd">
          <p class="pr-hd__brand">Goodie Glow Guide</p>
          <p class="pr-hd__sub">Day ${dayNumber} Routine &bull; ${today}</p>
        </header>

        <h1 class="pr-day-title">Day ${dayNumber} &mdash; ${day.title}</h1>
        <p class="pr-day-meta">Week ${day.week} &bull; ${day.phase}</p>

        <h2 class="pr-h2">&#9728; Morning Routine</h2>
        <ul class="pr-steps">${day.morning.map(s => buildStep(s)).join('')}</ul>

        <h2 class="pr-h2">&#9790; Night Routine</h2>
        <ul class="pr-steps">${day.night.map(s => buildStep(s)).join('')}</ul>

        ${remedyHTML}

        <div class="pr-2col">
          <div>
            <h2 class="pr-h2">Today's Tip</h2>
            <p class="pr-tip">${day.tip}</p>
          </div>
          <div>
            <h2 class="pr-h2">Skip These Today</h2>
            <ul class="pr-avoid">${avoidItems}</ul>
          </div>
        </div>

        <footer class="pr-ft">
          Goodie Beauty &amp; Skincare &bull; 08063214942 &bull; @Its_g.o.o.d.i.e
        </footer>
      </div>`;

    document.body.appendChild(el);
    window.addEventListener('afterprint', function _clean() {
      if (el.parentNode) el.parentNode.removeChild(el);
      window.removeEventListener('afterprint', _clean);
    });
    window.print();
    trackEvent('day', 'print_routine', 'day_' + dayNumber);
  }
};


// Expose GoodieApp globally so inline onclick handlers can call it
window.GoodieApp = GoodieApp;


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

// Confetti burst (pass intense=true on Day 30 for extra celebration)
function _launchConfetti(intense) {
  var count  = intense ? 160 : 60;
  var colors = ['#8B6F47', '#D4AF37', '#6B8E6F', '#FAF8F5', '#C47A2B', '#ffffff'];
  for (var i = 0; i < count; i++) {
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


// Lightweight analytics stub — swap body for GA4/Plausible later
function trackEvent(category, action, label) {
  try {
    console.log('[Goodie]', category, '|', action + (label ? ' | ' + label : ''));
    // GA4: gtag('event', action, { event_category: category, event_label: label });
  } catch (e) { /* never interrupt the user */ }
}

// Returns a debounced version of fn (fires after ms of silence)
function _debounce(fn, ms) {
  var t;
  return function () {
    clearTimeout(t);
    var args = arguments, ctx = this;
    t = setTimeout(function () { fn.apply(ctx, args); }, ms);
  };
}


// ─────────────────────────────────────────────
// ACCESS CONTROL
// ─────────────────────────────────────────────
const AccessControl = {
  // Edit this array to add, remove, or rotate codes.
  // Codes are case-insensitive — customers can type in any case.
  validCodes: [
    'GOODIE2024',
    'GLOW30DAYS',
    'SKINCARE2024'
  ],

  hasAccess() {
    return this.isValidCode(Storage.get('access'));
  },

  isValidCode(code) {
    if (!code) return false;
    return this.validCodes.includes(code.toUpperCase().trim());
  },

  // Show the gate and wire up the form.
  setupGate() {
    const gate = document.getElementById('access-gate');
    if (gate) gate.removeAttribute('hidden');

    const form    = document.getElementById('access-form');
    const errorEl = document.getElementById('access-error');
    const inputEl = document.getElementById('access-code-input');

    if (!form) return;
    if (inputEl) inputEl.focus();

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const code = inputEl ? inputEl.value.trim() : '';

      if (this.isValidCode(code)) {
        Storage.set('access', code.toUpperCase().trim());
        this._showSuccess();
        setTimeout(_bootApp, 1600);
      } else {
        this._showError(inputEl, errorEl);
      }
    });
  },

  _showSuccess() {
    const card = document.getElementById('access-gate-card');
    if (!card) return;
    card.innerHTML = `
      <div class="access-success">
        <div class="access-success__icon" aria-hidden="true">✓</div>
        <h2>Welcome!</h2>
        <p>Loading your glow journey…</p>
      </div>`;
  },

  _showError(inputEl, errorEl) {
    if (errorEl) errorEl.hidden = false;
    if (inputEl) {
      inputEl.classList.add('is-error');
      inputEl.value = '';
      inputEl.focus();
    }
    setTimeout(() => {
      if (errorEl) errorEl.hidden = true;
      if (inputEl) inputEl.classList.remove('is-error');
    }, 3200);
    trackEvent('access', 'invalid_code', '');
  },

  // Open the browser console on your site and call this to print a one-time
  // code for a customer. To make it permanent, add it to validCodes[] and redeploy.
  generateCode(customerName) {
    const code = 'GOODIE' + Math.random().toString(36).substring(2, 8).toUpperCase();
    console.log('%c Code for ' + customerName + ': ' + code, 'color:#8B6F47;font-weight:bold;font-size:14px');
    return code;
  },

  // Run in the customer's browser console to clear their saved code.
  revokeAccess() {
    Storage.remove('access');
    window.location.reload();
  }
};


// ─────────────────────────────────────────────
// BOOT
// ─────────────────────────────────────────────
// Hides the access gate and starts the full app.
// Called either directly (code already saved) or by AccessControl after
// the user enters a valid code.
function _bootApp() {
  const gate = document.getElementById('access-gate');
  if (gate) gate.hidden = true;

  try {
    GoodieApp.init();
  } catch (e) {
    var main = document.getElementById('main');
    if (main) main.innerHTML = '<div style="padding:2rem;font-family:sans-serif"><strong style="color:red">Boot error:</strong><pre style="white-space:pre-wrap;font-size:13px;margin-top:8px">' + (e.stack || e.message || String(e)) + '</pre></div>';
    console.error('[Goodie] Boot error:', e);
    return;
  }
  if (window.lucide) window.lucide.createIcons();
  trackEvent('app', 'boot', 'success');
}

// This script runs synchronously after the DOM is built (no defer/async),
// so no DOMContentLoaded listener is needed.
(function boot() {
  if (!content) {
    var main = document.getElementById('main');
    if (main) main.innerHTML = '<div style="padding:2rem;font-family:sans-serif"><strong style="color:red">Boot error:</strong><pre style="white-space:pre-wrap;font-size:13px;margin-top:8px">window.GoodieContent is not set — content.js may have failed to load or ran out of order.</pre></div>';
    console.error('[Goodie] content.js failed');
    return;
  }

  if (!AccessControl.hasAccess()) {
    AccessControl.setupGate();
    return;
  }

  _bootApp();
}());

}()); // end app IIFE
