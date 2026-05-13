# Goodie Glow Guide — Build Guide

Technical specification for building the app. Read alongside `DESIGN-SYSTEM.md`. This is the implementation rulebook — start here before writing any code.

---

## 1. Component Patterns to Reference

We write vanilla HTML/CSS/JS but borrow proven API designs and patterns from these sources. **We are not installing any of them.**

### A. shadcn/ui Patterns (https://ui.shadcn.com)

Study these patterns for API design ideas, not the code itself:

| shadcn Component | What to borrow | Goodie implementation |
|-----------------|----------------|-----------------------|
| `Button` | `variant` prop (default, outline, ghost) + `size` prop (sm, default, lg) | `.btn`, `.btn--primary`, `.btn--secondary`, `.btn--ghost`, `.btn--sm`, `.btn--lg` CSS classes |
| `Card` | Composable sub-elements: `CardHeader`, `CardContent`, `CardFooter` | `.card`, `.card__header`, `.card__body`, `.card__footer` BEM pattern |
| `Input` + `Label` | Always paired, `id`/`for` linkage, helper text below | `.form-group > label + input + .form-helper` structure |
| `Progress` | `value` + `max` as data attributes, animated fill | `data-value` / `data-max` on `.progress`, JS reads and sets `--progress-fill` CSS var |
| `Checkbox` | Visually hidden native input + custom styled label | Custom checkbox pattern from `DESIGN-SYSTEM.md §4.3` |

### B. Inclusive Components (https://inclusive-components.design)

Accessibility patterns — follow these exactly for the listed components:

**Accessible Checkbox Group**
- Native `<input type="checkbox">` — never fake it with divs
- `<fieldset>` + `<legend>` wraps each routine block (morning / night)
- `aria-describedby` links each checkbox to its helper text
- State persisted to LocalStorage on `change` event, not on form submit

**Collapsible Sections (Tips / Avoid sections per day)**
- `<button aria-expanded="false" aria-controls="panel-id">` toggles visibility
- Panel uses `hidden` attribute (not `display:none` in CSS) — toggled by JS
- Never use `tabindex="-1"` to hide interactive content inside a collapsed panel

**Mobile Navigation Drawer**
- `<button aria-expanded="false" aria-controls="nav-drawer">` — the hamburger
- `aria-label="Open menu"` on the button, updated to `"Close menu"` when open
- Trap focus inside drawer when open (Tab cycles within it)
- `Escape` key closes the drawer and returns focus to the toggle button
- Backdrop click also closes

**Card Patterns**
- If the whole card is a link: one `<a>` wraps the entire card, stretched with `::after` pseudo-element
- If the card has multiple actions: each button is independent, no wrapping `<a>`
- Never nest interactive elements inside a `<button>`

### C. Every Layout Patterns (https://every-layout.dev)

Use these CSS primitives as named utility classes throughout the project:

**Stack** — vertical spacing between children
```css
.stack { display: flex; flex-direction: column; }
.stack > * + * { margin-top: var(--stack-gap, var(--space-4)); }
/* Override gap inline: <div class="stack" style="--stack-gap: var(--space-8)"> */
```

**Cluster** — wrapping horizontal group (tags, badges, button rows)
```css
.cluster { display: flex; flex-wrap: wrap; gap: var(--cluster-gap, var(--space-3)); align-items: center; }
```

**Sidebar** — desktop: fixed-width sidebar + fluid main; mobile: stacks vertically
```css
.sidebar-layout { display: flex; flex-wrap: wrap; gap: var(--space-6); }
.sidebar-layout__aside { flex-basis: 240px; flex-grow: 1; }
.sidebar-layout__main  { flex-basis: 0; flex-grow: 999; min-width: 60%; }
```

**Content-first approach** — never write a breakpoint to *hide* things. Design each element to work at any width. Breakpoints enhance, they never gatekeep content.

---

## 2. JavaScript Architecture

All JS files live in `src/js/`. No build step required — loaded via `<script defer>` in order.

```
src/js/
├── storage.js        — LocalStorage wrapper (load first)
├── progress.js       — Progress calculations (depends on storage.js)
├── router.js         — Hash-based SPA routing (depends on nothing)
├── app.js            — Main controller, ties everything together (load last)
└── photoUpload.js    — Photo capture + preview (standalone, loaded on day pages)
```

### app.js — Main Controller

```javascript
const GoodieApp = {
  init() {
    this.setupNavigation();
    this.loadProgress();
    Router.init();
  },

  loadProgress() {
    const progress = Storage.get('userProgress');
    if (!progress) {
      Storage.set('userProgress', this.defaultProgress());
    }
  },

  saveProgress() {
    // Called after every checkbox change — debounced 300ms
    const state = Progress.getState();
    Storage.set('userProgress', state);
  },

  renderCurrentDay() {
    const day = Progress.getCurrentDay();
    // Render day card content from days[] data array
    document.title = `Day ${day} — Goodie Glow Guide`;
  },

  setupNavigation() {
    const toggle  = document.querySelector('[data-nav-toggle]');
    const drawer  = document.querySelector('[data-nav-drawer]');
    const backdrop = document.querySelector('[data-nav-backdrop]');

    if (!toggle || !drawer) return;

    toggle.addEventListener('click', () => this.toggleNav(toggle, drawer));
    backdrop?.addEventListener('click', () => this.closeNav(toggle, drawer));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeNav(toggle, drawer);
    });
  },

  toggleNav(toggle, drawer) {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    isOpen ? this.closeNav(toggle, drawer) : this.openNav(toggle, drawer);
  },

  openNav(toggle, drawer) {
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    drawer.classList.add('is-open');
    drawer.removeAttribute('hidden');
    // Focus first nav link
    drawer.querySelector('a')?.focus();
  },

  closeNav(toggle, drawer) {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    drawer.classList.remove('is-open');
    toggle.focus(); // Return focus to trigger
  },

  setupRoutineChecks() {
    document.querySelectorAll('.routine-checklist__input').forEach(input => {
      input.addEventListener('change', (e) => {
        const { day, period, step } = e.target.dataset;
        Progress.toggleStep(day, period, step, e.target.checked);
        this.saveProgress();
        this.updateProgressUI();
      });
    });
  },

  updateProgressUI() {
    const pct = Progress.getCompletionPercentage();
    const fill = document.querySelector('[data-progress-fill]');
    if (fill) fill.style.width = `${pct}%`;
    document.querySelectorAll('[data-progress-text]').forEach(el => {
      el.textContent = `${pct}%`;
    });
  },

  setupPhotoUpload() {
    // Delegated to photoUpload.js — only initialised on day pages
    if (typeof PhotoUpload !== 'undefined') PhotoUpload.init();
  },

  defaultProgress() {
    return {
      startDate: new Date().toISOString(),
      currentDay: 1,
      completedDays: [],
      routineChecks: {},
      photos: {},
      products: []
    };
  }
};

document.addEventListener('DOMContentLoaded', () => GoodieApp.init());
```

### storage.js — LocalStorage Wrapper

```javascript
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
      // localStorage full or unavailable (private browsing on some browsers)
      console.warn('Storage.set failed:', e.message);
      return false;
    }
  },

  remove(key) {
    localStorage.removeItem(this.PREFIX + key);
  },

  clear() {
    // Only clears keys with our prefix — doesn't nuke other site data
    Object.keys(localStorage)
      .filter(k => k.startsWith(this.PREFIX))
      .forEach(k => localStorage.removeItem(k));
  }
};
```

### progress.js — Progress Calculations

```javascript
const Progress = {
  _state: null,

  getState() {
    if (!this._state) this._state = Storage.get('userProgress');
    return this._state;
  },

  getCurrentDay() {
    return this.getState()?.currentDay ?? 1;
  },

  markDayComplete(dayNumber) {
    const state = this.getState();
    if (!state.completedDays.includes(dayNumber)) {
      state.completedDays.push(dayNumber);
    }
    if (dayNumber === state.currentDay && dayNumber < 30) {
      state.currentDay = dayNumber + 1;
    }
    this._state = state;
    Storage.set('userProgress', state);
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
    this._state = state;
    // Check if day is fully complete
    this.checkDayCompletion(day);
  },

  checkDayCompletion(day) {
    const dayData = days.find(d => d.day === parseInt(day));
    if (!dayData) return;
    const checks = this.getState().routineChecks[day] ?? { morning: [], night: [] };
    const allMorning = dayData.morning.every(s => checks.morning.includes(s.step));
    const allNight   = dayData.night.every(s => checks.night.includes(s.step));
    if (allMorning && allNight) this.markDayComplete(parseInt(day));
  },

  getCompletionPercentage() {
    const completed = this.getState()?.completedDays?.length ?? 0;
    return Math.round((completed / 30) * 100);
  },

  getDayChecks(day) {
    return this.getState()?.routineChecks?.[day] ?? { morning: [], night: [] };
  }
};
```

---

## 3. LocalStorage Schema

All data stored under the key `goodie_userProgress`.

```javascript
const userProgress = {
  // ISO 8601 — when the user started the programme
  startDate: '2026-05-13T10:00:00.000Z',

  // Which day they are currently on (1–30)
  currentDay: 7,

  // Array of day numbers they have fully completed
  completedDays: [1, 2, 3, 4, 5, 6],

  // Per-day step completion
  // Key: day number as string, value: arrays of completed step IDs
  routineChecks: {
    '1': {
      morning: ['cleanse', 'moisturize', 'sunscreen'],
      night:   ['cleanse', 'serum', 'moisturize']
    },
    '2': {
      morning: ['cleanse', 'toner', 'moisturize', 'sunscreen'],
      night:   ['cleanse', 'serum', 'moisturize', 'lip-balm']
    }
  },

  // Photos — stored as data URLs (base64)
  // Only capture days 1, 10, 20, 30 to stay within storage limits
  photos: {
    day1:  'data:image/jpeg;base64,...',
    day10: 'data:image/jpeg;base64,...',
    day30: 'data:image/jpeg;base64,...'
  },

  // Products the user has marked as "I have this"
  products: ['vitamin-c-wash', 'niacinamide-serum', 'spf-50-sunscreen']
};
```

**Storage size notes:**
- Text data (checks, dates, products): < 5 KB
- Each photo (compressed JPEG, 800px): ~80–150 KB
- Total with 4 photos: < 700 KB — well within the 5 MB localStorage limit
- Compress photos to max 800px wide and 70% quality before saving

---

## 4. Image Loading Strategy

### A. Unsplash API Integration

```javascript
// src/js/imageLoader.js
const ImageLoader = {
  // Free tier: 50 requests/hour — sufficient for initial load
  BASE_URL: 'https://api.unsplash.com/photos/random',
  ACCESS_KEY: 'YOUR_ACCESS_KEY_HERE', // Replace — see unsplash.com/developers

  queries: {
    hero:       'african woman skincare glow',
    morning:    'black woman morning routine sunlight',
    night:      'african woman night skincare routine',
    hydration:  'african woman drinking water natural',
    natural:    'natural beauty african dark skin',
    products:   'skincare products minimal aesthetic flat lay'
  },

  async fetch(queryKey, width = 800) {
    const query = this.queries[queryKey] ?? queryKey;
    const url = `${this.BASE_URL}?query=${encodeURIComponent(query)}&w=${width}&client_id=${this.ACCESS_KEY}`;
    try {
      const res  = await fetch(url);
      const data = await res.json();
      return data.urls?.regular ?? null;
    } catch {
      return null;
    }
  },

  // Set image src with fallback to local placeholder
  async setImage(imgEl, queryKey) {
    const url = await this.fetch(queryKey);
    imgEl.src = url ?? `images/placeholder-${queryKey}.jpg`;
  }
};
```

### B. Fallback Strategy

```javascript
// Always provide a local fallback — API may be unavailable offline
function loadImageWithFallback(imgEl, primarySrc, fallbackSrc) {
  imgEl.src = primarySrc;
  imgEl.onerror = () => {
    imgEl.src = fallbackSrc;
    imgEl.onerror = null; // Prevent infinite loop if fallback also fails
  };
}
```

### C. Lazy Loading Implementation

```html
<!-- Native lazy loading — supported in all modern browsers -->
<img src="images/day-3-morning.jpg"
     alt="Morning skincare step"
     loading="lazy"
     decoding="async"
     width="800" height="533">

<!-- Always specify width/height to prevent layout shift (CLS) -->
```

For JS-enhanced lazy loading (older browser fallback if needed):
```javascript
const lazyImages = document.querySelectorAll('img[loading="lazy"]');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '200px' }); // Load 200px before entering viewport
  lazyImages.forEach(img => observer.observe(img));
}
```

---

## 5. Routing Strategy

Single-page app with hash-based routing — no server configuration needed, works on GitHub Pages and Netlify.

```
#/            → Home / landing page
#/day/1       → Day 1 detail view
#/day/7       → Day 7 detail view
#/progress    → Full progress overview
#/products    → Product guide
#/help        → Troubleshooting
```

```javascript
// src/js/router.js
const Router = {
  routes: {
    '/'          : () => Views.renderHome(),
    '/day/:id'   : (params) => Views.renderDay(params.id),
    '/progress'  : () => Views.renderProgress(),
    '/products'  : () => Views.renderProducts(),
    '/help'      : () => Views.renderHelp()
  },

  init() {
    window.addEventListener('hashchange', () => this.resolve());
    this.resolve(); // Handle initial load
  },

  resolve() {
    const hash   = window.location.hash.slice(1) || '/';
    const matched = this.match(hash);
    if (matched) {
      matched.handler(matched.params);
    } else {
      Views.render404();
    }
    // Scroll to top on every navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  match(path) {
    for (const [pattern, handler] of Object.entries(this.routes)) {
      const params = this.extractParams(pattern, path);
      if (params !== null) return { handler, params };
    }
    return null;
  },

  extractParams(pattern, path) {
    const patternParts = pattern.split('/');
    const pathParts    = path.split('/');
    if (patternParts.length !== pathParts.length) return null;
    const params = {};
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        params[patternParts[i].slice(1)] = pathParts[i];
      } else if (patternParts[i] !== pathParts[i]) {
        return null;
      }
    }
    return params;
  },

  navigate(path) {
    window.location.hash = path;
  }
};
```

---

## 6. Build Order — MVP First

Work through phases in order. Do not start Phase 2 until Phase 1 is complete and tested on mobile.

### Phase 1 — Foundation

- [ ] `src/index.html` — semantic HTML shell, `<head>` with fonts + meta tags
- [ ] `src/css/styles.css` — CSS variables, reset, base typography
- [ ] Navigation — mobile hamburger drawer + desktop inline nav
- [ ] Landing page — hero, programme overview, CTA to start
- [ ] `src/js/router.js` — hash routing, basic view switching
- [ ] `src/js/storage.js` — LocalStorage wrapper
- [ ] Deploy to Netlify (even empty) — establish the pipeline early

### Phase 2 — Core Feature (Days 1–7)

- [ ] `src/data/content.js` — days array with Day 1–7 full content
- [ ] Day view template — renders a day from the data array
- [ ] Morning routine checklist component — checkboxes + labels + fieldset
- [ ] Night routine checklist component
- [ ] `src/js/progress.js` — state management, step toggle, day completion
- [ ] Progress bar on day view — updates in real-time as steps are checked
- [ ] Dashboard — "Your Journey" section showing current day + streak
- [ ] LocalStorage persistence — progress survives page reload
- [ ] Completion animation — `animate-celebration` on full day completion

### Phase 3 — Enhancement (Days 8–30)

- [ ] `src/data/content.js` — complete Days 8–30
- [ ] Photo upload — before/after on Day 1, Day 10, Day 20, Day 30
- [ ] Progress overview page — all 30 days at a glance, completed vs locked
- [ ] Product guide page — product cards with names, uses, availability
- [ ] Troubleshooting page — collapsible Q&A sections

### Phase 4 — Polish

- [ ] PDF export — `window.print()` with print stylesheet (simplest approach first)
- [ ] WhatsApp share — pre-filled message with current day
- [ ] Social share — `navigator.share()` API with fallback copy link
- [ ] Push notifications — browser Notifications API (optional, ask user permission)
- [ ] Dark mode — `prefers-color-scheme` media query, separate token overrides
- [ ] Lighthouse audit — target score > 90 on Performance, Accessibility, Best Practices

---

## 7. Specific Component Builds

### A. Daily Routine Checklist

```html
<section class="day-view" data-day="1">

  <!-- Morning routine -->
  <fieldset class="routine-checklist">
    <legend class="routine-checklist__legend">
      <i data-lucide="sun" class="icon-md icon-primary" aria-hidden="true"></i>
      Morning Routine
    </legend>

    <ul class="routine-checklist__list" role="list">
      <li class="routine-checklist__item">
        <label class="checkbox-item">
          <input
            class="checkbox-item__input routine-checklist__input"
            type="checkbox"
            id="day1-morning-cleanse"
            data-day="1"
            data-period="morning"
            data-step="cleanse"
            aria-describedby="day1-morning-cleanse-hint"
          >
          <span class="checkbox-item__label">
            <span class="step-name">Cleanse</span>
            <span class="step-details" id="day1-morning-cleanse-hint">
              Vitamin C Face Wash — 2 min, lukewarm water
            </span>
          </span>
        </label>
      </li>
      <!-- Repeat for each step -->
    </ul>
  </fieldset>

  <!-- Night routine — same structure, data-period="night" -->

</section>
```

CSS additions for the checklist:
```css
.routine-checklist {
  border: none;
  padding: 0;
  margin: 0;
}

.routine-checklist__legend {
  display:       flex;
  align-items:   center;
  gap:           var(--space-2);
  font-family:   var(--font-heading);
  font-size:     var(--text-xl);
  font-weight:   var(--weight-bold);
  color:         var(--color-text-primary);
  margin-bottom: var(--space-4);
  width:         100%;
}

.routine-checklist__list {
  list-style: none;
  padding:    0;
  margin:     0;
}

.step-name {
  display:     block;
  font-weight: var(--weight-semibold);
}

.step-details {
  display:   block;
  font-size: var(--text-sm);
  color:     var(--color-text-muted);
  margin-top: var(--space-1);
}
```

---

### B. Progress Ring (SVG)

```html
<div class="progress-ring-wrapper" aria-hidden="true">
  <svg class="progress-ring" viewBox="0 0 120 120" width="120" height="120">
    <!-- Background circle -->
    <circle
      class="progress-ring__bg"
      cx="60" cy="60" r="52"
      fill="none"
      stroke="var(--color-bg-muted)"
      stroke-width="8"
    />
    <!-- Progress circle — stroke-dashoffset controlled by JS -->
    <circle
      class="progress-ring__fill"
      cx="60" cy="60" r="52"
      fill="none"
      stroke="var(--color-accent)"
      stroke-width="8"
      stroke-linecap="round"
      stroke-dasharray="326.7"
      stroke-dashoffset="326.7"
      transform="rotate(-90 60 60)"
      data-progress-ring
    />
    <!-- Day label -->
    <text class="progress-ring__day" x="60" y="55"
          text-anchor="middle" dominant-baseline="middle">
      Day
    </text>
    <text class="progress-ring__number" x="60" y="75"
          text-anchor="middle" dominant-baseline="middle"
          data-progress-ring-number>
      1
    </text>
  </svg>
</div>

<!-- Accessible text alternative — shown to screen readers -->
<p class="sr-only" aria-live="polite" data-progress-announce></p>
```

```javascript
// Update ring — call this whenever progress changes
// circumference of r=52 circle: 2 * Math.PI * 52 = 326.73
function updateProgressRing(completedDays, currentDay) {
  const circumference = 326.73;
  const pct           = completedDays / 30;
  const offset        = circumference * (1 - pct);

  const ring   = document.querySelector('[data-progress-ring]');
  const number = document.querySelector('[data-progress-ring-number]');
  const announce = document.querySelector('[data-progress-announce]');

  if (ring)    ring.style.strokeDashoffset = offset;
  if (number)  number.textContent = currentDay;
  if (announce) announce.textContent = `Day ${currentDay} of 30. ${completedDays} days completed.`;
}
```

```css
.progress-ring__day {
  font-family: var(--font-heading);
  font-size:   10px;
  fill:        var(--color-text-muted);
  font-weight: var(--weight-medium);
}

.progress-ring__number {
  font-family: var(--font-heading);
  font-size:   22px;
  fill:        var(--color-text-primary);
  font-weight: var(--weight-bold);
}

.progress-ring__fill {
  transition: stroke-dashoffset 600ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

---

### C. Photo Upload

```html
<div class="photo-upload" data-photo-day="1">
  <p class="photo-upload__label">Before photo — Day 1</p>

  <!-- Hidden native file input -->
  <input
    type="file"
    id="photo-input-day1"
    class="sr-only"
    accept="image/*"
    capture="user"
    aria-describedby="photo-input-day1-hint"
    data-photo-input
  >

  <!-- Upload trigger — visible button -->
  <label for="photo-input-day1" class="btn btn--secondary photo-upload__trigger"
         role="button" tabindex="0">
    <i data-lucide="camera" class="icon-md" aria-hidden="true"></i>
    Take / Upload Photo
  </label>
  <p id="photo-input-day1-hint" class="form-helper">
    Photo is saved on your device only — never uploaded to a server.
  </p>

  <!-- Preview — hidden until photo selected -->
  <div class="photo-upload__preview" hidden data-photo-preview>
    <img id="photo-preview-day1" alt="" data-photo-preview-img>
    <div class="cluster" style="margin-top: var(--space-3)">
      <button class="btn btn--ghost btn--sm" data-photo-retake>
        <i data-lucide="camera" aria-hidden="true"></i> Retake
      </button>
      <button class="btn btn--ghost btn--sm" data-photo-delete>
        <i data-lucide="x" aria-hidden="true"></i> Delete
      </button>
    </div>
  </div>
</div>
```

```javascript
// src/js/photoUpload.js
const PhotoUpload = {
  MAX_WIDTH: 800,
  QUALITY:   0.72, // 72% JPEG quality — good balance of size vs clarity

  init() {
    document.querySelectorAll('[data-photo-input]').forEach(input => {
      input.addEventListener('change', (e) => this.handleFile(e.target));
    });
    document.querySelectorAll('[data-photo-delete]').forEach(btn => {
      btn.addEventListener('click', (e) => this.deletePhoto(e.target.closest('[data-photo-day]')));
    });
    this.restoreSavedPhotos();
  },

  handleFile(input) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => this.compress(e.target.result, input);
    reader.readAsDataURL(file);
  },

  compress(dataUrl, input) {
    const img    = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ratio  = Math.min(1, this.MAX_WIDTH / img.width);
      canvas.width  = img.width  * ratio;
      canvas.height = img.height * ratio;
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      const compressed = canvas.toDataURL('image/jpeg', this.QUALITY);
      this.saveAndDisplay(compressed, input);
    };
    img.src = dataUrl;
  },

  saveAndDisplay(dataUrl, input) {
    const wrapper = input.closest('[data-photo-day]');
    const day     = wrapper.dataset.photoDay;
    const preview = wrapper.querySelector('[data-photo-preview]');
    const previewImg = wrapper.querySelector('[data-photo-preview-img]');

    // Save to storage
    const progress = Storage.get('userProgress');
    progress.photos[`day${day}`] = dataUrl;
    Storage.set('userProgress', progress);

    // Show preview
    previewImg.src = dataUrl;
    previewImg.alt = `Your Day ${day} photo`;
    preview.removeAttribute('hidden');
  },

  deletePhoto(wrapper) {
    const day     = wrapper.dataset.photoDay;
    const preview = wrapper.querySelector('[data-photo-preview]');

    const progress = Storage.get('userProgress');
    delete progress.photos[`day${day}`];
    Storage.set('userProgress', progress);

    preview.setAttribute('hidden', '');
    wrapper.querySelector('[data-photo-input]').value = '';
  },

  restoreSavedPhotos() {
    const photos = Storage.get('userProgress')?.photos ?? {};
    for (const [key, dataUrl] of Object.entries(photos)) {
      const day = key.replace('day', '');
      const wrapper = document.querySelector(`[data-photo-day="${day}"]`);
      if (wrapper && dataUrl) {
        const input = wrapper.querySelector('[data-photo-input]');
        this.saveAndDisplay(dataUrl, input);
      }
    }
  }
};
```

---

## 8. Performance Checklist

Run this before every deploy:

- [ ] All `<img>` below the fold have `loading="lazy"` and explicit `width`/`height`
- [ ] Hero image has `loading="eager"` and `fetchpriority="high"`
- [ ] Google Fonts loaded with `preconnect` and `display=swap`
- [ ] All `<script>` tags have `defer`
- [ ] No render-blocking resources in `<head>` (no non-deferred scripts, no unused CSS imports)
- [ ] CSS custom properties file is < 20 KB unminified
- [ ] Total HTML + CSS + JS < 100 KB (check with DevTools Network tab, disable cache)
- [ ] Lighthouse score ≥ 90 on Performance, Accessibility, Best Practices, SEO
- [ ] No console errors or warnings in Chrome, Firefox, Safari

---

## 9. Testing Checklist

### Devices / Browsers

- [ ] iPhone Safari — iOS 15+ (borrow or use BrowserStack)
- [ ] Chrome for Android — Android 10+
- [ ] Chrome Desktop — Windows / Mac
- [ ] Firefox Desktop
- [ ] Edge Desktop

### Feature Tests

- [ ] Checkboxes persist after hard reload (Ctrl+Shift+R)
- [ ] Progress percentage updates immediately on checkbox change
- [ ] Completing all steps on a day triggers the celebration animation
- [ ] Photo upload: captures from camera on mobile, file picker on desktop
- [ ] Photo survives page reload
- [ ] Photo delete removes from storage and hides preview
- [ ] Navigation drawer opens/closes with hamburger button
- [ ] Navigation drawer closes on Escape key
- [ ] Navigation drawer closes on backdrop click
- [ ] All links navigable by keyboard alone (Tab + Enter)
- [ ] Skip-to-content link appears on first Tab keypress
- [ ] Progress ring animates smoothly when updating
- [ ] WhatsApp link opens correct chat with pre-filled message

---

## 10. Deployment Instructions

### A. Netlify (Recommended — Simplest)

No config file needed for a pure HTML/CSS/JS project.

1. Push your code to GitHub
2. Go to https://netlify.com → Add new site → Import from GitHub
3. Select the `goodie-glow-guide` repo
4. Set **Publish directory** to `src`
5. Click Deploy — done. Netlify auto-deploys on every push to `main`.

CLI alternative:
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=src
```

### B. Vercel

```bash
npm install -g vercel
vercel login
vercel --prod
# When prompted: output directory → src
```

Or via Vercel dashboard: import GitHub repo, set Root Directory to `src`.

### C. GitHub Pages (Free, No CLI needed)

1. Go to repo **Settings → Pages**
2. Source: **Deploy from a branch**
3. Branch: `main`, Folder: `/src`
4. Save — site live at `https://johnseyi.github.io/goodie-glow-guide`

> **Note:** GitHub Pages serves from `/src` but asset paths in HTML must be relative (e.g., `./css/styles.css` not `/css/styles.css`) or the sub-folder breaks routing.

---

## 11. Content Data Format

```javascript
// src/data/content.js
// This is the single source of truth for all 30 days of content.
// Each step's `step` field is the ID used in LocalStorage routineChecks.

const days = [
  {
    day:   1,
    week:  1,
    title: 'Fresh Start',
    subtitle: 'This week is all about building the habit.',

    morning: [
      {
        step:         'cleanse',
        product:      'Vitamin C Face Wash',
        duration:     '2 min',
        instructions: 'Wet face with lukewarm water. Apply a small pump, massage in circles for 30 seconds. Rinse thoroughly. Pat dry — never rub.'
      },
      {
        step:         'moisturize',
        product:      'Daily Moisturizer',
        duration:     '1 min',
        instructions: 'While skin is still slightly damp, apply a pea-sized amount and press into skin.'
      },
      {
        step:         'sunscreen',
        product:      'SPF 50 Sunscreen',
        duration:     '30 sec',
        instructions: 'Last step every morning. Apply generously to face and neck — yes, even on cloudy days in Lagos!'
      }
    ],

    night: [
      {
        step:         'cleanse',
        product:      'Vitamin C Face Wash',
        duration:     '2 min',
        instructions: 'Same as morning — remove the day\'s sweat, dust, and sunscreen.'
      },
      {
        step:         'serum',
        product:      'Niacinamide Serum',
        duration:     '1 min',
        instructions: 'Apply 3–4 drops to face. Niacinamide works overnight to even skin tone — your secret weapon.'
      },
      {
        step:         'moisturize',
        product:      'Night Moisturizer',
        duration:     '1 min',
        instructions: 'Seal in the serum. More generous application than morning — night is when your skin repairs itself.'
      }
    ],

    tip:   'Keep it simple this week. Consistency beats perfection — 2 minutes of skincare beats a skipped hour-long routine.',
    avoid: ['Scrubbing hard — your skin is not a pot', 'Hot water — lukewarm only', 'Touching your face after cleansing'],

    // Key used by ImageLoader to fetch Unsplash image
    imageKey: 'morning',

    // Days 1, 10, 20, 30 have photo upload prompt
    hasPhotoPrompt: true,
    photoPromptText: 'Take your Day 1 "before" photo — you\'ll want this on Day 30!'
  }
  // Days 2–30 follow the same structure
];
```

---

## 12. WhatsApp Integration

```javascript
// src/js/whatsapp.js — or inline in app.js

const WHATSAPP_NUMBER = '2348063214942'; // Nigeria international format (234 = +234, drop leading 0)

function getWhatsAppLink(currentDay, customMessage) {
  const defaultMessage = `Hi Goodie! I'm on Day ${currentDay} of the 30-Day Glow Guide and I have a question.`;
  const message = customMessage ?? defaultMessage;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

// Usage — render these links anywhere in the app:
// <a href="..." data-whatsapp-link class="btn btn--primary">
//   Chat on WhatsApp
// </a>

function initWhatsAppLinks() {
  const currentDay = Progress.getCurrentDay();
  document.querySelectorAll('[data-whatsapp-link]').forEach(link => {
    link.href   = getWhatsAppLink(currentDay);
    link.target = '_blank';
    link.rel    = 'noopener noreferrer';
  });
}
```

**WhatsApp link placement:**
- Sticky footer on every day view: *"Question about today? Chat with Goodie →"*
- Troubleshooting page: each problem has a "Ask Goodie directly" link
- 404 / error states: *"Something not right? Let us know →"*
- Day 30 completion screen: *"Tell us about your results! →"*

---

*Last updated: 2026-05-13. Owned by: Goodie Beauty & Skincare. Questions → 08063214942 or @its.goodie on Instagram.*
