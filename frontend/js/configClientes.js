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

    async function listaClientes() {
        try {
            const token = localStorage.getItem('token');
            const cuerpoTabla = document.getElementById('bodyTabla');
            const response = await axios.get('http://localhost:3026/users', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const users = response.data;
            cuerpoTabla.innerHTML = `
                ${users.map(user => `
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.username}</td>
                        <td>${user.password}</td>
                        <td>${user.role}</td>
                        <td>
                            <button id="btnSecundarios" onclick="eliminarCliente(${user.id})">Eliminar</button>
                            <button id="btnSecundarios" onclick="mostrarModalModificar(${user.id})">Modificar</button>
                        </td>
                    </tr>
                `).join('')}
            `;
        } catch (error) {
            console.error('Error fetching users:', error);
            cuerpoTabla.innerHTML = '<p>Error al cargar los clientes</p>';
        }
    }

    verificarAutenticacion();
    await listaClientes();
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
formAgregar.addEventListener('submit', agregarCliente);

async function agregarCliente(event) {
    event.preventDefault();

    const usuario = document.getElementById('usuario').value.trim();
    const contraseña = document.getElementById('contraseña').value.trim();
    const rol = document.getElementById('rol').value.trim();

    try {
        const nuevoCliente = {
            username: usuario,
            password: contraseña,
            role: rol
        };
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:3026/users', nuevoCliente, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        listaClientes();
        cerrarModalAgregar();
    } catch (error) {
        console.error('Error al agregar el cliente:', error);
    }
}

let idUserEditar = 0;
window.mostrarModalModificar = async (id) => {
    idUserEditar = id;
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:3026/users', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    const user = response.data;

    const modalModificar = document.getElementById('modalModificar');
    modalModificar.style.display = 'block';

    const userSeleccionado = user.find(usuario => usuario.id === id);

    if (userSeleccionado) {
        document.getElementById('idClienteModificar').value = userSeleccionado.id;
        document.getElementById('modificarUsuario').value = userSeleccionado.username;
        document.getElementById('modificarContraseña').value = userSeleccionado.password;
        document.getElementById('modificarRol').value = userSeleccionado.role;
    }
}

document.getElementById('btnCerrarModificar').addEventListener('click', cerrarModalModificar);
function cerrarModalModificar() {
    document.getElementById('modalModificar').style.display = 'none';
}

const formModificar = document.getElementById('formModificar');
formModificar.addEventListener('submit', modificarCliente);

async function modificarCliente(event) {
    event.preventDefault();

    const nUsuario = document.getElementById('modificarUsuario').value.trim();
    const nContraseña = document.getElementById('modificarContraseña').value.trim();
    const nRol = document.getElementById('modificarRol').value.trim();

    try {
        const token = localStorage.getItem('token');
        await axios.put(`http://localhost:3026/users/${idUserEditar}`, {
            username: nUsuario,
            password: nContraseña,
            role: nRol
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        listaClientes();
        cerrarModalModificar();
    } catch (error) {
        console.error('Error al modificar el cliente:', error);
    }
}

window.eliminarCliente = async (id) => {
    const confirmar = confirm('¿Estás seguro que deseas eliminar este cliente?');
    if (confirmar) {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3026/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            listaClientes();
        } catch (error) {
            console.error('Error al eliminar el cliente:', error);
        }
    }
}
