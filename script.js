const canvas = document.getElementById('smokeCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
let hue = 0;

function createParticle(x, y, force = false) {
  const particle = {
    x,
    y,
    alpha: 1,
    size: Math.random() * 20 + 20,
    vx: (Math.random() - 0.5) * 1.2,
    vy: (Math.random() - 0.5) * 1.2,
    hue: hue + Math.random() * 60,
    force
  };
  particles.push(particle);
}

function draw() {
  ctx.fillStyle = 'rgba(26, 0, 51, 0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  hue = (hue + 0.4) % 360;

  particles.forEach((p, i) => {
    p.x += p.vx;
    p.y += p.vy;
    p.alpha *= 0.98;
    p.size *= 0.98;

    if (p.alpha <= 0.01 || p.size <= 1) {
      particles.splice(i, 1);
    } else {
      ctx.beginPath();
      ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${p.alpha})`;
      ctx.shadowColor = `hsla(${p.hue}, 100%, 70%, ${p.alpha})`;
      ctx.shadowBlur = 30;
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
