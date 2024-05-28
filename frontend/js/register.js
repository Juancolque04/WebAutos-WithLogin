
async function handleRegister(event) {

    event.preventDefault();

    const fullName = document.getElementById('fullName').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await axios.post('http://localhost:3026/auth/register', {
            username,
            password
        });

        if (response.status === 201) {
            const { message, user } = response.data;
            alert(message);

            // Redirige al usuario a la página de inicio de sesión después del registro
            window.location.href = '/frontend/html/login.html';
        } else {
            alert('Registro fallido');
        }
    } catch (error) {
        console.error('Error al registrar:', error);
        alert('Error al registrar');
    }
};
const registerForm = document.getElementById('registerForm');
registerForm.addEventListener('submit', handleRegister);

