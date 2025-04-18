{\rtf1\ansi\ansicpg1252\cocoartf2761
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 const canvas = document.getElementById("canvas");\
const ctx = canvas.getContext("2d");\
\
canvas.width = window.innerWidth;\
canvas.height = window.innerHeight;\
\
let mouse = \{\
  x: canvas.width / 2,\
  y: canvas.height / 2\
\};\
\
window.addEventListener("mousemove", function(e) \{\
  mouse.x = e.x;\
  mouse.y = e.y;\
\});\
\
function drawCircle(x, y, radius, color) \{\
  ctx.beginPath();\
  ctx.arc(x, y, radius, 0, Math.PI * 2);\
  ctx.fillStyle = color;\
  ctx.fill();\
\}\
\
function animate() \{\
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";\
  ctx.fillRect(0, 0, canvas.width, canvas.height);\
  \
  drawCircle(mouse.x, mouse.y, 25, "rgba(0,255,255,0.4)");\
  \
  requestAnimationFrame(animate);\
\}\
\
animate();\
}
