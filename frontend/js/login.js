
async function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await axios.post('http://localhost:3026/auth/login', {
            username,
            password
        });

        const { message, token, user } = response.data;

        if (response.status === 200) {
            alert(message);

            // Almacena el token JWT en localStorage
            localStorage.setItem('token', token);

            // Almacena el rol del usuario en localStorage
            localStorage.setItem('role', user.role);

            // Redirecciona según el rol del usuario
            window.location.href = '/frontend/html/index.html';
        } else {
            alert('Credenciales inválidas');
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        alert('Error al iniciar sesión');
    }

};

const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', handleLogin);