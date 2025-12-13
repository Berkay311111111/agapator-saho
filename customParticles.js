<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Particle.js Full Screen</title>
<style>
  body {
    margin: 0;
    overflow: hidden;
    background: #000; /* Arka plan siyah */
  }
  canvas {
    display: block;
  }
</style>
</head>
<body>

<script>
(function () {
  "use strict";

  const CONFIG = {
    PARTICLE_COUNT: 160,
    PARTICLE_COLOR: "255, 255, 255",
    MAX_DISTANCE: 150,
    MOUSE_RADIUS: 180,
    SPEED: 2.4,
    BACKGROUND_CLEAR: true
  };

  let canvas, ctx, width, height;

  function createCanvas() {
    canvas = document.createElement("canvas");
    canvas.id = "particleCanvas";
    Object.assign(canvas.style, {
      position: "fixed",
      top: "0",
      left: "0",
      zIndex: "1",
      pointerEvents: "none"
    });
    document.body.prepend(canvas);
    ctx = canvas.getContext("2d");
    resizeCanvas();
  }

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

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

  class Particle {
    constructor() { this.reset(); }

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

    draw() {
      ctx.fillStyle = `rgb(${CONFIG.PARTICLE_COLOR})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  let particles = [];

  function createParticles() {
    particles = Array.from({ length: CONFIG.PARTICLE_COUNT }, () => new Particle());
  }

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < CONFIG.MAX_DISTANCE) {
          ctx.strokeStyle = `rgba(${CONFIG.PARTICLE_COLOR},${1 - dist / CONFIG.MAX_DISTANCE})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function connectMouse() {
    if (mouse.x === null) return;
    particles.forEach(p => {
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.hypot(dx, dy);
      if (dist < CONFIG.MOUSE_RADIUS) {
        ctx.strokeStyle = `rgba(${CONFIG.PARTICLE_COLOR},${1 - dist / CONFIG.MOUSE_RADIUS})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(mouse.x, mouse.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
    });
  }

  function clear() {
    ctx.clearRect(0, 0, width, height);
  }

  function update() {
    particles.forEach(p => { p.update(); p.draw(); });
  }

  function animate() {
    if (CONFIG.BACKGROUND_CLEAR) clear();
    update();
    connectParticles();
    connectMouse();
    requestAnimationFrame(animate);
  }

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
</script>

</body>
</html>
