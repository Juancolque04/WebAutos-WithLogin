let idAutoEditar = null;

const inputImagen = document.getElementById('imagen');
const inputMarca = document.getElementById('marca');
const inputModelo = document.getElementById('modelo');
const inputAño = document.getElementById('anio');
const inputPrecio = document.getElementById('precio');

const inputImagenM = document.getElementById('modificarImagen');
const inputMarcaM = document.getElementById('modificarMarca');
const inputModeloM = document.getElementById('modificarModelo');
const inputAñoM = document.getElementById('modificarAnio');
const inputPrecioM = document.getElementById('modificarPrecio');

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
                        <td><button id="btnSecundarios" onclick="eliminarAuto(${car.id})">Eliminar</button>
                        <button id="btnSecundarios" onclick="mostrarModalModificar(${car.id})">Modificar</button></td>
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

    const imagen = inputImagen.value.trim();
    const marca = inputMarca.value.trim();
    const modelo = inputModelo.value.trim();
    const año = inputAño.value.trim();
    const precio = inputPrecio.value.trim();

    try {
        const nuevoAuto = {
            imagen: imagen,
            marca: marca,
            modelo: modelo,
            año: año,
            precio: precio
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

window.mostrarModalModificar = async (id) => {
    idAutoEditar = id;
    const response = await axios.get('http://localhost:3026/autos');
    const cars = response.data;

    const modalModificar = document.getElementById('modalModificar');
    modalModificar.style.display = 'block';

    const autoSeleccionado = cars.find(auto => auto.id === id);

    if (autoSeleccionado) {
        inputImagenM.value = autoSeleccionado.imagen;
        inputMarcaM.value = autoSeleccionado.marca;
        inputModeloM.value = autoSeleccionado.modelo;
        inputAñoM.value = autoSeleccionado.año;
        inputPrecioM.value = autoSeleccionado.precio;
    }
}

document.getElementById('btnCerrarModificar').addEventListener('click', cerrarModalModificar);
function cerrarModalModificar() {
    document.getElementById('modalModificar').style.display = 'none';
}

const formModificar = document.getElementById('formModificar');
formModificar.addEventListener('submit', modificarAuto);

async function modificarAuto(event) {
    event.preventDefault();

    const nImagen = inputImagenM.value.trim();
    const nMarca = inputMarcaM.value.trim();
    const nModelo = inputModeloM.value.trim();
    const nAño = parseFloat(inputAñoM.value.trim());
    const nPrecio = parseFloat(inputPrecioM.value.trim());

    if (nImagen && nMarca && nModelo && nAño && nPrecio && idAutoEditar) {
        try {
            const autoModificado = {
                imagen: nImagen,
                marca: nMarca,
                modelo: nModelo,
                año: nAño,
                precio: nPrecio
            };
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:3026/autos/${idAutoEditar}`, autoModificado, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            idAutoEditar = null;
            listaAutos();
            cerrarModalModificar();
        } catch (error) {
            console.error('Error al editar el auto:', error);
        }
    }
}

window.eliminarAuto = async (id) => {
    try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:3026/autos/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        await listaAutos();
    } catch (error) {
        console.error('Error eliminando el auto:', error);
    }
};
