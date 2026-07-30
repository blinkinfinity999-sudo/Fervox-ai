// Function to send email alert when app is downloaded
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
