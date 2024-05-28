//funcion de la barra de nav
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
    const configLink = document.getElementById('configuracion-link');

    const viewContainer = document.getElementById('view-container');

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
                configLink.style.display = 'block';
            }
        } else {
            loginLink.style.display = 'block';
            logoutLink.style.display = 'none';
            configLink.style.display = 'none';
        }
    }

    verificarAutenticacion();
});


