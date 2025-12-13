// customParticles.js

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

canvas.id = "particleCanvas";
canvas.style.position = "fixed";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.style.zIndex = "-1";

const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();

/* ================= MOUSE ================= */
const mouse = {
  x: null,
  y: null,
  radius: 160
};

window.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener("mouseleave", () => {
  mouse.x = null;
  mouse.y = null;
});

/* ================= PARTICLE ================= */
class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.radius = Math.random() * 2 + 1;
    this.vx = (Math.random() - 0.5) * 1.2;
    this.vy = (Math.random() - 0.5) * 1.2;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }

  draw() {
    ctx.fillStyle = "#ff4d4d";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

/* ================= CREATE PARTICLES ================= */
const particles = [];
const PARTICLE_COUNT = 140;

for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push(new Particle());
}

/* ================= PARTICLE ↔ PARTICLE LINES ================= */
function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 150) {
        ctx.strokeStyle = `rgba(255,77,77,${1 - dist / 150})`;
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

/* ================= MOUSE ↔ PARTICLE LINES ================= */
function connectMouse() {
  if (!mouse.x) return;

  particles.forEach(p => {
    const dx = mouse.x - p.x;
    const dy = mouse.y - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < mouse.radius) {
      ctx.strokeStyle = `rgba(255,77,77,${1 - dist / mouse.radius})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(mouse.x, mouse.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
  });
}

/* ================= ANIMATE ================= */
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    p.update();
    p.draw();
  });

  connectParticles(); // particle ↔ particle
  connectMouse();     // mouse ↔ particle

  requestAnimationFrame(animate);
}

animate();

window.addEventListener("resize", resizeCanvas);
