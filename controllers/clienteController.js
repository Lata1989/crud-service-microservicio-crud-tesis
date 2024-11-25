import { getDB } from '../config/db.js';
import { ObjectId } from 'mongodb'; // Para manejar IDs en MongoDB

// Obtener todos los clientes
export const getClientes = async (req, res) => {
    try {
        const db = getDB();
        const { search, page = 1, limit = 10 } = req.query;

        const query = search
            ? {
                  $or: [
                      { name: { $regex: search, $options: 'i' } },
                      { lastname: { $regex: search, $options: 'i' } },
                      { dni: search },
                      { cuit: search },
                  ],
                  deletedAt: null, // Excluir clientes "borrados"
              }
            : { deletedAt: null };

        const clientes = await db
            .collection('clientes')
            .find(query)
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .toArray();

        res.json(clientes);
    } catch (error) {
        console.error('Error al obtener clientes:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// Función para buscar clientes por coincidencias parciales en el DNI
export const searchClientesByDNI = async (req, res) => {
    try {
        const db = getDB();
        const { dni } = req.params;

        if (!dni) {
            return res.status(400).json({ message: 'El DNI es obligatorio para buscar clientes' });
        }

        const query = {
            dni: { $regex: dni, $options: 'i' }, // Búsqueda parcial (case insensitive)
            deletedAt: null, // Excluir clientes "borrados"
        };

        const clientes = await db.collection('clientes').find(query).toArray();

        if (clientes.length === 0) {
            return res.status(404).json({ message: 'No se encontraron clientes con el DNI proporcionado' });
        }

        res.json(clientes);
    } catch (error) {
        console.error('Error al buscar clientes por DNI:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// Crear un cliente
export const createCliente = async (req, res) => {
    try {
        const db = getDB();
        const newCliente = { ...req.body, createdAt: new Date(), deletedAt: null };

        await db.collection('clientes').insertOne(newCliente);
        res.status(201).json({ message: 'Cliente creado con éxito', cliente: newCliente });
    } catch (error) {
        console.error('Error al crear cliente:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// Actualizar un cliente
export const updateCliente = async (req, res) => {
    try {
        const db = getDB();
        const { id } = req.params;
        const updateFields = req.body;

        const result = await db.collection('clientes').updateOne(
            { _id: new ObjectId(id) },
            { $set: updateFields }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        res.json({ message: 'Cliente actualizado con éxito' });
    } catch (error) {
        console.error('Error al actualizar cliente:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// Eliminar un cliente (lógico)
export const deleteCliente = async (req, res) => {
    try {
        const db = getDB();
        const { id } = req.params;

        const result = await db.collection('clientes').updateOne(
            { _id: new ObjectId(id) },
            { $set: { deletedAt: new Date() } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        res.json({ message: 'Cliente eliminado con éxito' });
    } catch (error) {
        console.error('Error al eliminar cliente:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};
