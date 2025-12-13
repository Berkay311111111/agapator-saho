// customParticles.js

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

canvas.id = "particleCanvas";
canvas.style.position = "fixed";
canvas.style.top = 0;
canvas.style.left = 0;
canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.style.zIndex = -1;

const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

const mouse = {
  x: null,
  y: null,
  radius: 160
};

window.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener("mouseout", () => {
  mouse.x = null;
  mouse.y = null;
});

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 1;
    this.speedX = (Math.random() - 0.5) * 1.2;
    this.speedY = (Math.random() - 0.5) * 1.2;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x <= 0 || this.x >= canvas.width) this.speedX *= -1;
    if (this.y <= 0 || this.y >= canvas.height) this.speedY *= -1;
  }

  draw() {
    ctx.fillStyle = "#ff4d4d";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

const particlesArray = [];
const COUNT = 140;

for (let i = 0; i < COUNT; i++) {
  particlesArray.push(new Particle());
}

function connectParticles() {
  for (let i = 0; i < particlesArray.length; i++) {
    for (let j = i + 1; j < particlesArray.length; j++) {

      const dx = particlesArray[i].x - particlesArray[j].x;
      const dy = particlesArray[i].y - particlesArray[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 150) {
        const opacity = 1 - distance / 150;
        ctx.strokeStyle = `rgba(255,77,77,${opacity})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
        ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
        ctx.stroke();
      }
    }
  }
}

function connectToMouse() {
  if (mouse.x === null) return;

  particlesArray.forEach(p => {
    const dx = mouse.x - p.x;
    const dy = mouse.y - p.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < mouse.radius) {
      const opacity = 1 - distance / mouse.radius;
      ctx.strokeStyle = `rgba(255,77,77,${opacity})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(mouse.x, mouse.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particlesArray.forEach(p => {
    p.update();
    p.draw();
  });

  connectParticles(); // 🔴 particle → particle
  connectToMouse();   // 🕷️ mouse → particle

  requestAnimationFrame(animate);
}

animate();

window.addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
});
