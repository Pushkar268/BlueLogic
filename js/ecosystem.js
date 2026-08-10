/**
 * Signature "connected ecosystem" diagram: BlueLogic hub with spokes out to
 * the systems it manages as one team instead of eight separate vendors.
 * Built with SVG + GSAP — no WebGL, this doesn't need it.
 */
(function () {
  const svg = document.getElementById('ecosystemSvg');
  if (!svg) return;

  const NODES = [
    { label: 'Cloud', angle: -90 },
    { label: 'Security', angle: -45 },
    { label: 'Network', angle: 0 },
    { label: 'Microsoft', angle: 45 },
    { label: 'Continuity', angle: 90 },
    { label: 'Data', angle: 135 },
    { label: 'Software', angle: 180 },
    { label: 'Devices', angle: -135 },
  ];

  const CENTER = 300;
  const RADIUS = 220;
  const NODE_R = 34;
  const ns = 'http://www.w3.org/2000/svg';

  const spokesGroup = document.getElementById('ecosystemSpokes');
  const nodesGroup = document.getElementById('ecosystemNodes');

  function point(angleDeg, radius) {
    const rad = (angleDeg * Math.PI) / 180;
    return { x: CENTER + radius * Math.cos(rad), y: CENTER + radius * Math.sin(rad) };
  }

  function el(tag, attrs) {
    const node = document.createElementNS(ns, tag);
    Object.keys(attrs).forEach((key) => node.setAttribute(key, attrs[key]));
    return node;
  }

  const ICON_STYLE = {
    fill: 'none',
    stroke: 'var(--signal-0)',
    'stroke-width': '1.5',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  };

  // Simple geometric glyphs built from primitives (no borrowed icon-font
  // paths) — matches the "engineered, not decorative" visual language.
  const ICONS = {
    Cloud(g) {
      g.appendChild(el('circle', { cx: -5, cy: 1, r: 5.5, ...ICON_STYLE }));
      g.appendChild(el('circle', { cx: 3, cy: -2, r: 4, ...ICON_STYLE }));
      g.appendChild(el('rect', { x: -10, y: 1, width: 18, height: 7, rx: 3.5, ...ICON_STYLE }));
    },
    Security(g) {
      g.appendChild(el('path', {
        d: 'M0 -9 L8 -6 V1 C8 6 4 9 0 10.5 C-4 9 -8 6 -8 1 V-6 Z',
        ...ICON_STYLE,
      }));
    },
    Network(g) {
      [[0, -8], [-8, 6], [8, 6]].forEach((c) => g.appendChild(el('circle', { cx: c[0], cy: c[1], r: 3, ...ICON_STYLE })));
      g.appendChild(el('line', { x1: 0, y1: -5, x2: -6, y2: 4, ...ICON_STYLE }));
      g.appendChild(el('line', { x1: 0, y1: -5, x2: 6, y2: 4, ...ICON_STYLE }));
      g.appendChild(el('line', { x1: -5, y1: 6, x2: 5, y2: 6, ...ICON_STYLE }));
    },
    Microsoft(g) {
      [[-6, -6], [1, -6], [-6, 1], [1, 1]].forEach((c) => g.appendChild(el('rect', { x: c[0], y: c[1], width: 5, height: 5, ...ICON_STYLE })));
    },
    Continuity(g) {
      g.appendChild(el('path', { d: 'M8 0a8 8 0 1 1 -2.3 -5.6', ...ICON_STYLE }));
      g.appendChild(el('path', { d: 'M8 -8 V-2 H2', ...ICON_STYLE }));
    },
    Data(g) {
      g.appendChild(el('ellipse', { cx: 0, cy: -6, rx: 7, ry: 3, ...ICON_STYLE }));
      g.appendChild(el('path', { d: 'M-7 -6 V6 C-7 7.7 -3.9 9 0 9 C3.9 9 7 7.7 7 6 V-6', ...ICON_STYLE }));
      g.appendChild(el('path', { d: 'M-7 0 C-7 1.7 -3.9 3 0 3 C3.9 3 7 1.7 7 0', ...ICON_STYLE }));
    },
    Software(g) {
      g.appendChild(el('polyline', { points: '-3,-8 -9,0 -3,8', ...ICON_STYLE }));
      g.appendChild(el('polyline', { points: '3,-8 9,0 3,8', ...ICON_STYLE }));
    },
    Devices(g) {
      g.appendChild(el('rect', { x: -9, y: -8, width: 18, height: 12, rx: 1.5, ...ICON_STYLE }));
      g.appendChild(el('line', { x1: -4, y1: 8, x2: 4, y2: 8, ...ICON_STYLE }));
      g.appendChild(el('line', { x1: 0, y1: 4, x2: 0, y2: 8, ...ICON_STYLE }));
    },
  };

  NODES.forEach((node, i) => {
    const p = point(node.angle, RADIUS);
    const hubEdge = point(node.angle, 54);
    const nodeEdge = point(node.angle, RADIUS - NODE_R);

    const line = document.createElementNS(ns, 'line');
    line.setAttribute('x1', hubEdge.x);
    line.setAttribute('y1', hubEdge.y);
    line.setAttribute('x2', nodeEdge.x);
    line.setAttribute('y2', nodeEdge.y);
    line.setAttribute('data-spoke', i);
    spokesGroup.appendChild(line);

    const circle = document.createElementNS(ns, 'circle');
    circle.setAttribute('cx', p.x);
    circle.setAttribute('cy', p.y);
    circle.setAttribute('r', NODE_R);
    circle.setAttribute('fill', 'var(--surface-1)');
    circle.setAttribute('stroke', 'var(--surface-line-strong)');
    circle.setAttribute('stroke-width', '1.2');
    circle.setAttribute('data-node', i);
    nodesGroup.appendChild(circle);

    const iconGroup = document.createElementNS(ns, 'g');
    iconGroup.setAttribute('transform', `translate(${p.x}, ${p.y})`);
    iconGroup.setAttribute('class', 'node-fade');
    const drawIcon = ICONS[node.label];
    if (drawIcon) drawIcon(iconGroup);
    nodesGroup.appendChild(iconGroup);

    const text = document.createElementNS(ns, 'text');
    text.setAttribute('x', p.x);
    text.setAttribute('y', p.y + (p.y >= CENTER ? NODE_R + 22 : -(NODE_R + 14)));
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', '13');
    text.setAttribute('letter-spacing', '0.04em');
    text.setAttribute('fill', 'var(--ink-1)');
    text.setAttribute('class', 'node-fade');
    text.setAttribute('data-node-label', i);
    text.textContent = node.label.toUpperCase();
    nodesGroup.appendChild(text);
  });

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced || !window.gsap || !window.ScrollTrigger) {
    // Static, fully visible — no draw-in animation needed to convey the diagram.
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  const lines = spokesGroup.querySelectorAll('line');
  const circles = nodesGroup.querySelectorAll('circle[data-node]');
  const fadeEls = nodesGroup.querySelectorAll('.node-fade');

  lines.forEach((line) => {
    const len = line.getTotalLength();
    line.style.strokeDasharray = len;
    line.style.strokeDashoffset = len;
  });
  gsap.set(circles, { scale: 0, transformOrigin: '50% 50%' });
  gsap.set(fadeEls, { opacity: 0 });

  gsap.timeline({
    scrollTrigger: { trigger: svg, start: 'top 75%', once: true },
  })
    .to(lines, { strokeDashoffset: 0, duration: 0.7, stagger: 0.07, ease: 'power2.out' })
    .to(circles, { scale: 1, duration: 0.5, stagger: 0.07, ease: 'back.out(2)' }, '-=0.5')
    .to(fadeEls, { opacity: 1, duration: 0.4, stagger: 0.04 }, '-=0.45');
})();
