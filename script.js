const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  vx: 0,
  vy: 0,
  speed: 0
};

let hue = 200;
let trail = [];
let ripples = [];
let lastX = mouse.x;
let lastY = mouse.y;

function updatePointer(x, y, forceRipple = false) {
  const dx = x - lastX;
  const dy = y - lastY;
  mouse.vx = dx;
  mouse.vy = dy;
  mouse.speed = Math.sqrt(dx * dx + dy * dy);
  mouse.x = x;
  mouse.y = y;
  lastX = x;
  lastY = y;

  if (mouse.speed > 8 || forceRipple) {
    ripples.push({ x: mouse.x, y: mouse.y, radius: 0, alpha: 0.5, hue });
  }

  trail.push({
    x: mouse.x,
    y: mouse.y,
    radius: 12,
    alpha: 1,
    glow: 25 + mouse.speed * 2,
    hue
  });
  if (trail.length > 100) trail.shift();
}

// Mouse move
window.addEventListener("mousemove", (e) => {
  updatePointer(e.clientX, e.clientY);
});

// Touch move
window.addEventListener("touchmove", (e) => {
  if (e.touches.length > 0) {
    const touch = e.touches[0];
    updatePointer(touch.clientX, touch.clientY);
  }
}, { passive: true });

// Tap or click = force pulse
window.addEventListener("click", (e) => {
  updatePointer(e.clientX, e.clientY, true);
});
window.addEventListener("touchstart", (e) => {
  if (e.touches.length > 0) {
    const touch = e.touches[0];
    updatePointer(touch.clientX, touch.clientY, true);
  }
}, { passive: true });

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

function draw() {
  ctx.fillStyle = "rgba(26, 0, 51, 0.15)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  hue = (hue + 0.6) % 360; // Slowly cycle hue

  // Light beam (velocity-based)
  ctx.beginPath();
  ctx.moveTo(mouse.x, mouse.y);
  ctx.lineTo(mouse.x - mouse.vx * 6, mouse.y - mouse.vy * 6);
  ctx.strokeStyle = `hsla(${hue}, 100%, 70%, 0.2)`;
  ctx.lineWidth = 8;
  ctx.shadowColor = `hsl(${hue}, 100%, 60%)`;
  ctx.shadowBlur = 40;
  ctx.stroke();

  // Glowing trail
  for (let i = 0; i < trail.length; i++) {
    let p = trail[i];
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${p.hue}, 100%, 65%, ${p.alpha})`;
    ctx.shadowColor = `hsl(${p.hue}, 100%, 60%)`;
    ctx.shadowBlur = p.glow;
    ctx.fill();

    p.alpha *= 0.94;
    p.radius *= 0.96;
    p.glow *= 0.95;
  }

  // Ripples
  for (let i = 0; i < ripples.length; i++) {
    let r = ripples[i];
    ctx.beginPath();
    ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
    ctx.strokeStyle = `hsla(${r.hue}, 100%, 75%, ${r.alpha})`;
    ctx.lineWidth = 2;
    ctx.shadowColor = `hsl(${r.hue}, 100%, 75%)`;
    ctx.shadowBlur = 15;
    ctx.stroke();
    r.radius += 2.5;
    r.alpha *= 0.94;
  }

  ripples = ripples.filter(r => r.alpha > 0.01);
  requestAnimationFrame(draw);
}

draw();
