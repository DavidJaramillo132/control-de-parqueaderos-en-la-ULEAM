document.addEventListener('DOMContentLoaded', () => { 
  const btn = document.getElementById('login-btn');
  if (btn) {
    btn.addEventListener('click', login);
  }
});

function login() {
  const userInput = document.getElementById('user');
  const passwordInput = document.getElementById('password');

  const user = userInput.value.trim();
  const password = passwordInput.value.trim();

  let error = false;
  const userRegex = /^e\d{10}@live\.uleam\.edu\.ec$/;

  if (!(user === 'admin' || userRegex.test(user))) {
    userInput.classList.add('input-error');
    mostrarAlerta('El usuario debe ser "admin" o tener el formato e12345678@live.uleam.edu.ec', 'error');
    error = true;
  } else {
    userInput.classList.remove('input-error');
  }

  if (password !== "1234") {
    passwordInput.classList.add('input-error');
    mostrarAlerta('La contraseña es incorrecta', 'error');
    error = true;
  } else {
    passwordInput.classList.remove('input-error');
  }

  if (error) {
    mostrarAlerta('Por favor, corrija los errores antes de enviar el formulario', 'error');
    return;
  } else {
    if (user === 'admin') {
      window.location.href = '../parqueadero/index.html';
    } else {
      window.location.href = '../user/user.html';
    }
  }
};

function mostrarAlerta(mensaje, tipo) {
  const alerta = document.createElement('div');
  alerta.className = `alerta ${tipo}`;
  alerta.textContent = mensaje;

  document.body.appendChild(alerta);

  setTimeout(() => {
    alerta.remove();
  }, 3000);
}
