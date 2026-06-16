(function () {
  'use strict';

  document.querySelectorAll('.password-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var input = document.getElementById(btn.dataset.target);
      if (!input) return;
      var isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      btn.setAttribute('aria-label', isPassword ? 'Ocultar contraseña' : 'Mostrar contraseña');
    });
  });

  function showSuccess(card, title, message, redirectUrl, redirectLabel) {
    card.innerHTML =
      '<div class="auth-success">' +
        '<div class="auth-success__icon">✓</div>' +
        '<h2>' + title + '</h2>' +
        '<p>' + message + '</p>' +
        '<a href="' + redirectUrl + '" class="btn btn--primary btn--full">' + redirectLabel + '</a>' +
      '</div>';
  }

  var loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!loginForm.checkValidity()) {
        loginForm.reportValidity();
        return;
      }
      var btn = loginForm.querySelector('[type="submit"]');
      btn.textContent = 'Iniciando sesión...';
      btn.disabled = true;

      setTimeout(function () {
        showSuccess(
          document.querySelector('.auth-card'),
          '¡Sesión iniciada!',
          'Bienvenido de nuevo a NutriTech. Redirigiendo a la app...',
          'index.html',
          'Ir a la app'
        );
      }, 1200);
    });
  }

  var registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!registerForm.checkValidity()) {
        registerForm.reportValidity();
        return;
      }
      var btn = registerForm.querySelector('[type="submit"]');
      btn.textContent = 'Creando cuenta...';
      btn.disabled = true;

      setTimeout(function () {
        showSuccess(
          document.querySelector('.auth-card'),
          '¡Cuenta creada!',
          'Tu perfil está listo. Ya puedes empezar a usar NutriTech.',
          'index.html',
          'Entrar a la app'
        );
      }, 1500);
    });
  }
})();
