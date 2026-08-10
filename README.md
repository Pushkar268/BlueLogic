# BlueLogic Digital (OPC) Pvt. Ltd

Marketing website for BlueLogic Digital, an enterprise IT services partner
(cloud & infrastructure, security & compliance, Microsoft cloud, networking,
surveillance, data recovery, hosting, application development, digital
signatures). Static site, no build step, no framework — deployed as-is via
GitHub Pages.

## Structure
```
index.html          entry point
css/
  tokens.css         design tokens (color, type, spacing, motion)
  base.css           reset + base typography
  components.css     nav, buttons, cards, forms
  sections.css        section layout + responsive rules
  motion.css          reveal states + prefers-reduced-motion
js/
  network-canvas.js   hero background: lightweight canvas node network
  main.js              nav, accordion, GSAP/ScrollTrigger/Lenis scroll storytelling
assets/
  images/              logo (full-res + optimized 256px for UI use)
  icons/               favicons
```

## Local preview
Any static file server works, e.g.:
```
npx http-server . -p 8080
```

## Deploy
Make the deploy script executable and run it:
```
chmod +x deploy.sh
./deploy.sh
```

Contact: info@bluelogicdigital.in
