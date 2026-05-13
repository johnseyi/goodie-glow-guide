# Goodie Glow Guide — Design System

The single source of truth for every visual and interaction decision in this project. Read this before writing any CSS, HTML, or UI-related JavaScript.

---

## 1. Brand Colors

Defined as CSS custom properties in `:root`. Never use hex values directly in component CSS — always reference a token.

```css
:root {
  /* — Brand Palette — */
  --color-primary:        #8B6F47; /* Warm brown — buttons, headings, primary actions */
  --color-primary-dark:   #6E5636; /* Hover/active state for primary */
  --color-primary-light:  #A8896A; /* Tinted backgrounds, borders */

  --color-secondary:      #6B8E6F; /* Sage green — success, nature, calm accents */
  --color-secondary-dark: #527056; /* Hover/active state for secondary */
  --color-secondary-light:#8DAF91; /* Tinted backgrounds */

  --color-accent:         #D4AF37; /* Gold — highlights, celebration, rewards */
  --color-accent-dark:    #B8962A; /* Hover/active state for accent */
  --color-accent-light:   #E8CE72; /* Subtle shimmer tints */

  /* — Backgrounds — */
  --color-bg:             #FAF8F5; /* Warm white — page background */
  --color-bg-card:        #FFFFFF; /* Pure white — card surfaces */
  --color-bg-muted:       #F2EDE6; /* Subtle section dividers, inputs */
  --color-bg-overlay:     rgba(139, 111, 71, 0.08); /* Light brown wash */

  /* — Text — */
  --color-text-primary:   #1A1410; /* Near-black — body copy, headings */
  --color-text-secondary: #5C4A36; /* Medium brown — subheadings, captions */
  --color-text-muted:     #9C8670; /* Light — placeholders, disabled states */
  --color-text-inverse:   #FFFFFF; /* On dark backgrounds */

  /* — Semantic — */
  --color-success:        #4A7C59; /* Completion, ticked checkboxes */
  --color-warning:        #C47A2B; /* Cautions, reminders */
  --color-error:          #C0392B; /* Errors, important alerts */
  --color-info:           #2E6DA4; /* Tips, informational notes */

  /* — Borders — */
  --color-border:         #E5DDD4; /* Default border */
  --color-border-focus:   #8B6F47; /* Focus ring */
}
```

### Contrast Ratios (WCAG AA)

| Foreground | Background | Ratio | Pass AA |
|------------|------------|-------|---------|
| `--color-text-primary` `#1A1410` | `--color-bg` `#FAF8F5` | 17.5:1 | ✅ |
| `--color-primary` `#8B6F47` | `--color-bg` `#FAF8F5` | 4.7:1 | ✅ |
| `--color-text-inverse` `#FFFFFF` | `--color-primary` `#8B6F47` | 4.7:1 | ✅ |
| `--color-text-inverse` `#FFFFFF` | `--color-secondary` `#6B8E6F` | 4.6:1 | ✅ |
| `--color-text-primary` `#1A1410` | `--color-bg-card` `#FFFFFF` | 18.9:1 | ✅ |

---

## 2. Typography System

Import in `<head>` before any stylesheet:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

### Font Families

```css
:root {
  --font-heading: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-body:    'Inter',       -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono:    'Courier New', Courier, monospace; /* ingredient lists, codes */
}
```

### Type Scale

```css
:root {
  --text-xs:   0.75rem;   /* 12px — labels, legal */
  --text-sm:   0.875rem;  /* 14px — captions, helper text */
  --text-base: 1rem;      /* 16px — body copy */
  --text-lg:   1.125rem;  /* 18px — lead paragraphs */
  --text-xl:   1.25rem;   /* 20px — card headings */
  --text-2xl:  1.5rem;    /* 24px — section headings */
  --text-3xl:  1.875rem;  /* 30px — page headings */
  --text-4xl:  2.25rem;   /* 36px — hero headings (tablet+) */
  --text-5xl:  3rem;      /* 48px — hero headings (desktop) */
}
```

### Font Weights

```css
:root {
  --weight-regular:   400;
  --weight-medium:    500;
  --weight-semibold:  600;
  --weight-bold:      700;
}
```

### Line Heights

```css
:root {
  --leading-tight:  1.2;  /* Headings */
  --leading-snug:   1.4;  /* Subheadings */
  --leading-normal: 1.6;  /* Body copy */
  --leading-loose:  1.8;  /* Long-form reading text */
}
```

### Usage Rules

| Element | Font | Size (mobile) | Size (desktop) | Weight | Line height |
|---------|------|--------------|----------------|--------|-------------|
| `h1` | Montserrat | `--text-3xl` | `--text-5xl` | 700 | tight |
| `h2` | Montserrat | `--text-2xl` | `--text-4xl` | 700 | tight |
| `h3` | Montserrat | `--text-xl`  | `--text-2xl` | 600 | snug |
| `h4` | Montserrat | `--text-lg`  | `--text-xl`  | 600 | snug |
| Body  | Inter      | `--text-base`| `--text-base`| 400 | normal |
| Caption | Inter    | `--text-sm`  | `--text-sm`  | 400 | normal |
| Label | Montserrat | `--text-xs`  | `--text-xs`  | 600 | tight |

---

## 3. Spacing System

Base unit: **8px**. All spacing values are multiples of this unit.

```css
:root {
  --space-1:  0.25rem;  /* 4px  — micro gaps */
  --space-2:  0.5rem;   /* 8px  — tight spacing */
  --space-3:  0.75rem;  /* 12px — compact spacing */
  --space-4:  1rem;     /* 16px — default gap */
  --space-5:  1.25rem;  /* 20px */
  --space-6:  1.5rem;   /* 24px — card padding */
  --space-8:  2rem;     /* 32px — section gap */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px — large section gap */
  --space-16: 4rem;     /* 64px — hero padding */
  --space-20: 5rem;     /* 80px — page-level padding */
}
```

---

## 4. Component Library

### 4.1 Buttons

Three variants. All share a base:

```css
.btn {
  display:          inline-flex;
  align-items:      center;
  justify-content:  center;
  gap:              var(--space-2);
  padding:          var(--space-3) var(--space-6);
  min-height:       44px;          /* WCAG touch target */
  min-width:        44px;
  border-radius:    8px;
  font-family:      var(--font-heading);
  font-size:        var(--text-base);
  font-weight:      var(--weight-semibold);
  letter-spacing:   0.02em;
  text-decoration:  none;
  cursor:           pointer;
  border:           2px solid transparent;
  transition:       background-color 200ms ease,
                    border-color 200ms ease,
                    transform 100ms ease,
                    box-shadow 200ms ease;
}

.btn:focus-visible {
  outline:        3px solid var(--color-border-focus);
  outline-offset: 3px;
}

.btn:active { transform: scale(0.97); }
```

```css
/* Primary — main CTAs */
.btn--primary {
  background-color: var(--color-primary);
  color:            var(--color-text-inverse);
}
.btn--primary:hover {
  background-color: var(--color-primary-dark);
  box-shadow:       0 4px 16px rgba(139, 111, 71, 0.3);
}

/* Secondary — supporting actions */
.btn--secondary {
  background-color: transparent;
  color:            var(--color-primary);
  border-color:     var(--color-primary);
}
.btn--secondary:hover {
  background-color: var(--color-bg-overlay);
}

/* Ghost — low-emphasis actions */
.btn--ghost {
  background-color: transparent;
  color:            var(--color-text-secondary);
  border-color:     transparent;
}
.btn--ghost:hover {
  background-color: var(--color-bg-muted);
}

/* Size modifiers */
.btn--sm { padding: var(--space-2) var(--space-4); font-size: var(--text-sm); }
.btn--lg { padding: var(--space-4) var(--space-8); font-size: var(--text-lg); }
.btn--full { width: 100%; }
```

---

### 4.2 Cards

```css
/* Base card */
.card {
  background:    var(--color-bg-card);
  border-radius: 16px;
  padding:       var(--space-6);
  box-shadow:    0 2px 12px rgba(26, 20, 16, 0.06);
  border:        1px solid var(--color-border);
}

/* Day card — used for each of the 30 days */
.card--day {
  border-left: 4px solid var(--color-primary);
  position:    relative;
  overflow:    hidden;
}
.card--day.is-complete {
  border-left-color: var(--color-success);
  background:        linear-gradient(135deg, #FFFFFF 0%, #F0F7F1 100%);
}
.card--day.is-locked {
  opacity: 0.6;
  pointer-events: none;
}

/* Product card — for product recommendations */
.card--product {
  display:        flex;
  flex-direction: column;
  gap:            var(--space-3);
}
.card--product__image {
  width:         100%;
  aspect-ratio:  1 / 1;
  object-fit:    cover;
  border-radius: 12px;
  background:    var(--color-bg-muted);
}
.card--product__name {
  font-family:  var(--font-heading);
  font-weight:  var(--weight-semibold);
  font-size:    var(--text-base);
  color:        var(--color-text-primary);
}
.card--product__price {
  font-size:  var(--text-sm);
  color:      var(--color-primary);
  font-weight: var(--weight-semibold);
}
```

---

### 4.3 Checkboxes (Custom Styled)

```css
.checkbox-item {
  display:     flex;
  align-items: flex-start;
  gap:         var(--space-3);
  padding:     var(--space-3) 0;
  cursor:      pointer;
}

.checkbox-item__input {
  appearance:       none;
  -webkit-appearance: none;
  width:            24px;
  height:           24px;
  min-width:        24px;
  border:           2px solid var(--color-border);
  border-radius:    6px;
  background:       var(--color-bg-card);
  cursor:           pointer;
  transition:       background-color 200ms ease, border-color 200ms ease;
  position:         relative;
}

.checkbox-item__input:checked {
  background-color: var(--color-success);
  border-color:     var(--color-success);
}

/* Checkmark via pseudo-element */
.checkbox-item__input:checked::after {
  content:    '';
  position:   absolute;
  top:        4px;
  left:       7px;
  width:      6px;
  height:     11px;
  border:     2px solid white;
  border-top: none;
  border-left: none;
  transform:  rotate(45deg);
}

.checkbox-item__input:focus-visible {
  outline:        3px solid var(--color-border-focus);
  outline-offset: 2px;
}

.checkbox-item__label {
  font-size:   var(--text-base);
  line-height: var(--leading-normal);
  color:       var(--color-text-primary);
  flex:        1;
}

.checkbox-item.is-checked .checkbox-item__label {
  text-decoration: line-through;
  color:           var(--color-text-muted);
}
```

---

### 4.4 Progress Bar

```css
.progress {
  width:         100%;
  height:        8px;
  background:    var(--color-bg-muted);
  border-radius: 100px;
  overflow:      hidden;
}

.progress__fill {
  height:           100%;
  border-radius:    100px;
  background:       linear-gradient(90deg, var(--color-primary) 0%, var(--color-accent) 100%);
  transition:       width 600ms cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-origin: left;
}

/* Large variant — used on the hero/dashboard */
.progress--lg {
  height: 12px;
}

/* Labelled variant */
.progress-labelled {
  display:        flex;
  flex-direction: column;
  gap:            var(--space-2);
}
.progress-labelled__label {
  display:         flex;
  justify-content: space-between;
  font-size:       var(--text-sm);
  font-weight:     var(--weight-medium);
  color:           var(--color-text-secondary);
}
```

---

### 4.5 Navigation

```css
/* Top app bar */
.nav {
  position:         sticky;
  top:              0;
  z-index:          100;
  background:       var(--color-bg-card);
  border-bottom:    1px solid var(--color-border);
  padding:          0 var(--space-4);
  height:           60px;
  display:          flex;
  align-items:      center;
  justify-content:  space-between;
  box-shadow:       0 1px 8px rgba(26, 20, 16, 0.06);
}

.nav__logo {
  font-family:  var(--font-heading);
  font-weight:  var(--weight-bold);
  font-size:    var(--text-lg);
  color:        var(--color-primary);
  text-decoration: none;
}

/* Hamburger button */
.nav__toggle {
  width:            44px;
  height:           44px;
  display:          flex;
  flex-direction:   column;
  justify-content:  center;
  align-items:      center;
  gap:              5px;
  background:       none;
  border:           none;
  cursor:           pointer;
  padding:          var(--space-2);
  border-radius:    8px;
}
.nav__toggle span {
  display:          block;
  width:            22px;
  height:           2px;
  background:       var(--color-text-primary);
  border-radius:    2px;
  transition:       transform 300ms ease, opacity 300ms ease;
}
.nav__toggle[aria-expanded="true"] span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.nav__toggle[aria-expanded="true"] span:nth-child(2) { opacity: 0; }
.nav__toggle[aria-expanded="true"] span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* Mobile drawer */
.nav__drawer {
  position:   fixed;
  inset:      60px 0 0 0;
  background: var(--color-bg-card);
  padding:    var(--space-6);
  transform:  translateX(100%);
  transition: transform 350ms cubic-bezier(0.4, 0, 0.2, 1);
  z-index:    99;
  overflow-y: auto;
}
.nav__drawer.is-open { transform: translateX(0); }

.nav__link {
  display:       block;
  padding:       var(--space-4) 0;
  font-family:   var(--font-heading);
  font-weight:   var(--weight-semibold);
  font-size:     var(--text-lg);
  color:         var(--color-text-primary);
  text-decoration: none;
  border-bottom: 1px solid var(--color-border);
}
.nav__link.is-active { color: var(--color-primary); }

/* Desktop nav — shown at 1024px+ */
@media (min-width: 1024px) {
  .nav__toggle  { display: none; }
  .nav__drawer  {
    position:   static;
    transform:  none;
    background: none;
    padding:    0;
    display:    flex;
    gap:        var(--space-8);
    overflow:   visible;
    inset:      auto;
  }
  .nav__link {
    padding:       var(--space-2) 0;
    font-size:     var(--text-base);
    border-bottom: none;
  }
}
```

---

### 4.6 Form Inputs

```css
.form-group {
  display:        flex;
  flex-direction: column;
  gap:            var(--space-2);
}

.form-label {
  font-family:   var(--font-heading);
  font-size:     var(--text-sm);
  font-weight:   var(--weight-semibold);
  color:         var(--color-text-secondary);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.form-input,
.form-select,
.form-textarea {
  width:            100%;
  padding:          var(--space-3) var(--space-4);
  min-height:       44px;
  background:       var(--color-bg-card);
  border:           2px solid var(--color-border);
  border-radius:    8px;
  font-family:      var(--font-body);
  font-size:        var(--text-base);
  color:            var(--color-text-primary);
  transition:       border-color 200ms ease, box-shadow 200ms ease;
  outline:          none;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  border-color: var(--color-border-focus);
  box-shadow:   0 0 0 3px rgba(139, 111, 71, 0.15);
}

.form-input::placeholder { color: var(--color-text-muted); }

.form-helper {
  font-size: var(--text-sm);
  color:     var(--color-text-muted);
}

.form-error {
  font-size: var(--text-sm);
  color:     var(--color-error);
}
```

---

## 5. Layout System

### Breakpoints

```css
/* Use these in media queries — always mobile-first (min-width) */
:root {
  --bp-sm:  320px;   /* Small phones */
  --bp-md:  768px;   /* Tablets, large phones landscape */
  --bp-lg:  1024px;  /* Laptops, small desktops */
  --bp-xl:  1280px;  /* Wide desktops */
}

/* Usage pattern: */
/* Base styles       → 320px and up  (no media query needed) */
/* @media (min-width: 768px)  → tablet  */
/* @media (min-width: 1024px) → desktop */
/* @media (min-width: 1280px) → wide    */
```

### Containers

```css
.container {
  width:      100%;
  margin:     0 auto;
  padding:    0 var(--space-4);  /* 16px side gutter on mobile */
}

@media (min-width: 768px) {
  .container { padding: 0 var(--space-6); }  /* 24px */
}

@media (min-width: 1024px) {
  .container {
    max-width: 960px;
    padding:   0 var(--space-8);
  }
}

@media (min-width: 1280px) {
  .container { max-width: 1200px; }
}
```

### Grid

```css
/* Auto-responsive card grid */
.grid {
  display:               grid;
  grid-template-columns: 1fr;                        /* 1 col mobile */
  gap:                   var(--space-4);
}

@media (min-width: 768px) {
  .grid { grid-template-columns: repeat(2, 1fr); }  /* 2 col tablet */
}

@media (min-width: 1024px) {
  .grid { grid-template-columns: repeat(3, 1fr); }  /* 3 col desktop */
}

/* Specific grid variants */
.grid--days {
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}
```

---

## 6. Animations

```css
/* Keyframes */
@keyframes fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes slide-in-right {
  from { opacity: 0; transform: translateX(24px); }
  to   { opacity: 1; transform: translateX(0); }
}

@keyframes scale-in {
  from { opacity: 0; transform: scale(0.92); }
  to   { opacity: 1; transform: scale(1); }
}

@keyframes celebration {
  0%   { transform: scale(1)    rotate(0deg); }
  20%  { transform: scale(1.2)  rotate(-8deg); }
  40%  { transform: scale(1.2)  rotate(8deg); }
  60%  { transform: scale(1.1)  rotate(-4deg); }
  80%  { transform: scale(1.05) rotate(4deg); }
  100% { transform: scale(1)    rotate(0deg); }
}

@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 0 0   rgba(212, 175, 55, 0.4); }
  50%       { box-shadow: 0 0 0 12px rgba(212, 175, 55, 0); }
}

/* Utility classes */
.animate-fade-in       { animation: fade-in       400ms ease both; }
.animate-slide-up      { animation: slide-up      500ms ease both; }
.animate-slide-right   { animation: slide-in-right 400ms ease both; }
.animate-scale-in      { animation: scale-in      300ms ease both; }
.animate-celebration   { animation: celebration   600ms ease both; }
.animate-pulse-glow    { animation: pulse-glow    2000ms ease infinite; }

/* Staggered children — add to parent */
.stagger > * { animation: slide-up 500ms ease both; }
.stagger > *:nth-child(1) { animation-delay: 0ms; }
.stagger > *:nth-child(2) { animation-delay: 80ms; }
.stagger > *:nth-child(3) { animation-delay: 160ms; }
.stagger > *:nth-child(4) { animation-delay: 240ms; }
.stagger > *:nth-child(5) { animation-delay: 320ms; }

/* Respect reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration:   0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration:  0.01ms !important;
  }
}

/* Transition tokens for components */
:root {
  --transition-fast:   150ms ease;
  --transition-base:   250ms ease;
  --transition-slow:   400ms ease;
  --transition-spring: 500ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

---

## 7. Accessibility Standards

### Principles

1. **WCAG AA** is the minimum — aim for AA on all text and interactive elements.
2. Every interactive element must be reachable and operable via keyboard alone.
3. Never convey meaning through colour alone — always pair with text, shape, or icon.

### Touch Targets

All tappable elements must be at least **44×44px** — this includes:
- Buttons, links, checkboxes, radio buttons
- Nav icons, close buttons, accordion toggles
- Any `<div>` or `<span>` with an `onclick` handler (use `<button>` instead)

### Focus States

```css
/* Global focus ring — never use outline: none without a replacement */
:focus-visible {
  outline:        3px solid var(--color-border-focus);
  outline-offset: 3px;
  border-radius:  4px;
}

/* Skip link — first element in <body> */
.skip-link {
  position:  absolute;
  top:       -100%;
  left:      var(--space-4);
  padding:   var(--space-2) var(--space-4);
  background: var(--color-primary);
  color:     var(--color-text-inverse);
  border-radius: 0 0 8px 8px;
  font-weight: var(--weight-semibold);
  text-decoration: none;
  z-index:   200;
}
.skip-link:focus { top: 0; }
```

### ARIA Label Approach

```html
<!-- Navigation -->
<nav aria-label="Main navigation">
<button aria-expanded="false" aria-controls="nav-drawer" aria-label="Open menu">

<!-- Progress -->
<div role="progressbar" aria-valuenow="7" aria-valuemin="0" aria-valuemax="30"
     aria-label="Day 7 of 30 complete">

<!-- Checkboxes in a routine -->
<fieldset>
  <legend>Morning Routine — Day 1</legend>
  <label><input type="checkbox" aria-describedby="step-1-hint"> Cleanse face</label>
  <p id="step-1-hint" class="form-helper">Use lukewarm water, 60 seconds</p>
</fieldset>

<!-- Day card state -->
<article aria-label="Day 1" aria-describedby="day-1-status">
<p id="day-1-status" class="sr-only">Completed</p>
```

### Visually Hidden Utility

```css
.sr-only {
  position:   absolute;
  width:      1px;
  height:     1px;
  padding:    0;
  margin:     -1px;
  overflow:   hidden;
  clip:       rect(0, 0, 0, 0);
  white-space: nowrap;
  border:     0;
}
```

---

## 8. Image Guidelines

### Photography Style

- **Skin tone:** Deep, rich African skin tones — not lightened or filtered
- **Lighting:** Natural daylight or soft warm indoor light — no harsh flash
- **Setting:** Real home environments — bathroom counter, bedroom vanity, outdoor porch
- **Expression:** Confident, relaxed, joyful — no posed or stiff expressions
- **Diversity:** Range of Nigerian and Ugandan faces, ages 18–45

### Unsplash Search Terms

```
african woman skincare
nigerian beauty skin
black woman moisturizer
dark skin glow natural
ugandan woman beauty
natural hair skincare
```

### Optimisation

```html
<!-- WebP with JPEG fallback -->
<picture>
  <source srcset="images/hero.webp" type="image/webp">
  <img src="images/hero.jpg" alt="[descriptive alt text]"
       width="800" height="600" loading="lazy" decoding="async">
</picture>

<!-- Hero image — load eagerly (above the fold) -->
<img src="images/hero.jpg" alt="..." loading="eager" fetchpriority="high">

<!-- All other images — lazy load -->
<img src="images/product.jpg" alt="..." loading="lazy">
```

### Alt Text Requirements

- Describe **what is in the image** from the user's perspective, not just filename
- Include skin tone when relevant to content: *"Woman with deep brown skin applying serum to cheek"*
- Decorative images only: `alt=""`
- Never: `alt="image"`, `alt="photo"`, `alt="IMG_0234"`

---

## 9. Icon System

We use **Lucide Icons** — loaded from CDN, used as inline SVG for styling flexibility.

```html
<!-- CDN import (add to <head>) -->
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js" defer></script>

<!-- Usage — data-lucide attribute, JS replaces with SVG -->
<i data-lucide="check" aria-hidden="true"></i>
<span class="sr-only">Completed</span>

<!-- Initialise after DOM ready -->
<script>
  document.addEventListener('DOMContentLoaded', () => lucide.createIcons());
</script>
```

### Icon Inventory

| Icon name | Used for |
|-----------|----------|
| `check` | Checkbox tick, completion state |
| `check-circle` | Day completion badge |
| `sun` | Morning routine |
| `moon` | Night routine |
| `droplet` | Hydration steps, serums |
| `sparkles` | Special treatment, glow tip |
| `alert-circle` | Warnings, what to avoid |
| `info` | Tips, informational notes |
| `camera` | Photo upload / before-after |
| `share-2` | Social sharing |
| `download` | PDF export |
| `menu` | Mobile nav toggle |
| `x` | Close, dismiss |
| `chevron-right` | Navigation arrow, list item |
| `lock` | Locked day (not yet unlocked) |
| `trophy` | Day 30 completion reward |
| `calendar` | Programme overview |
| `phone` | WhatsApp contact |
| `instagram` | Instagram link |

### Icon Sizing

```css
.icon-sm  { width: 16px; height: 16px; }
.icon-md  { width: 20px; height: 20px; }  /* default */
.icon-lg  { width: 24px; height: 24px; }
.icon-xl  { width: 32px; height: 32px; }

/* Icons inherit currentColor — set colour via parent or utility */
.icon-primary   { color: var(--color-primary); }
.icon-success   { color: var(--color-success); }
.icon-muted     { color: var(--color-text-muted); }
```

---

## 10. Design References

### 10.1 Fenty Skin

**What works:** Bold, unapologetic typography. Zero visual clutter. Mobile nav hides/shows cleanly on scroll. Product cards are minimal but image-forward.

**Patterns to adopt:**
- Full-width hero with large heading + single CTA
- Sticky nav that compresses on scroll (`box-shadow` appears as user scrolls down)
- Product card: square image, name, price, "Add" action — nothing else
- Bold section headings in all-caps Montserrat

**Goodie adaptation:** Replace stark white backgrounds with our warm `#FAF8F5`. Keep the confidence, add warmth.

---

### 10.2 Glossier

**What works:** Generous whitespace. Pastel palette. Editorial mixing of product shots and lifestyle photography. Copy feels like a best friend wrote it.

**Patterns to adopt:**
- Large breathing room between sections (`padding: var(--space-16) 0`)
- Two-column split: text left, image right (reversed on mobile to image-top)
- Ingredient/tip callouts in soft-coloured pill badges
- Progress feels organic — no harsh dividers, everything flows

**Goodie adaptation:** Swap the pink-white tones for our warm brown/sage. Keep the "friend" voice in all copy — this is where our *"Lock in that glow!"* tone lives.

---

### 10.3 Curology

**What works:** Step-by-step journey UI makes a complex routine feel achievable. Progress tracking is always visible. Before/after section is clearly structured and non-gimmicky.

**Patterns to adopt:**
- Vertical timeline for the 30-day programme — each day is a node on the line
- Persistent progress bar at the top of every day view
- Before/after: side-by-side cards with date labels, not a slider (simpler, more accessible)
- "Week X of 4" grouping to make 30 days feel smaller

**Goodie adaptation:** Use our warm brown as the timeline line colour. Completed nodes: sage green with gold tick. Locked nodes: muted grey.

---

### 10.4 Headspace

**What works:** Daily programme structure is the gold standard. Streak mechanics keep users coming back. Soft illustration style feels approachable, not clinical. Completion animations (confetti, glow) make finishing a session feel genuinely rewarding.

**Patterns to adopt:**
- "Today's session" — always surface the current day prominently on the dashboard
- Streak counter: *"You're on a 5-day streak — keep going!"*
- Completion micro-animation: run `animate-celebration` on the day card when all steps are checked
- Lock days in the future (optional) — unlock daily to build habit
- Summary screen at the end of a day: what you did, encouragement, what's next

**Goodie adaptation:** Replace Headspace's meditation metaphors with skincare language. *"Your skin just got 3 steps closer to its glow."* Use gold `--color-accent` for all completion/reward moments.

---

## 11. Mobile-First Approach

### Design Order

1. **Design at 320px** — if it works here, it works everywhere
2. **Enhance at 768px** — introduce two columns, larger type
3. **Enhance at 1024px** — desktop nav, three columns, generous padding
4. **Enhance at 1280px** — max-width container, wider spacing

### Touch Interaction Rules

- No hover-only interactions — everything touch-first, hover as enhancement
- Swipe gestures only if also button-accessible (never swipe-only)
- Bottom navigation bar for key actions on mobile (Day, Progress, Contact)
- Tap targets separated by at least 8px to prevent mis-taps

### Bottom Navigation (Mobile Only)

```css
.bottom-nav {
  position:         fixed;
  bottom:           0;
  left:             0;
  right:            0;
  height:           64px;
  background:       var(--color-bg-card);
  border-top:       1px solid var(--color-border);
  display:          flex;
  justify-content:  space-around;
  align-items:      center;
  padding-bottom:   env(safe-area-inset-bottom); /* iPhone home bar */
  z-index:          90;
  box-shadow:       0 -2px 16px rgba(26, 20, 16, 0.06);
}

.bottom-nav__item {
  display:        flex;
  flex-direction: column;
  align-items:    center;
  gap:            var(--space-1);
  min-width:      44px;
  min-height:     44px;
  justify-content: center;
  color:          var(--color-text-muted);
  text-decoration: none;
  font-size:      var(--text-xs);
  font-weight:    var(--weight-semibold);
  font-family:    var(--font-heading);
}

.bottom-nav__item.is-active { color: var(--color-primary); }

@media (min-width: 1024px) {
  .bottom-nav { display: none; }
}
```

---

## 12. Performance Budget

| Resource | Budget | Strategy |
|----------|--------|----------|
| Total initial HTML + CSS + JS | < 100 KB | Minify for production, no frameworks |
| Hero image | < 80 KB | WebP, 800px wide max, 75% quality |
| Other images | < 40 KB each | WebP, lazy loaded |
| Google Fonts | ~30 KB | Preconnect, `display=swap`, subset if needed |
| Lucide Icons | ~15 KB | CDN, `defer`, only load on DOMContentLoaded |
| First Contentful Paint | < 1.5 s | Critical CSS inline in `<head>` |
| Time to Interactive | < 2 s | Defer all JS, no render-blocking resources |

### Critical CSS

Inline the minimum CSS needed to render above-the-fold content in a `<style>` tag in `<head>`. This includes: CSS variables, base reset, nav, hero text, and hero button. Everything else loads from the external stylesheet.

### JavaScript Loading Pattern

```html
<!-- All JS files go at end of <body>, deferred -->
<script src="js/app.js" defer></script>
<script src="js/progressTracker.js" defer></script>

<!-- Third-party scripts — defer and load last -->
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js" defer></script>
```

---

*Last updated: 2026-05-13. Owned by: Goodie Beauty & Skincare. Questions → 08063214942 or @its.goodie on Instagram.*
