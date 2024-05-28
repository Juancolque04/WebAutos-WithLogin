import express from 'express';
import fs from 'fs';
import { authenticateJWT } from '../middleware/authenticate.js';

const router = express.Router();

const cargarDatos = () => {
    try {
        const data = fs.readFileSync('./db.json');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al leer la información:', error);
        return { users: [], cars: [] }; 
    }
}; 

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

// Obtener todos los autos (accesible para todos los usuarios, autenticados o no)
router.get('/', (req, res) => {
    try {
        const db = cargarDatos();
        res.json(db.cars);
    } catch (error) {
        console.error('Error fetching cars:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Obtener un auto por ID (solo admin)
router.get('/:id', authenticateJWT, authorizeAdmin, (req, res) => {
    const db = cargarDatos();
    const car = db.cars.find(c => c.id === parseInt(req.params.id));
    if (car) {
        res.json(car);
    } else {
        res.status(404).send('Auto no encontrado');
    }
});

// Crear un nuevo auto (solo admin)
router.post('/', authenticateJWT, authorizeAdmin, (req, res) => {
    const db = cargarDatos();
    const newCar = {
        id: db.cars.length ? db.cars[db.cars.length - 1].id + 1 : 1,
        ...req.body
    };
    db.cars.push(newCar);
    guardarDatos(db);
    res.status(201).json(newCar);
});

// Actualizar un auto (solo admin)
router.put('/:id', authenticateJWT, authorizeAdmin, (req, res) => {
    const db = cargarDatos();
    const carIndex = db.cars.findIndex(c => c.id === parseInt(req.params.id));
    if (carIndex !== -1) {
        db.cars[carIndex] = { id: parseInt(req.params.id), ...req.body };
        guardarDatos(db);
        res.json(db.cars[carIndex]);
    } else {
        res.status(404).send('Auto no encontrado');
    }
});

// Eliminar un auto (solo admin)
router.delete('/:id', authenticateJWT, authorizeAdmin, (req, res) => {
    const db = cargarDatos();
    const carIndex = db.cars.findIndex(c => c.id === parseInt(req.params.id));
    if (carIndex !== -1) {
        const deletedCar = db.cars.splice(carIndex, 1);
        guardarDatos(db);
        res.json(deletedCar[0]);
    } else {
        res.status(404).send('Auto no encontrado');
    }
});

export default router;
