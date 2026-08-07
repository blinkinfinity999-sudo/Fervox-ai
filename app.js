let deferredPrompt;
const downloadBtn = document.getElementById('pwa-download-circle');
const installBanner = document.getElementById('installBanner');
const pwaInstallBtn = document.getElementById('pwaInstallBtn');

// ==========================================
// 1. Send Email Notification (Formspree AJAX)
// ==========================================
function sendDownloadNotification() {
  const formspreeEndpoint = 'https://formspree.io/f/mdaqjvqb';

  fetch(formspreeEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      message: '🚀 New Fervox AI Download!',
      device: navigator.userAgent,
      time: new Date().toLocaleString(),
      ref: 'DL-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8)
    })
  })
  .then(async (response) => {
    const data = await response.json();
    if (response.ok) {
      console.log('✅ Formspree success:', data);
    } else {
      console.error('❌ Formspree error detail:', data); 
    }
  })
  .catch(error => console.error('Fetch failed:', error));
}

// ==========================================
// 2. Interface State Filters (Hide if Installed)
// ==========================================
if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
  if (downloadBtn) downloadBtn.style.display = 'none';
  if (installBanner) installBanner.style.display = 'none';
}

// ==========================================
// 3. App Installation Prompt Interception
// ==========================================
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  
  // Show both trigger layouts for the user
  if (downloadBtn) downloadBtn.style.display = 'flex';
  if (installBanner) installBanner.style.display = 'flex';
});

// Helper for running the installation dialog safely
async function triggerPWAInstallation() {
  if (!deferredPrompt) return;

  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;

  if (outcome === 'accepted') {
    sendDownloadNotification();
  }

  deferredPrompt = null;
  if (downloadBtn) downloadBtn.style.display = 'none';
  if (installBanner) installBanner.style.display = 'none';
}

// Attach action events to interface items
if (downloadBtn) downloadBtn.addEventListener('click', triggerPWAInstallation);
if (pwaInstallBtn) pwaInstallBtn.addEventListener('click', triggerPWAInstallation);

window.addEventListener('appinstalled', () => {
  console.log('🎉 PWA was installed successfully!');
  if (downloadBtn) downloadBtn.style.display = 'none';
  if (installBanner) installBanner.style.display = 'none';
  sendDownloadNotification();
});

// ==========================================
// 4. Physics Ball Simulation Loop Engine
// ==========================================
const canvas = document.getElementById('physicsCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let ball = { x: 140, y: 30, vx: 2, vy: 0, radius: 10, bounce: 0.75, gravity: 0.35 };

  function updatePhysics() {
    ball.vy += ball.gravity;
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Floor collision calculations
    if (ball.y + ball.radius > canvas.height) {
      ball.y = canvas.height - ball.radius;
      ball.vy *= -ball.bounce;
    }
    // Lateral wall collision loops
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
      ball.vx *= -1;
    }

    // Canvas frame layout refreshes
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#A855F7';
    ctx.fill();
    ctx.closePath();

    requestAnimationFrame(updatePhysics);
  }

  const dropBtn = document.getElementById('resetPhysics');
  if (dropBtn) {
    dropBtn.addEventListener('click', () => {
      ball.x = 140;
      ball.y = 30;
      ball.vy = 0;
      ball.vx = (Math.random() - 0.5) * 5;
    });
  }

  updatePhysics();
}
