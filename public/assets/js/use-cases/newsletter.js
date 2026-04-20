// use-cases/newsletter.js — inscrição na newsletter

(function () {
  var form = document.querySelector('.newsletter-form');
  var input = document.querySelector('.newsletter-input');
  var btn = document.querySelector('.newsletter-btn');
  var msgEl = document.getElementById('newsletter-msg');

  if (!form || !input || !btn) return;

  btn.addEventListener('click', function () {
    var email = input.value.trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showMsg('Digite um email válido.', false);
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Inscrevendo...';

    fetch('/api/newsletter/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email }),
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.ok) {
          input.style.display = 'none';
          btn.style.display = 'none';
          showMsg('Inscrito com sucesso! Em breve você receberá nossos conteúdos.', true);
        } else {
          btn.disabled = false;
          btn.textContent = 'Quero receber';
          showMsg(data.error || 'Erro ao inscrever. Tente novamente.', false);
        }
      })
      .catch(function () {
        btn.disabled = false;
        btn.textContent = 'Quero receber';
        showMsg('Erro de conexão. Tente novamente.', false);
      });
  });

  function showMsg(text, success) {
    if (!msgEl) return;
    msgEl.textContent = text;
    msgEl.style.color = success ? '#86efac' : '#fca5a5';
    msgEl.style.display = 'block';
  }
})();
