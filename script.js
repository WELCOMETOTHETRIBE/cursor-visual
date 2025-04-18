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

let trail = [];
let ripples = [];
let lastX = mouse.x;
let lastY = mouse.y;

window.addEventListener("mousemove", (e) => {
  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;
  mouse.vx = dx;
  mouse.vy = dy;
  mouse.speed = Math.sqrt(dx * dx + dy * dy);
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  lastX = e.clientX;
  lastY = e.clientY;

  // Create a ripple only if the mouse moves significantly
  if (mouse.speed > 8) {
    ripples.push({ x: mouse.x, y: mouse.y, radius: 0, alpha: 0.4 });
  }

  // Add a glowing trail
  trail.push({
    x: mouse.x,
    y: mouse.y,
    radius: 12,
    alpha: 1,
    glow: 25 + mouse.speed * 2
  });
  if (trail.length > 100) trail.shift();
});

// Handle resize
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

function draw() {
  // Background fade for trailing effect
  ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // LIGHT BEAM trail (stretch beam)
  ctx.beginPath();
  ctx.moveTo(mouse.x, mouse.y);
  ctx.lineTo(mouse.x - mouse.vx * 6, mouse.y - mouse.vy * 6);
  ctx.strokeStyle = "rgba(0,255,255,0.1)";
  ctx.lineWidth = 8;
  ctx.shadowColor = "cyan";
  ctx.shadowBlur = 40;
  ctx.stroke();

  // Glowing trail particles
  for (let i = 0; i < trail.length; i++) {
    let p = trail[i];
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,255,255,${p.alpha})`;
    ctx.shadowColor = "rgba(0,255,255,1)";
    ctx.shadowBlur = p.glow;
    ctx.fill();

    p.alpha *= 0.94;
    p.radius *= 0.96;
    p.glow *= 0.95;
  }

  // Ripple pulses
  for (let i = 0; i < ripples.length; i++) {
    let r = ripples[i];
    ctx.beginPath();
    ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(0,255,255,${r.alpha})`;
    ctx.lineWidth = 1.5;
    ctx.shadowColor = "cyan";
    ctx.shadowBlur = 10;
    ctx.stroke();
    r.radius += 2;
    r.alpha *= 0.95;
  }

  // Clear old ripples
  ripples = ripples.filter(r => r.alpha > 0.01);

  requestAnimationFrame(draw);
}

draw();
