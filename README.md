# Goodie Glow Guide ✨

An interactive 30-day skincare routine guide tailored for the African market. Built to help users build consistent, effective skincare habits with locally accessible products and expert-curated daily routines.

---

## Features

- **30-Day Structured Programme** — Daily AM and PM routines with clear step-by-step instructions
- **Locally Relevant Products** — Recommendations suited to African skin tones, climate, and product availability
- **Progress Tracker** — Mark completed days and track your skincare journey
- **Skin Type Quiz** — Personalised routine suggestions based on your skin type
- **Ingredient Glossary** — Plain-language explanations of common skincare ingredients
- **Responsive Design** — Works seamlessly on mobile, tablet, and desktop
- **Access Control** — Simple code-based gate for paid customers; no backend needed

---

## Tech Stack

| Layer      | Technology          |
|------------|---------------------|
| Markup     | HTML5               |
| Styling    | CSS3 (custom, no frameworks) |
| Logic      | Vanilla JavaScript (ES6+) |
| Storage    | LocalStorage (progress tracking) |

---

## Quick Start

```bash
npm start   # serves at http://localhost:3000 — Chrome file:// restrictions require a server
```

Or install once globally: `npm install -g http-server` then `http-server src -p 3000 -o`.

---

## Access Control

The guide requires an access code. Customers see a full-screen gate until they enter a valid code, which is then saved to localStorage so they stay unlocked.

> **Note:** Valid codes are kept out of this README and version history — see the maintainer for current codes. Codes are case-insensitive.

### Changing Codes

1. Open `src/js/app.js`
2. Edit the `validCodes` array in `AccessControl` (not committed with real values in this repo's history going forward)
3. Deploy — customers with old codes will need the new one

> **Known limitation:** this is a client-side-only gate (no backend), so the active codes are always visible to anyone who opens browser dev tools on the live site. It stops casual sharing but isn't real security. If that ever matters more than convenience, move validation to a small serverless function so codes never ship to the client.

### Generating a Code for One Customer

Open your browser console **on the deployed site** and run:

```javascript
AccessControl.generateCode("Customer Name")
// Prints: Code for Customer Name: GOODIEABC123
```

Copy the printed code and send it to that customer. Note: generated codes exist only in your browser session — for a permanent code, add it to `validCodes[]` and redeploy.

### Revoking Access

Run in the customer's browser:
```javascript
AccessControl.revokeAccess()
```
Or ask them to clear their browser's site data. To revoke everyone at once, change or remove the old master codes and redeploy.

---

---

## Project Structure

```
goodie-glow-guide/
├── src/
│   ├── index.html          # App entry point
│   ├── css/                # Stylesheets
│   ├── js/                 # JavaScript modules
│   ├── images/             # Photo and icon assets
│   └── data/               # Routine content (JSON / JS)
├── assets/                 # Brand materials (logos, fonts)
├── docs/                   # Documentation and guides
├── .gitignore
└── README.md
```

---

## Contact

| Channel     | Details                      |
|-------------|------------------------------|
| Phone       | 08063214942                  |
| Instagram   | [@Its_g.o.o.d.i.e](https://instagram.com/Its_g.o.o.d.i.e) |

---

*Built with love for glowing skin. 🌿*
