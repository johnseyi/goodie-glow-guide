# CLAUDE.md — Goodie Glow Guide

Master instruction guide for all AI assistants working on this project. Read this before writing any code, copy, or design decisions.

---

## 1. PROJECT OVERVIEW

- **Project name:** Goodie Glow Guide
- **Purpose:** Interactive 30-day skincare routine guide
- **Target audience:** Nigerian and Ugandan customers
- **Brand:** Goodie Beauty & Skincare

---

## 2. DESIGN PHILOSOPHY

- Warm, welcoming aesthetic reflecting African beauty
- Mobile-first — 80% of users are on phones
- Clean, professional but approachable
- Celebration of natural African skin tones
- Trust-building and educational

---

## 3. BRAND IDENTITY

| Token       | Value                              |
|-------------|------------------------------------|
| Primary     | `#8B6F47` — warm brown             |
| Secondary   | `#6B8E6F` — sage green             |
| Accent      | `#D4AF37` — gold                   |
| Background  | `#FAF8F5` — warm white / off-white |
| Heading font| Montserrat                         |
| Body font   | Inter                              |

**Tone:** Friendly, encouraging, culturally aware.

---

## 4. TECHNICAL STANDARDS

- Pure HTML5, CSS3, Vanilla JavaScript — no frameworks
- Mobile-first responsive design
- Accessibility: WCAG AA compliance
- Performance: <100 KB initial load, <2 s first paint
- Browser support: last 2 versions of modern browsers
- LocalStorage for data persistence

---

## 5. CODE STANDARDS

- Semantic HTML5 elements
- BEM methodology for CSS classes
- ES6+ JavaScript features
- Modular, commented code
- Naming: `camelCase` for JS, `kebab-case` for CSS
- 2-space indentation

---

## 6. CONTENT VOICE

- Warm and friendly — like talking to a trusted friend
- Culturally relevant (Nigerian/Ugandan context)
- Encouraging and supportive
- Educational without being preachy

**Example:** Say *"Lock in that glow!"* not *"Apply moisturizer for hydration."*

---

## 7. FEATURES REQUIRED

- Interactive 30-day programme (Days 1–30)
- Progress tracking with checkboxes
- LocalStorage for saving progress
- Photo upload for before/after tracking
- Product usage guide
- Troubleshooting section
- PDF export capability
- WhatsApp contact integration
- Mobile responsive design
- Offline-capable (PWA — optional)

---

## 8. COMPONENT PRIORITIES

**Priority 1 — MVP**
- Landing page
- Days 1–7 with full interactivity
- Progress tracker
- Basic navigation

**Priority 2 — Enhancement**
- Days 8–30
- Photo upload feature
- Product guide
- Troubleshooting section

**Priority 3 — Polish**
- PDF export
- Social sharing
- Push notifications
- Dark mode

---

## 9. DESIGN REFERENCES

Study these for inspiration before starting UI work:

| Site | What to borrow |
|------|---------------|
| Fenty Skin (fentyskin.com) | Bold, clean, mobile-first layout |
| Glossier (glossier.com) | Soft feel, approachable, generous whitespace |
| Curology (curology.com) | Step-by-step journey, progress tracking |
| Headspace (headspace.com) | Daily programme structure, completion rewards |

---

## 10. IMAGE GUIDELINES

- Authentic African beauty — dark skin tones
- Natural lighting, not harsh studio shots
- Real lifestyle settings
- Diverse Nigerian/Ugandan representation
- Unsplash search terms: `"African woman skincare"`, `"Nigerian beauty"`, `"Black skincare"`

---

## 11. ACCESSIBILITY REQUIREMENTS

- All interactive elements minimum 44×44 px touch targets
- Colour contrast ratio 4.5:1 minimum
- Keyboard navigation support
- Screen reader friendly (ARIA labels)
- Alt text for all images
- Visible focus indicators

---

## 12. PERFORMANCE REQUIREMENTS

- Images lazy loaded
- WebP format with JPEG/PNG fallbacks
- Minified CSS/JS for production
- Deferred JavaScript loading
- Optimised font loading
- Service worker for offline (optional)

---

## 13. CONTENT STRUCTURE — DAILY FORMAT

Each day must include:

- Day number and week indicator
- Morning routine (with checkboxes)
- Night routine (with checkboxes)
- Today's tip / focus
- What to avoid
- Visual progress indicator
- Optional: special treatment (masks, home remedies)

---

## 14. LOCALIZATION NOTES

- Use local context: *"Lagos hustle"*, *"Kampala traffic"*
- Provide local product alternatives where possible
- Account for local climate (hot weather, strong sun)
- Currency in Naira (₦) when relevant
- Phone format: `08063214942` (WhatsApp-ready)

---

## 15. DON'T DO THIS

- Use frameworks (React, Vue, etc.) — keep it vanilla
- Pull in external dependencies unless absolutely necessary
- Use stock "diversity" photos — authentic African beauty only
- Give generic skincare advice — make it Goodie-specific
- Build complicated navigation — keep it simple
- Auto-play videos or sounds
- Add pop-ups or intrusive elements

---

## 16. ALWAYS DO THIS

- Test on mobile viewport first
- Include loading states for all async operations
- Provide clear error messages with solutions
- Save user progress automatically
- Show visual feedback for all user actions
- Make contact options prominent (WhatsApp: `08063214942`)
- Celebrate user progress and completion
- Keep the interface clean and uncluttered

---

## 17. GITHUB WORKFLOW

- `main` branch: production-ready code only
- Feature branches: `feature/description-name`
- Commit message format: `type(scope): description`
  - `feat(navigation): add mobile menu`
  - `fix(progress): resolve localStorage bug`
- Pull request required for all features
- Code review before merge

---

## 18. TESTING CHECKLIST

Before marking any feature done:

- [ ] Works on mobile (320 px minimum width)
- [ ] Works on tablet (768 px)
- [ ] Works on desktop (1024 px+)
- [ ] Accessible via keyboard
- [ ] Screen reader compatible
- [ ] Fast load time (<2 s)
- [ ] No console errors
- [ ] LocalStorage persists correctly

---

## 19. FILE NAMING CONVENTIONS

| Type       | Convention  | Example                        |
|------------|-------------|--------------------------------|
| HTML       | kebab-case  | `index.html`, `about-us.html`  |
| CSS        | kebab-case  | `styles.css`, `mobile-nav.css` |
| JavaScript | camelCase   | `app.js`, `progressTracker.js` |
| Images     | kebab-case  | `hero-image.jpg`, `day-1-morning.jpg` |
| Data files | camelCase   | `content.js`, `userData.js`    |

---

## 20. WHEN IN DOUBT

- Prioritise user experience over aesthetics
- Choose simplicity over complexity
- Mobile experience trumps desktop
- Accessibility is non-negotiable
- Performance matters more than features
- Ask the user before making major decisions

---

## FINAL NOTE

This is a real project for real customers in Nigeria and Uganda. Every decision should serve one goal: helping them complete their 30-day skincare journey successfully.

**Contact:** Goodie Beauty & Skincare — `08063214942` — [@its.goodie](https://instagram.com/its.goodie) on Instagram
