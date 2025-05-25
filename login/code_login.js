function login() {

    const userInput = document.getElementById('user');
    const passwordInput = document.getElementById('password');

    const user = userInput.value.trim();
    const password = passwordInput.value.trim();

    let error = false;
    
    // Validar el campo de usuario
    if (user !== 'admin') {
        userInput.classList.add('input-error');
        alert('El usuario es incorrecto');
        error = true;
    } else {
        userInput.classList.remove('input-error');
    }
    if (password !== "1234") {
        passwordInput.classList.add('input-error');
        alert('La contraseña es incorrecta');
        error = true;
    } else {
        passwordInput.classList.remove('input-error');
    }


    if (error) {
        alert('Por favor, corrija los errores antes de enviar el formulario');
        return; // Detener el envío del formulario
    }else if (user === "admin" && password === "1234") {
        localStorage.setItem("logueado", "true");
        window.location.href = "../parqueadero/index.html";
    }
};