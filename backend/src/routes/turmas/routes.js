import express from 'express';

import {
    listarTurmas,
    cadastrarTurma,
    buscarTurma,
    editarTurma,
    excluirTurma
} from '../../controllers/turmaController.js';

import { autenticarToken } from '../../middlewares/authMiddleware.js';
import { permitirPerfis } from '../../middlewares/perfilMiddleware.js';

const router = express.Router();

// LISTAR TURMAS
router.get(
    '/',
    autenticarToken,
    listarTurmas
);

// CADASTRAR TURMA - SOMENTE ADMIN
router.post(
    '/',
    autenticarToken,
    permitirPerfis('admin'),
    cadastrarTurma
);

// BUSCAR TURMA
router.get(
    '/:id',
    autenticarToken,
    buscarTurma
);

// EDITAR TURMA - SOMENTE ADMIN
router.put(
    '/:id',
    autenticarToken,
    permitirPerfis('admin'),
    editarTurma
);

// EXCLUIR TURMA - SOMENTE ADMIN
router.delete(
    '/:id',
    autenticarToken,
    permitirPerfis('admin'),
    excluirTurma
);

export default router;