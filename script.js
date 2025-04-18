const canvas = document.getElementById('smokeCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
let hue = 0;

function createParticle(x, y, force = false) {
  const angle = Math.random() * Math.PI * 2;
  const speed = Math.random() * 1.5;
  const particle = {
    x,
    y,
    alpha: 1,
    size: Math.random() * 20 + 20,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    hue: hue + Math.random() * 60,
    angle: angle,
    angularVelocity: (Math.random() - 0.5) * 0.2,
    force
  };
  particles.push(particle);
}

function draw() {
  ctx.fillStyle = 'rgba(26, 0, 51, 0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  hue = (hue + 0.3) % 360;

  particles.forEach((p, i) => {
    // Turbulent swirling movement
    p.angle += p.angularVelocity;
    const swirlStrength = 0.5;
    p.vx += Math.cos(p.angle) * swirlStrength * 0.02;
    p.vy += Math.sin(p.angle) * swirlStrength * 0.02;

    p.x += p.vx;
    p.y += p.vy;
    p.alpha *= 0.97;
    p.size *= 0.985;

    if (p.alpha <= 0.01 || p.size <= 1) {
      particles.splice(i, 1);
    } else {
      // Gradient color blend
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      gradient.addColorStop(0, `hsla(${p.hue}, 100%, 75%, ${p.alpha})`);
      gradient.addColorStop(1, `hsla(${(p.hue + 60) % 360}, 100%, 60%, 0)`);

      ctx.beginPath();
      ctx.fillStyle = gradient;
      ctx.shadowColor = `hsla(${p.hue}, 100%, 75%, ${p.alpha})`;
      ctx.shadowBlur = 25;
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  requestAnimationFrame(draw);
}

canvas.addEventListener('mousemove', (e) => {
  for (let i = 0; i < 3; i++) {
    createParticle(e.clientX, e.clientY);
  }
});

canvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  const touch = e.touches[0];
  for (let i = 0; i < 3; i++) {
    createParticle(touch.clientX, touch.clientY);
  }
}, { passive: false });

canvas.addEventListener('click', (e) => {
  for (let i = 0; i < 10; i++) {
    createParticle(e.clientX, e.clientY, true);
  }
});

canvas.addEventListener('touchstart', (e) => {
  const touch = e.touches[0];
  for (let i = 0; i < 10; i++) {
    createParticle(touch.clientX, touch.clientY, true);
  }
}, { passive: true });

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

draw();
