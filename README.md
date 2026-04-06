# ODIN — Orbital Decision Intelligence Network

A cinematic, SpaceX-inspired multi-page frontend for an AI-powered Earth–Moon mission control system.

## Project Structure

```
odin/
├── index.html          ← Landing page (Three.js hero globe, scroll storytelling)
├── mission.html        ← Mission control dashboard (live trajectory, telemetry)
├── architecture.html   ← System architecture (Three.js node network)
├── copilot.html        ← AI Copilot panel (terminal, options, weight rings)
├── report.html         ← Final mission report (Three.js scene, charts, logs)
├── css/
│   └── odin.css        ← Shared design system & component library
└── js/
    ├── odin-core.js    ← Cursor, stars, nav, transitions, reveal, count-up
    └── odin-three.js   ← Three.js scene library (globe, node network, trajectory)
```

## Tech Stack

- **HTML5 / CSS3 / Vanilla JavaScript** — no framework dependencies
- **Three.js r128** — 3D scenes (loaded via CDN: cdnjs.cloudflare.com)
- **Google Fonts** — Barlow Condensed, Barlow, Space Mono

## Running Locally

Simply open `index.html` in a browser — no build step required.

For best results use a local server (to avoid CORS on font preloading):
```bash
# Python 3
python -m http.server 8080

# Node.js (npx)
npx serve .
```
Then open: http://localhost:8080

## Pages

| Page | Description |
|------|-------------|
| `index.html` | Landing page with intro loader, Three.js Earth globe, scroll panels |
| `mission.html` | Mission initialization + live telemetry dashboard + trajectory canvas |
| `architecture.html` | 6-layer system architecture + Three.js neural node network |
| `copilot.html` | AI scenario trigger + terminal feed + option cards + adjustable weights |
| `report.html` | Mission outcome + audit log + analytics charts + Three.js trajectory scene |

## Features

- Custom cursor with ring that tracks with easing
- Page transition overlay on every navigation
- Scroll-triggered reveal animations (IntersectionObserver)
- Count-up number animations
- Animated starfield background
- Responsive — works on mobile (burger menu)
- Shared CSS design tokens & component library
