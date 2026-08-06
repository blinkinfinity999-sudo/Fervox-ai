let deferredPrompt;
const downloadBtn = document.getElementById('pwa-download-circle');

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
      ref: 'DL-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8) // This makes every click unique!
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
  .catch(error => console.error(' Fetch failed:', error));
}
// ==========================================
// 2. Hide button if already installed
// ==========================================
if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
  if (downloadBtn) downloadBtn.style.display = 'none';
}

// ==========================================
// 3. Save prompt when app is installable
// ==========================================
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (downloadBtn) downloadBtn.style.display = 'flex';
});

// ==========================================
// 4. Handle click & send email
// ==========================================
if (downloadBtn) {
  downloadBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;

    // Show the native PWA install dialog
    deferredPrompt.prompt();

    // Wait for the user's decision
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      // Call Section 1 here!
      sendDownloadNotification();
    }

    deferredPrompt = null;
  });
}
// ==========================================
// Catch installs from Chrome 3-dots / URL Bar
// ==========================================
window.addEventListener('appinstalled', () => {
  console.log('🎉 PWA was installed successfully!');
  sendDownloadNotification();
});
// 5. Physics Ball Engine
const canvas = document.getElementById('physicsCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let ball = { x: 250, y: 30, vx: 3, vy: 0, radius: 12, bounce: 0.75, gravity: 0.35 };

  function updatePhysics() {
    ball.vy += ball.gravity;
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Floor collision
    if (ball.y + ball.radius > canvas.height) {
      ball.y = canvas.height - ball.radius;
      ball.vy *= -ball.bounce;
    }
    // Wall collisions
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
      ball.vx *= -1;
    }

    // Draw frame
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
      ball.x = 250;
      ball.y = 30;
      ball.vy = 0;
      ball.vx = (Math.random() - 0.5) * 6;
    });
  }

  updatePhysics();
}
