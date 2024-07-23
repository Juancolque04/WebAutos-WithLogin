document.addEventListener('DOMContentLoaded', async function () {
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
                configAutosLink.style.display = 'block';
                configClientesLink.style.display = 'block';
            }

            welcomeMessage.textContent = `¡Bienvenido, ${payload.username}!`;
        } else {
            loginLink.style.display = 'block';
            logoutLink.style.display = 'none';
            configAutosLink.style.display = 'none';
            configClientesLink.style.display = 'none';
            welcomeMessage.innerHTML = 'Por favor, <a href="/frontend/html/login.html">Iniciar Sesión</a> para poder comprar un auto.';
        }
    }

    async function mostrarAutos(tipoFiltro = 'todos') {
        try {
            const response = await axios.get('http://localhost:3026/autos');
            let cars = response.data;

            if (tipoFiltro !== 'todos') {
                cars = cars.filter(car => car.tipo === tipoFiltro);
            }

            viewContainer.innerHTML = `
                <div class="contenedorCards">
                    ${cars.map(car => `
                        <div class="card">
                            <img src="${car.imagen}" alt="${car.marca} ${car.modelo}" class="card__image">
                            <div class="card__content">
                                 <div class="card__text">
                                     <p class="card__title">${car.marca}</p>
                                     <p class="card__title">${car.modelo}</p>
                                     <p class="card__title">${car.año}</p>
                                     <p class="card__title">$${car.precio}</p>
                                 </div>
                                 <div class="card__button">
                                     <button class="btnComprar" onclick="abrirModalFormaPago(${car.id}, '${car.modelo}')" >Comprar</button>
                                 </div>
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

    window.filtrarAutos = (tipo) => {
        mostrarAutos(tipo);
    };
});

let autoIdSeleccionado = null;
let modeloAutoSeleccionado = null;
window.abrirModalFormaPago = (autoId, modelo) => {

    autoIdSeleccionado = autoId;
    modeloAutoSeleccionado = modelo;
    
    const modalFormaPago = document.getElementById('modalFormaPago');
    modalFormaPago.style.display = 'block';

    const btnSeleccionarPago = document.getElementById('btnSeleccionarPago');
    btnSeleccionarPago.onclick = function () {
        const metodoPagoSeleccionado = document.querySelector('input[name="payment"]:checked').value;
        if (metodoPagoSeleccionado) {
            window.location.href = `/frontend/html/pago.html?autoId=${autoIdSeleccionado}&modelo=${modeloAutoSeleccionado}&metodoPago=${metodoPagoSeleccionado}`;
        } else {
            alert('Por favor, seleccione un método de pago');
        }
    };
}
