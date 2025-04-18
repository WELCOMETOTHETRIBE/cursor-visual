const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2
};

let trail = [];

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  trail.push({ x: mouse.x, y: mouse.y, alpha: 1.0 });
  if (trail.length > 100) trail.shift(); // Limit trail length
});

function draw() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw each trail particle
  for (let i = 0; i < trail.length; i++) {
    let p = trail[i];
    ctx.beginPath();
    ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 255, 255, ${p.alpha})`;
    ctx.shadowColor = "cyan";
    ctx.shadowBlur = 20;
    ctx.fill();
    p.alpha *= 0.95; // fade each particle
  }

  requestAnimationFrame(draw);
}

draw();
