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
