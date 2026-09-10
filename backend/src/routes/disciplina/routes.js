import express from 'express';

import {
    listarDisciplinas,
    buscarDisciplina,
    criarDisciplina,
    atualizarDisciplina,
    excluirDisciplina
} from '../../controllers/disciplinaController.js';

import { autenticarToken } from '../../middlewares/authMiddleware.js';
import { permitirPerfis } from '../../middlewares/perfilMiddleware.js';

const router = express.Router();

// LISTAR DISCIPLINAS
router.get(
    '/',
    autenticarToken,
    listarDisciplinas
);

// BUSCAR DISCIPLINA
router.get(
    '/:id',
    autenticarToken,
    buscarDisciplina
);

// CRIAR DISCIPLINA - SOMENTE ADMIN
router.post(
    '/',
    autenticarToken,
    permitirPerfis('admin'),
    criarDisciplina
);

// EDITAR DISCIPLINA - SOMENTE ADMIN
router.put(
    '/:id',
    autenticarToken,
    permitirPerfis('admin'),
    atualizarDisciplina
);

// EXCLUIR DISCIPLINA - SOMENTE ADMIN
router.delete(
    '/:id',
    autenticarToken,
    permitirPerfis('admin'),
    excluirDisciplina
);

export default router;