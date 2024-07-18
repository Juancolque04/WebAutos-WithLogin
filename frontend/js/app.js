document.addEventListener('DOMContentLoaded', function () {
    const body = document.body;
    const menuTrigger = document.querySelector('.menu-trigger');

    if (menuTrigger) {
        menuTrigger.addEventListener('click', function () {
            body.classList.toggle('menu-active');
        });
    }
    // Elementos de la barra de navegación
    const loginLink = document.getElementById('login-link');
    const logoutLink = document.getElementById('logout-link');
    const configAutosLink = document.getElementById('configuracion-autos-link');
    const configClientesLink = document.getElementById('configuracion-clientes-link');
    const welcomeMessage = document.getElementById('welcome-message');

    logoutLink.addEventListener('click', () => logout());
    function logout() {
        localStorage.removeItem('token'); // Elimina el token almacenado
        alert('Sesión cerrada');
        window.location.href = '/frontend/html/index.html';
    }

    // Verificar el estado de autenticación
    function verificarAutenticacion() {
        const token = localStorage.getItem('token');
        if (token) {
            loginLink.style.display = 'none';
            logoutLink.style.display = 'block';

            // Decodificar el token para obtener el rol del usuario
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload.role === 'admin') {
                configAutosLink.style.display = 'block';
                configClientesLink.style.display = 'block';
            }

            // Actualizar el mensaje de bienvenida
            welcomeMessage.textContent = `¡Bienvenido, ${payload.username}!`;
        } else {
            loginLink.style.display = 'block';
            logoutLink.style.display = 'none';
            configAutosLink.style.display = 'none';
            configClientesLink.style.display = 'none';

            // Actualizar el mensaje de bienvenida con un enlace al formulario de login
            welcomeMessage.innerHTML = 'Por favor, <a href="/frontend/html/login.html">Iniciar Sesión</a> para poder comprar un auto.';
        }
    }

    verificarAutenticacion();
});
