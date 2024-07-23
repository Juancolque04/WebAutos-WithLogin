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
    const configAutosLink = document.getElementById('configuracion-autos-link');
    const configClientesLink = document.getElementById('configuracion-clientes-link');

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
        } else {
            loginLink.style.display = 'block';
            logoutLink.style.display = 'none';
            configAutosLink.style.display = 'none';
            configClientesLink.style.display = 'none';
        }
    }

    async function listaAutos() {
        try {
            const token = localStorage.getItem('token');
            const cuerpoTabla = document.getElementById('bodyTabla');
            const response = await axios.get('http://localhost:3026/autos', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const cars = response.data;
            cuerpoTabla.innerHTML = `
                ${cars.map(car => `
                    <tr>
                        <td><img src="${car.imagen}" class="car-image"></td>
                        <td>${car.marca}</td>
                        <td>${car.modelo}</td>
                        <td>${car.año}</td>
                        <td>$${car.precio}</td>
                        <td>${car.tipo}</td>
                        <td>
                            <button id="btnSecundarios" onclick="eliminarAuto(${car.id})">Eliminar</button>
                            <button id="btnSecundarios" onclick="mostrarModalModificar(${car.id})">Modificar</button>
                        </td>
                    </tr>
                `).join('')}
            `;
        } catch (error) {
            console.error('Error fetching cars:', error);
            cuerpoTabla.innerHTML = '<p>Error al cargar los autos</p>';
        }
    }

    verificarAutenticacion();
    await listaAutos();
});

const btnAgregar = document.getElementById('btnAgregar');
btnAgregar.addEventListener('click', mostrarModal);

function mostrarModal() {
    const modalAgregar = document.getElementById('modalAgregar');
    modalAgregar.style.display = 'block';
}

document.getElementById('btnCerrar').addEventListener('click', cerrarModalAgregar);
function cerrarModalAgregar() {
    document.getElementById('modalAgregar').style.display = 'none';
}

const formAgregar = document.getElementById('formAgregar');
formAgregar.addEventListener('submit', agregarAuto);

async function agregarAuto(event) {
    event.preventDefault();

    const imagen = document.getElementById('imagen').value.trim();
    const marca = document.getElementById('marca').value.trim();
    const modelo = document.getElementById('modelo').value.trim();
    const año = document.getElementById('anio').value.trim();
    const precio = document.getElementById('precio').value.trim();
    const tipo = document.getElementById('tipo').value.trim();

    try {
        const nuevoAuto = {
            imagen: imagen,
            marca: marca,
            modelo: modelo,
            año: año,
            precio: precio,
            tipo: tipo
        };
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:3026/autos', nuevoAuto, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        listaAutos();
        cerrarModalAgregar();
    } catch (error) {
        console.error('Error al agregar el auto:', error);
    }
}

let idAutoEditar = 0;
window.mostrarModalModificar = async (id) => {
    idAutoEditar = id;
    const response = await axios.get('http://localhost:3026/autos');
    const cars = response.data;

    const modalModificar = document.getElementById('modalModificar');
    modalModificar.style.display = 'block';

    const autoSeleccionado = cars.find(auto => auto.id === id);

    if (autoSeleccionado) {
        document.getElementById('modificarImagen').value = autoSeleccionado.imagen;
        document.getElementById('modificarMarca').value = autoSeleccionado.marca;
        document.getElementById('modificarModelo').value = autoSeleccionado.modelo;
        document.getElementById('modificarAnio').value = autoSeleccionado.año;
        document.getElementById('modificarPrecio').value = autoSeleccionado.precio;
        document.getElementById('modificarTipo').value = autoSeleccionado.tipo;
    }
};

document.getElementById('btnCerrarModificar').addEventListener('click', cerrarModalModificar);
function cerrarModalModificar() {
    document.getElementById('modalModificar').style.display = 'none';
}

const formModificar = document.getElementById('formModificar');
formModificar.addEventListener('submit', modificarAuto);

async function modificarAuto(event) {
    event.preventDefault();

    const nImagen = document.getElementById('modificarImagen').value.trim();
    const nMarca = document.getElementById('modificarMarca').value.trim();
    const nModelo = document.getElementById('modificarModelo').value.trim();
    const nAño = parseInt(document.getElementById('modificarAnio').value.trim());
    const nPrecio = parseFloat(document.getElementById('modificarPrecio').value.trim());
    const nTipo = document.getElementById('modificarTipo').value.trim();

    try {
        const token = localStorage.getItem('token');
        await axios.put(`http://localhost:3026/autos/${idAutoEditar}`, {
            imagen: nImagen,
            marca: nMarca,
            modelo: nModelo,
            año: nAño,
            precio: nPrecio,
            tipo: nTipo
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        listaAutos();
        cerrarModalModificar();
    } catch (error) {
        console.error('Error al modificar el auto:', error);
    }
}

window.eliminarAuto = async (id) => {
    const confirmar = confirm('¿Estás seguro que deseas eliminar este auto?');
    if (confirmar) {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3026/autos/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            listaAutos();
        } catch (error) {
            console.error('Error al eliminar el auto:', error);
        }
    }
};
