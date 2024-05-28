document.addEventListener('DOMContentLoaded', async function () {
    const body = document.body;
    const menuTrigger = document.querySelector('.menu-trigger');

    if (menuTrigger) {
        menuTrigger.addEventListener('click', function () {
            body.classList.toggle('menu-active');
        });
    }

    const loginLink = document.getElementById('login-link');
    const logoutLink = document.getElementById('logout-link');
    const configLink = document.getElementById('configuracion-link');
    const viewContainer = document.getElementById('view-container');

    logoutLink.addEventListener('click', () => logout());

    function logout() {
        localStorage.removeItem('token');
        alert('Sesión cerrada');
        window.location.href = '/frontend/html/index.html';
    }

    function verificarAutenticacion() {
        const token = localStorage.getItem('token');
        if (token) {
            loginLink.style.display = 'none';
            logoutLink.style.display = 'block';

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

    async function mostrarAutos() {
        try {
            const response = await axios.get('http://localhost:3026/autos');
            const cars = response.data;
            viewContainer.innerHTML = `
                <div class="contenedorCards">
                    ${cars.map(car => `
                        <div class="card">
                            <img src="${car.imagen}" alt="${car.marca} ${car.modelo}" class="card__image">
                            <div class="card__content">
                                <p class="card__title">${car.marca}</p>
                                <p class="card__title">${car.modelo}</p>
                                <p class="card__title">${car.año}</p>
                                <p class="card__title">$${car.precio}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        } catch (error) {
            console.error('Error fetching cars:', error);
            viewContainer.innerHTML = '<p>Error al cargar los autos</p>';
        }
    }

    verificarAutenticacion();
    await mostrarAutos();
});
