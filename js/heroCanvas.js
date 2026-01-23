
// heroCanvas_background_with_overlay.js
// Background animation + upper-left-third image overlay (Dropbox)

const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');

// ---------------------------
// Overlay image (Dropbox)
// ---------------------------
const OVERLAY_IMG_URL = "https://uc3151e97e0bf303dd805e8b389f.previews.dropboxusercontent.com/p/thumb/AC7ywzgokbRhRNvRJFfzNLGnM9VWqpYDDpavKhZeH2fTYYqnhj3zXIYzG-uaRiRoH8MJ1Fen1fYotyjrR0hPeBb3i_xSAY_LV6IPflEXFwXOf8SNWN_yP1R8ADbyxho0SbFkJirEM0k_W84TDIkKyc5C3xpjNIm67pRZGhyLZR2beILyfYqbeCl4XSHqyKZ38WP4zm2lEawLixt2eGUjc2aemGdV-RFgw2kJDUogPCnXusal200lQXwuszZ4j8yqT85vyY9Di_cjKW51tjv12noe-nUcrxJ1GhAwf-U5Pf1MxiFv8XxKNsSOtOKD3x8gCNx8rBW3c7e5UgWt5h_GlnEyl3NiAEZ1ipVMU5wL8WE2Med_qz6ZxBoOtXd7hgiz-v0K2Qhd-g9f9GOa5PG5p-R8/p.jpeg?is_prewarmed=true";

const overlayImg = new Image();
overlayImg.crossOrigin = "anonymous";
overlayImg.src = OVERLAY_IMG_URL;

let overlayReady = false;
overlayImg.onload = () => overlayReady = true;
overlayImg.onerror = () => console.warn("Overlay image failed to load");

function drawOverlayImage(){
  if (!overlayReady) return;

  const w = canvas.width;
  const h = canvas.height;

  const regionW = w / 3;
  const regionH = h / 3;

  const padX = Math.max(16, w * 0.03);
  const padY = Math.max(16, h * 0.04);

  const boxW = regionW - padX * 1.2;
  const boxH = regionH - padY * 1.2;

  const imgW = overlayImg.naturalWidth;
  const imgH = overlayImg.naturalHeight;

  const scale = Math.min(boxW / imgW, boxH / imgH);
  const drawW = imgW * scale;
  const drawH = imgH * scale;

  ctx.save();
  ctx.globalAlpha = 0.92;
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(overlayImg, padX, padY, drawW, drawH);
  ctx.restore();
}

function resize(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

// Noise helpers
function hash(n){ return (Math.sin(n)*43758.5453123)%1; }
function noise(x){
  const i = Math.floor(x);
  const f = x - i;
  const a = hash(i);
  const b = hash(i+1);
  const t = f*f*(3-2*f);
  return a + (b-a)*t;
}

const STRANDS = 60;
const SEGMENTS = 22;
let time = 0;

const strands = Array.from({length: STRANDS}, () => ({
  seed: Math.random()*10000,
  y: Math.random(),
  amp: 6 + Math.random()*18,
  freq: 0.2 + Math.random()*0.6,
  phase: Math.random()*Math.PI*2,
  width: 0.35 + Math.random()*1.0,
  speed: (Math.random()*0.18+0.05)*(Math.random()<0.5?-1:1)
}));

function drawStrand(s){
  const w = canvas.width;
  const h = canvas.height;

  ctx.beginPath();
  for(let i=0;i<=SEGMENTS;i++){
    const p = i/SEGMENTS;
    const x = p*w;
    const wave = Math.sin(s.phase + time*0.0009*s.speed) * s.amp;
    const jitter = (noise(s.seed + p*10 + time*0.0015)-0.5)*4;
    const y = (s.y*h + wave + jitter + h) % h;

    if(i===0) ctx.moveTo(x,y);
    else ctx.lineTo(x,y);
  }

  const grad = ctx.createLinearGradient(0,0,canvas.width,0);
  grad.addColorStop(0,'rgba(140,140,145,0.04)');
  grad.addColorStop(0.45,'rgba(210,210,215,0.14)');
  grad.addColorStop(0.5,'rgba(235,235,240,0.22)');
  grad.addColorStop(0.55,'rgba(200,200,205,0.13)');
  grad.addColorStop(1,'rgba(120,120,125,0.03)');

  ctx.strokeStyle = grad;
  ctx.lineWidth = s.width;
  ctx.lineCap = 'round';
  ctx.stroke();
}

function drawFilmLines(){
  const w = canvas.width;
  const h = canvas.height;

  ctx.save();
  ctx.fillStyle = '#fff';

  for(let x=0;x<w;x+=Math.floor(3 + Math.random()*8)){
    ctx.globalAlpha = 0.015 + Math.random()*0.03;
    ctx.fillRect(x, 0, 1, h);
  }
  ctx.restore();
}

function drawGrain(){
  const w = canvas.width;
  const h = canvas.height;

  ctx.save();
  ctx.globalAlpha = 0.025;
  ctx.fillStyle = '#fff';

  for(let i=0;i<700;i++){
    ctx.fillRect(Math.random()*w, Math.random()*h, 1, 1);
  }
  ctx.restore();
}

function animate(){
  time++;
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fillRect(0,0,canvas.width,canvas.height);

  strands.forEach(drawStrand);
  drawOverlayImage();
  drawFilmLines();
  drawGrain();

  requestAnimationFrame(animate);
}

ctx.fillStyle = '#000';
ctx.fillRect(0,0,canvas.width,canvas.height);
animate();
