let deferredPrompt;
const downloadBtn = document.getElementById('pwa-download-circle');

// 1. Send email notification function
function sendDownloadNotification() {
  const formspreeEndpoint = 'https://formspree.io/f/YOUR_FORMSPREE_ID';

  fetch(formspreeEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      subject: '🚀 New Fervox AI Download!',
      message: 'A user has installed the Fervox AI PWA.',
      device: navigator.userAgent,
      time: new Date().toLocaleString()
    })
  })
  .then(response => {
    if (response.ok) {
      console.log('Notification email sent successfully!');
    } else {
      console.error('Failed to send notification email.');
    }
  })
  .catch(error => {
    console.error('Error sending email:', error);
  });
}

// 2. Hide button if already installed
if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
  if (downloadBtn) downloadBtn.style.display = 'none';
}

// 3. Save the prompt when the app becomes installable
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (downloadBtn) downloadBtn.style.display = 'flex';
});

// 4. PUT YOUR CODE HERE (Handle click & send email)
if (downloadBtn) {
  downloadBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;

    // Show the native PWA install dialog
    deferredPrompt.prompt();

    // Wait for the user's decision
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      // Call the email sending code
      sendDownloadNotification();
    }

    deferredPrompt = null;
  });
}
