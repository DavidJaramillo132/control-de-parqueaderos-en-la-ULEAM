// Espera a que todo el contenido del DOM esté completamente cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', () => { 
  const btn = document.getElementById('login-btn'); // Busca el botón con id 'login-btn'
  if (btn) {
    btn.addEventListener('click', login); // Si el botón existe, asigna la función 'login' al evento click
  }
});

// Función principal para manejar el inicio de sesión
function login() {
  // Obtiene los campos de entrada de usuario y contraseña
  const userInput = document.getElementById('user');
  const passwordInput = document.getElementById('password');

  // Obtiene los valores ingresados y elimina espacios en blanco
  const user = userInput.value.trim();
  const password = passwordInput.value.trim();

  let error = false; // Bandera para detectar si hay errores

  // Expresión regular para validar formato de correo institucional
  const userRegex = /^e\d{10}@live\.uleam\.edu\.ec$/;

  // Validación del campo usuario
  if (!(user === 'admin' || userRegex.test(user))) {
    userInput.classList.add('input-error'); // Agrega clase de error visual al input
    mostrarAlerta('El usuario debe ser "admin" o tener el formato e12345678@live.uleam.edu.ec', 'error');
    error = true;
  } else {
    userInput.classList.remove('input-error'); // Remueve la clase de error si es válido
  }

  // Validación de la contraseña
  if (password !== "1234") {
    passwordInput.classList.add('input-error'); // Clase de error visual si la contraseña es incorrecta
    mostrarAlerta('La contraseña es incorrecta', 'error');
    error = true;
  } else {
    passwordInput.classList.remove('input-error');
  }

  // Si hay errores, muestra un mensaje general y detiene la ejecución
  if (error) {
    mostrarAlerta('Por favor, corrija los errores antes de enviar el formulario', 'error');
    return;
  } else {
    // Si no hay errores, redirecciona según el tipo de usuario
    if (user === 'admin') {
      window.location.href = '../parqueadero/index.html'; // Redirecciona a vista de administrador
    } else {
      window.location.href = '../user/user.html'; // Redirecciona a vista de usuario común
    }
  }
};

// Función para mostrar mensajes de alerta en pantalla
function mostrarAlerta(mensaje, tipo) {
  const alerta = document.createElement('div'); // Crea un nuevo div para la alerta
  alerta.className = `alerta ${tipo}`; // Agrega clases de estilo según el tipo (ej: 'error')
  alerta.textContent = mensaje; // Inserta el mensaje de alerta

  document.body.appendChild(alerta); // Añade la alerta al cuerpo del documento

  // Elimina la alerta después de 3 segundos
  setTimeout(() => {
    alerta.remove();
  }, 3000);
}
