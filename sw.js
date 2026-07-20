if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js', { scope: './' })
      .then(reg => console.log('Fervox SW Registered!', reg.scope))
      .catch(err => console.log('SW Registry Failed:', err));
  });
}
