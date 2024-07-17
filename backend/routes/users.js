import express from 'express';
import fs from 'fs';
import { authenticateJWT } from '../middleware/authenticate.js'; // Importar el middleware de autenticación
import bcrypt from 'bcrypt';

const router = express.Router();

// Función para leer datos del archivo JSON
const cargarDatos = () => {
    try {
        const data = fs.readFileSync('./db.json');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al leer la información:', error);
        return { users: [], cars: [] }; // Asegúrate de incluir todos los datos necesarios
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

// Middleware para verificar el rol de admin
const authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Acceso no autorizado' });
    }
};

// Obtener todos los usuarios (solo admin)
router.get('/', authenticateJWT, authorizeAdmin, (req, res) => {
    try {
        const db = cargarDatos();
        res.json(db.users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Obtener un usuario por ID (solo admin)
router.get('/:id', authenticateJWT, authorizeAdmin, (req, res) => {
    const db = cargarDatos();
    const user = db.users.find(u => u.id === parseInt(req.params.id));
    if (user) {
        res.json(user);
    } else {
        res.status(404).send('Usuario no encontrado');
    }
});

// Crear un nuevo usuario (solo admin)
router.post('/', authenticateJWT, authorizeAdmin, async (req, res) => {
    try {
        const { username, password, role } = req.body;

        // Verificar si el usuario ya existe
        const db = cargarDatos();
        const existingUser = db.users.find(user => user.username === username);
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // Cifrar la contraseña antes de almacenarla
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el nuevo usuario
        const newUser = {
            id: db.users.length ? db.users[db.users.length - 1].id + 1 : 1,
            username,
            password: hashedPassword,
            role
        };

        // Agregar el nuevo usuario a la lista de usuarios
        db.users.push(newUser);
        guardarDatos(db);

        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creando usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Actualizar un usuario (solo admin)
router.put('/:id', authenticateJWT, authorizeAdmin, async (req, res) => {
    try {
        const { username, password, role } = req.body;

        // Cargar los datos actuales del archivo JSON
        const db = cargarDatos();

        // Encontrar el usuario por ID
        const userIndex = db.users.findIndex(u => u.id === parseInt(req.params.id));
        if (userIndex === -1) {
            return res.status(404).send('Usuario no encontrado');
        }

        // Actualizar los datos del usuario
        db.users[userIndex].username = username;
        db.users[userIndex].role = role;

        // Si se proporciona una nueva contraseña, cifrarla y actualizarla
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            db.users[userIndex].password = hashedPassword;
        }

        // Guardar los datos actualizados en el archivo JSON
        guardarDatos(db);

        res.json(db.users[userIndex]);
    } catch (error) {
        console.error('Error actualizando usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Eliminar un usuario (solo admin)
router.delete('/:id', authenticateJWT, authorizeAdmin, (req, res) => {
    const db = cargarDatos();
    const userIndex = db.users.findIndex(u => u.id === parseInt(req.params.id));
    if (userIndex !== -1) {
        const deletedUser = db.users.splice(userIndex, 1);
        guardarDatos(db);
        res.json(deletedUser[0]);
    } else {
        res.status(404).send('Usuario no encontrado');
    }
});

export default router;
