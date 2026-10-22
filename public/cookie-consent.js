(function() {
  if (typeof window === 'undefined') return;
  if (localStorage.getItem('quiet-journal-cookie-consent') === 'true') return;

  var style = document.createElement('style');
  style.innerHTML = `
    .cookie-banner {
      position: fixed;
      bottom: 20px;
      left: 20px;
      right: 20px;
      background: #284a3a;
      color: #fff;
      padding: 16px 20px;
      border-radius: 12px;
      z-index: 999999;
      box-shadow: 0 10px 25px rgba(0,0,0,0.15);
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      align-items: center;
      justify-content: space-between;
      font-family: system-ui, -apple-system, sans-serif;
    }
    .cookie-banner p {
      margin: 0;
      font-size: 14px;
      line-height: 1.5;
      max-width: 800px;
    }
    .cookie-banner a {
      color: #fff;
      text-decoration: underline;
      font-weight: bold;
    }
    .cookie-banner button {
      background: #fff;
      color: #284a3a;
      border: none;
      padding: 10px 20px;
      border-radius: 999px;
      font-weight: 800;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.2s;
    }
    .cookie-banner button:hover {
      background: #e7f0ea;
    }
  `;
  document.head.appendChild(style);

  var banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.innerHTML = '<p>We use cookies and browser storage to keep Lofi Memory smooth and support ads. By staying here, you agree to our <a href="/privacy.html">Privacy Policy</a>, <a href="/terms.html">Terms</a>, and <a href="/cookie-policy.html">Cookie Policy</a>.</p>' +
    '<button id="accept-cookies">Accept</button>';
  
  // Wait for body to exist
  if (document.body) {
    document.body.appendChild(banner);
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      document.body.appendChild(banner);
    });
  }

  document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'accept-cookies') {
      localStorage.setItem('quiet-journal-cookie-consent', 'true');
      banner.remove();
    }
  });
})();
