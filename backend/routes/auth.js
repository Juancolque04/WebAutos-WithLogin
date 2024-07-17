import express from 'express';
import fs from 'fs';
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken';

const router = express.Router();

// Función para leer datos del archivo JSON
const cargarDatos = () => {
    try {
        const data = fs.readFileSync('./db.json');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al leer la información:', error);
        return { users: [] }; 
    }
}; 

// Función para escribir datos en el archivo JSON
const guardarDatos = (data) => {
    try {
        fs.writeFileSync('./db.json', JSON.stringify(data));
    } catch (error) {
        console.error('Error al escribir la información:', error);
    }
};

// Función para autenticar a un usuario
const authenticateUser = (username, password) => {
    const data = cargarDatos();
    console.log("Autenticación: " + JSON.stringify(data, null, 2));
    const user = data.users.find(user => user.username === username);
    if (user && bcrypt.compareSync(password, user.password)) {
        return user;
    }
    return null;
};

// Función para registrar un nuevo usuario
const registerUser = (username, password, role) => {
    const data = cargarDatos();

    // Verificar si el usuario ya existe
    const existingUser = data.users.find(user => user.username === username);
    if (existingUser) {
        return null;
    }

    // Cifrar la contraseña antes de almacenarla
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Crear un nuevo usuario
    const newUser = {
        id: data.users.length + 1,
        username,
        password: hashedPassword,
        role
    };

    // Agregar el nuevo usuario a los datos
    data.users.push(newUser);
    guardarDatos(data);

    return newUser;
};

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Autenticar al usuario
    const user = authenticateUser(username, password);
    
    if (user) {
        // Generar token JWT
        const token = jwt.sign({ username: user.username, role: user.role }, 'your_secret_key', { expiresIn: '1h' });
        res.status(200).json({
            message: 'Login successful',
            token: token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });
    } else {
        res.status(401).json({
            message: 'Invalid credentials'
        });
    }
});

router.post('/register', (req, res) => {
    const { username, password, role } = req.body;

    // Registrar al nuevo usuario
    const newUser = registerUser(username, password, role);

    if (newUser) {
        // Si el registro es exitoso, responder con información del nuevo usuario
        res.status(201).json({
            message: 'Registration successful',
            user: {
                id: newUser.id,
                username: newUser.username,
                role: newUser.role
            }
        });
    } else {
        // Si el registro falla, responder con un mensaje de error
        res.status(400).json({
            message: 'Registration failed'
        });
    }
});

export default router;
