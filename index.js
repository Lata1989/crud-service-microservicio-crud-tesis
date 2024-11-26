import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import clienteRoutes from './routes/clienteRoutes.js';

dotenv.config(); // Cargar variables de entorno

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors()); // Habilitamos CORS desde cualquier origen
app.use(express.json());

// Ruta base de prueba
app.get('/', (req, res) => {
    res.send('¡El microservicio de CRUD de clientes está funcionando!');
});

// Rutas
app.use('/clientes', clienteRoutes);

// Iniciar servidor tras conexión a DB
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en el puerto: ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error al iniciar servidor:', error);
        process.exit(1);
    });
