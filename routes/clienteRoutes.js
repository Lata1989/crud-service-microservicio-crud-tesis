import express from 'express';
import {
    getClientes,
    createCliente,
    updateCliente,
    deleteCliente,
    searchClientesByDNI,
} from '../controllers/clienteController.js';

const router = express.Router();

router.get('/', getClientes);
router.post('/', createCliente);
router.put('/:id', updateCliente);
router.delete('/:id', deleteCliente);
router.get('/search/dni/:dni', searchClientesByDNI);

export default router;
