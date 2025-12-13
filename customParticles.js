(function () {
  "use strict";

  /* ================= CONFIG ================= */
  const CONFIG = {
    PARTICLE_COUNT: 160,
    PARTICLE_COLOR: "255,255,255",
    MAX_DISTANCE: 150,
    MOUSE_RADIUS: 180,
    SPEED: 2.4,
    BACKGROUND_CLEAR: true,
    COLOR_CHANGE_SPEED: 0.5 // renk değişim hızı
  };

  /* ================= CANVAS ================= */
  let canvas, ctx, width, height;

  function createCanvas() {
    canvas = document.createElement("canvas");
    canvas.id = "particleCanvas";
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.zIndex = "0";
    canvas.style.pointerEvents = "none";
    document.body.prepend(canvas);

    ctx = canvas.getContext("2d");
    resizeCanvas();
  }

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  /* ================= MOUSE ================= */
  const mouse = { x: null, y: null };

  function initMouse() {
    window.addEventListener("mousemove", e => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener("mouseleave", () => {
      mouse.x = null;
      mouse.y = null;
    });
  }

  /* ================= PARTICLE ================= */
  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.r = Math.random() * 2 + 1;
      this.vx = (Math.random() - 0.5) * CONFIG.SPEED;
      this.vy = (Math.random() - 0.5) * CONFIG.SPEED;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x <= 0 || this.x >= width) this.vx *= -1;
      if (this.y <= 0 || this.y >= height) this.vy *= -1;
    }

    draw(color) {
      ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},0.8)`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /* ================= SYSTEM ================= */
  let particles = [];

  function createParticles() {
    particles = [];
    for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }
  }

  /* ================= CONNECTIONS ================= */
  function connectParticles(color) {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONFIG.MAX_DISTANCE) {
          ctx.strokeStyle = `rgba(${color.r},${color.g},${color.b},${1 - dist / CONFIG.MAX_DISTANCE})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function connectMouse(color) {
    if (mouse.x === null) return;

    particles.forEach(p => {
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < CONFIG.MOUSE_RADIUS) {
        ctx.strokeStyle = `rgba(${color.r},${color.g},${color.b},${1 - dist / CONFIG.MOUSE_RADIUS})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(mouse.x, mouse.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
    });
  }

  /* ================= COLOR ================= */
  let hue = 0;
  function getColor() {
    hue += CONFIG.COLOR_CHANGE_SPEED;
    if (hue > 360) hue = 0;
    const c = hslToRgb(hue / 360, 0.7, 0.5);
    return { r: c[0], g: c[1], b: c[2] };
  }

  function hslToRgb(h, s, l) {
    let r, g, b;

    if (s == 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r*255), Math.round(g*255), Math.round(b*255)];
  }

  /* ================= ROTATING TOP ================= */
  let topAngle = 0;
  function drawRotatingTop(color) {
    const radius = 30;
    const cx = width - 60;
    const cy = 60;
    topAngle += 0.02;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(topAngle);

    ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},0.6)`;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /* ================= LOOP ================= */
  function clear() {
    ctx.clearRect(0, 0, width, height);
  }

  function update(color) {
    particles.forEach(p => {
      p.update();
      p.draw(color);
    });
  }

  function animate() {
    if (CONFIG.BACKGROUND_CLEAR) clear();

    const color = getColor();
    update(color);
    connectParticles(color);
    connectMouse(color);
    drawRotatingTop(color);

    requestAnimationFrame(animate);
  }

  /* ================= INIT ================= */
  function init() {
    createCanvas();
    createParticles();
    initMouse();
    window.addEventListener("resize", resizeCanvas);
    animate();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
