import express from 'express';
import authRoutes from './routes/auth.js'; // Importa las rutas de auth.js
import autosRoutes from './routes/autos.js'
import usersRoutes from './routes/users.js'
import cors from 'cors';

const app = express();
const port = 3026;

// Permite solicitudes CORS desde el origen de tu frontend
app.use(cors({ origin: 'http://127.0.0.1:5500' }));
// Configurar servidor para recibir datos JSON
app.use(express.json());

//Utiliza las rutas de autenticación desde auth.js
app.use('/auth', authRoutes);
//Utiliza las rutas de autenticación desde cars.js
app.use('/autos', autosRoutes);
// Utiliza las nuevas rutas de clientes desde clientes.js
app.use('/users', usersRoutes);

app.listen(port, ()=> {
    console.log(`Servidor corriendo en el puerto ${port}`)
})
