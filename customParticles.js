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
    // Rastgele yeşil veya kırmızı
    this.color = Math.random() < 0.5 ? "0,255,0" : "255,0,0";
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

function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < CONFIG.MAX_DISTANCE) {
        // İki partikülün ortalama rengi
        const c1 = particles[i].color.split(",").map(Number);
        const c2 = particles[j].color.split(",").map(Number);
        const avgColor = c1.map((v, idx) => Math.floor((v + c2[idx]) / 2));
        ctx.strokeStyle = `rgba(${avgColor.join(",")},${1 - dist / CONFIG.MAX_DISTANCE})`;
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
