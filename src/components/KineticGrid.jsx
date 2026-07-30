import { useCallback, useEffect, useRef } from 'react';

const CELL_SIZE = 55;
const INFLUENCE_RADIUS = 260;
const MAX_WARP = 24;
const DOT_SPACING = 28;
const LERP_SPEED = 0.08;
const LINE_BASE = { r: 255, g: 255, b: 255, a: 0.075 };
const NODE_BASE_RADIUS = 1.25;
const NODE_ACTIVE_RADIUS = 2.7;
const OFFSCREEN = { x: -9999, y: -9999 };

function lerp(a, b, amount) {
  return a + (b - a) * amount;
}

function lerpColor(base, active, amount) {
  const r = Math.round(lerp(base.r, active.r, amount));
  const g = Math.round(lerp(base.g, active.g, amount));
  const b = Math.round(lerp(base.b, active.b, amount));
  const a = lerp(base.a, active.a, amount);
  return `rgba(${r}, ${g}, ${b}, ${a.toFixed(3)})`;
}

/**
 * Full-page interactive canvas background. It stays behind site content,
 * warps around the pointer, and emits a subtle ripple on click.
 */
export default function KineticGrid() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ ...OFFSCREEN });
  const targetMouseRef = useRef({ ...OFFSCREEN });
  const ripplesRef = useRef([]);
  const frameRef = useRef(0);
  const sizeRef = useRef({ width: 0, height: 0, pixelRatio: 1 });

  const getWarpedPoint = useCallback((gridX, gridY, col, row, mouse, ripples, columns, rows) => {
    const edgeMargin = 1.5;
    const colPin = Math.min(col / edgeMargin, (columns - 1 - col) / edgeMargin, 1);
    const rowPin = Math.min(row / edgeMargin, (rows - 1 - row) / edgeMargin, 1);
    const pinFactor = colPin * colPin * rowPin * rowPin;

    const dx = gridX - mouse.x;
    const dy = gridY - mouse.y;
    const distance = Math.hypot(dx, dy);
    const proximity = Math.max(0, 1 - distance / INFLUENCE_RADIUS) * pinFactor;

    let rippleX = 0;
    let rippleY = 0;

    for (const ripple of ripples) {
      const rippleDx = gridX - ripple.x;
      const rippleDy = gridY - ripple.y;
      const rippleDistance = Math.hypot(rippleDx, rippleDy);
      const waveWidth = 55;
      const difference = rippleDistance - ripple.radius;

      if (Math.abs(difference) < waveWidth && rippleDistance > 0) {
        const strength = (1 - Math.abs(difference) / waveWidth) * ripple.opacity * 18 * pinFactor;
        const angle = Math.atan2(rippleDy, rippleDx);
        const direction = difference < 0 ? -1 : 1;
        rippleX += Math.cos(angle) * strength * direction * -1;
        rippleY += Math.sin(angle) * strength * direction * -1;
      }
    }

    if (distance < INFLUENCE_RADIUS && distance > 0 && pinFactor > 0) {
      const ratio = distance / INFLUENCE_RADIUS;
      const eased = ratio < 0.01 ? 0 : (1 - ratio) ** 2 * Math.min(1, distance / 60);
      const warpAmount = eased * MAX_WARP * pinFactor;
      const angle = Math.atan2(dy, dx);

      return {
        point: {
          x: gridX - Math.cos(angle) * warpAmount + rippleX,
          y: gridY - Math.sin(angle) * warpAmount + rippleY,
        },
        proximity,
      };
    }

    return { point: { x: gridX + rippleX, y: gridY + rippleY }, proximity };
  }, []);

  const draw = useCallback((now) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const { width, height, pixelRatio } = sizeRef.current;
    const mouse = mouseRef.current;
    const ripples = ripplesRef.current;
    const theme = {
      lineActive: { r: 83, g: 103, b: 255, a: 0.78 },
      nodeActive: { r: 135, g: 148, b: 255, a: 0.95 },
      glow: '83,103,255',
      ripple: '122,138,255',
    };

    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.clearRect(0, 0, width, height);

    context.fillStyle = 'rgba(238,241,255,0.032)';
    for (let x = DOT_SPACING / 2; x < width; x += DOT_SPACING) {
      for (let y = DOT_SPACING / 2; y < height; y += DOT_SPACING) {
        context.beginPath();
        context.arc(x, y, 0.55, 0, Math.PI * 2);
        context.fill();
      }
    }

    for (let index = ripples.length - 1; index >= 0; index -= 1) {
      const ripple = ripples[index];
      const age = (now - ripple.born) / 1000;
      ripple.radius = Math.max(0, age * 400);
      ripple.opacity = Math.max(0, 1 - age * 1.2);
      if (ripple.opacity <= 0) ripples.splice(index, 1);
    }

    const columns = Math.max(2, Math.ceil(width / CELL_SIZE)) + 1;
    const rows = Math.max(2, Math.ceil(height / CELL_SIZE)) + 1;
    const cellWidth = width / (columns - 1);
    const cellHeight = height / (rows - 1);
    const points = [];
    const proximity = [];

    for (let row = 0; row < rows; row += 1) {
      points[row] = [];
      proximity[row] = [];
      for (let col = 0; col < columns; col += 1) {
        const warped = getWarpedPoint(col * cellWidth, row * cellHeight, col, row, mouse, ripples, columns, rows);
        points[row][col] = warped.point;
        proximity[row][col] = warped.proximity;
      }
    }

    const drawSegment = (start, end, startProximity, endProximity) => {
      const average = (startProximity + endProximity) / 2;
      const amount = average * average * (3 - 2 * average);
      context.beginPath();
      context.moveTo(start.x, start.y);
      context.lineTo(end.x, end.y);
      context.strokeStyle = lerpColor(LINE_BASE, theme.lineActive, amount);
      context.lineWidth = lerp(0.65, 1.35, amount);
      context.stroke();
    };

    context.lineCap = 'butt';
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < columns - 1; col += 1) {
        drawSegment(points[row][col], points[row][col + 1], proximity[row][col], proximity[row][col + 1]);
      }
    }
    for (let col = 0; col < columns; col += 1) {
      for (let row = 0; row < rows - 1; row += 1) {
        drawSegment(points[row][col], points[row + 1][col], proximity[row][col], proximity[row + 1][col]);
      }
    }

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < columns; col += 1) {
        const point = points[row][col];
        const amount = proximity[row][col] ** 2 * (3 - 2 * proximity[row][col]);
        const radius = lerp(NODE_BASE_RADIUS, NODE_ACTIVE_RADIUS, amount);

        if (amount > 0.3) {
          const glowRadius = radius + lerp(0, 6, (amount - 0.3) / 0.7);
          const gradient = context.createRadialGradient(point.x, point.y, radius * 0.5, point.x, point.y, glowRadius);
          gradient.addColorStop(0, `rgba(${theme.glow},${(amount * 0.28).toFixed(3)})`);
          gradient.addColorStop(1, `rgba(${theme.glow},0)`);
          context.beginPath();
          context.arc(point.x, point.y, glowRadius, 0, Math.PI * 2);
          context.fillStyle = gradient;
          context.fill();
        }

        context.beginPath();
        context.arc(point.x, point.y, radius, 0, Math.PI * 2);
        context.fillStyle = lerpColor({ r: 255, g: 255, b: 255, a: 0.12 }, theme.nodeActive, amount);
        context.fill();
      }
    }

    for (const ripple of ripples) {
      context.beginPath();
      context.arc(ripple.x, ripple.y, Math.max(0, ripple.radius), 0, Math.PI * 2);
      context.strokeStyle = `rgba(${theme.ripple},${(ripple.opacity * 0.22).toFixed(3)})`;
      context.lineWidth = 1.25;
      context.stroke();
    }
  }, [getWarpedPoint]);

  const animate = useCallback((now) => {
    mouseRef.current.x = lerp(mouseRef.current.x, targetMouseRef.current.x, LERP_SPEED);
    mouseRef.current.y = lerp(mouseRef.current.y, targetMouseRef.current.y, LERP_SPEED);
    draw(now);
    frameRef.current = window.requestAnimationFrame(animate);
  }, [draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const setSize = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      sizeRef.current = { width, height, pixelRatio };
    };

    const onPointerMove = (event) => {
      targetMouseRef.current = { x: event.clientX, y: event.clientY };
    };

    const onClick = (event) => {
      ripplesRef.current.push({
        x: event.clientX,
        y: event.clientY,
        radius: 0,
        opacity: 1,
        born: performance.now(),
      });
    };

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const start = () => {
      window.cancelAnimationFrame(frameRef.current);
      if (reducedMotion.matches) draw(performance.now());
      else frameRef.current = window.requestAnimationFrame(animate);
    };

    setSize();
    start();
    window.addEventListener('resize', setSize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('click', onClick);
    reducedMotion.addEventListener?.('change', start);

    return () => {
      window.removeEventListener('resize', setSize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('click', onClick);
      reducedMotion.removeEventListener?.('change', start);
      window.cancelAnimationFrame(frameRef.current);
    };
  }, [animate, draw]);

  return <canvas ref={canvasRef} className="kinetic-grid" aria-hidden="true" />;
}
