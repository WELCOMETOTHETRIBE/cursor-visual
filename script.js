const canvas = document.getElementById('smokeCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let bolts = [];

function createLightning(x, y, intensity = 1) {
  for (let i = 0; i < intensity; i++) {
    bolts.push({
      x,
      y,
      path: generateBoltPath(x, y),
      life: 1.0,
      brightness: 1.0
    });
  }
}

function generateBoltPath(x, y) {
  const path = [];
  let currentX = x;
  let currentY = y;

  for (let i = 0; i < 20; i++) {
    const dx = (Math.random() - 0.5) * 40;
    const dy = Math.random() * 40;
    currentX += dx;
    currentY += dy;
    path.push({ x: currentX, y: currentY });
  }

  return path;
}

function draw() {
  ctx.fillStyle = "rgba(10, 10, 30, 0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  bolts.forEach((bolt, i) => {
    ctx.beginPath();
    ctx.moveTo(bolt.x, bolt.y);

    bolt.path.forEach(p => {
      ctx.lineTo(p.x, p.y);
    });

    const hue = 200 + Math.random() * 40;
    ctx.strokeStyle = `hsla(${hue}, 100%, 85%, ${bolt.life})`;
    ctx.shadowColor = `hsla(${hue}, 100%, 75%, ${bolt.life})`;
    ctx.shadowBlur = 25;
    ctx.lineWidth = 2 + Math.random() * 2;
    ctx.stroke();

    bolt.life *= 0.9;

    if (bolt.life < 0.02) {
      bolts.splice(i, 1);
    }
  });

  requestAnimationFrame(draw);
}

canvas.addEventListener('mousemove', (e) => {
  createLightning(e.clientX, e.clientY, 1);
});

canvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  const touch = e.touches[0];
  createLightning(touch.clientX, touch.clientY, 1);
}, { passive: false });

canvas.addEventListener('click', (e) => {
  createLightning(e.clientX, e.clientY, 3);
});

canvas.addEventListener('touchstart', (e) => {
  const touch = e.touches[0];
  createLightning(touch.clientX, touch.clientY, 3);
}, { passive: true });

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

draw();
