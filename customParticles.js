(function () {
  "use strict";

  /* ================= CONFIG ================= */
  const CONFIG = {
    PARTICLE_COUNT: 160,
    PARTICLE_COLOR: "255,77,77", // başlangıç kırmızı
    MAX_DISTANCE: 150,
    MOUSE_RADIUS: 180,
    SPEED: 1.4,
    BACKGROUND_CLEAR: true
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
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.r = Math.random() * 2 + 1;
      this.vx = (Math.random() - 0.5) * CONFIG.SPEED;
      this.vy = (Math.random() - 0.5) * CONFIG.SPEED;
      this.color = CONFIG.PARTICLE_COLOR;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x <= 0 || this.x >= width) this.vx *= -1;
      if (this.y <= 0 || this.y >= height) this.vy *= -1;
    }
    draw() {
      ctx.fillStyle = `rgb(${this.color})`;
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
  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONFIG.MAX_DISTANCE) {
          ctx.strokeStyle = `rgba(${particles[i].color},${1 - dist / CONFIG.MAX_DISTANCE})`;
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
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CONFIG.MOUSE_RADIUS) {
        ctx.strokeStyle = `rgba(${p.color},${1 - dist / CONFIG.MOUSE_RADIUS})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(mouse.x, mouse.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
    });
  }

  /* ================= LOOP ================= */
  function clear() { ctx.clearRect(0, 0, width, height); }

  function update() { particles.forEach(p => { p.update(); p.draw(); }); }

  function animate() {
    if (CONFIG.BACKGROUND_CLEAR) clear();
    update();
    connectParticles();
    connectMouse();
    requestAnimationFrame(animate);
  }

  /* ================= COLOR TOGGLE BUTTON ================= */
  function createColorToggleButton() {
    const btn = document.createElement("button");
    btn.textContent = "Renk Değiştir";
    btn.style.position = "fixed";
    btn.style.top = "20px";
    btn.style.right = "20px";
    btn.style.zIndex = "10";
    btn.style.padding = "10px 20px";
    btn.style.background = "#222";
    btn.style.color = "#fff";
    btn.style.border = "none";
    btn.style.cursor = "pointer";
    document.body.appendChild(btn);

    btn.addEventListener("click", () => {
      // Partikül rengini değiştir
      CONFIG.PARTICLE_COLOR = CONFIG.PARTICLE_COLOR === "0,255,0" ? "255,77,77" : "0,255,0";
      particles.forEach(p => p.color = CONFIG.PARTICLE_COLOR);

      const isGreen = CONFIG.PARTICLE_COLOR === "0,255,0";

      // Metin renklerini sadece kırmızı/yeşil tonlarıyla değiştir, arka planı asla değiştirme
      const textElements = document.querySelectorAll(
        "#sidebar button, #langSwitch, #mainHeader, #loginTitle, .item a, #loginForm button"
      );
      textElements.forEach(el => {
        const currentColor = window.getComputedStyle(el).color;
        if (isGreen) {
          if (currentColor.includes("255,77,77") || currentColor.includes("204,0,0")) {
            el.style.color = "#00ff00";
          }
        } else {
          if (currentColor.includes("0,255,0")) {
            el.style.color = "#ff4d4d";
          }
        }
      });
    });
  }

  /* ================= INIT ================= */
  function init() {
    createCanvas();
    createParticles();
    initMouse();
    createColorToggleButton();
    window.addEventListener("resize", resizeCanvas);
    animate();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
