import express from 'express';

import {
    listarProfessores,
    cadastrarProfessor,
    atualizarProfessor,
    excluirProfessor
} from '../../controllers/professorController.js';

import { autenticarToken } from '../../middlewares/authMiddleware.js';
import { permitirPerfis } from '../../middlewares/perfilMiddleware.js';

const router = express.Router();

router.get('/', autenticarToken, listarProfessores);

router.post(
    '/',
    autenticarToken,
    permitirPerfis('admin'),
    cadastrarProfessor
);

router.put(
    '/:id',
    autenticarToken,
    permitirPerfis('admin'),
    atualizarProfessor
);

router.delete(
    '/:id',
    autenticarToken,
    permitirPerfis('admin'),
    excluirProfessor
);

export default router;
