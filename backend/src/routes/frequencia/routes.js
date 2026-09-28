import express from 'express';

import {
    listarFrequenciaPorAluno,
    resumoFrequenciaPorAluno,
    cadastrarFrequencia,
    editarFrequencia,
    excluirFrequencia
} from '../../controllers/frequenciaController.js';

import { autenticarToken } from '../../middlewares/authMiddleware.js';
import { permitirPerfis } from '../../middlewares/perfilMiddleware.js';

const router = express.Router();


// ======================================================
// CONSULTA
// ======================================================

router.get(
    '/aluno/:id',
    autenticarToken,
    listarFrequenciaPorAluno
);

router.get(
    '/aluno/:id/resumo',
    autenticarToken,
    resumoFrequenciaPorAluno
);


// ======================================================
// ADMIN / PROFESSOR
// ======================================================

router.post(
    '/',
    autenticarToken,
    permitirPerfis('admin', 'professor'),
    cadastrarFrequencia
);

router.put(
    '/:id',
    autenticarToken,
    permitirPerfis('admin', 'professor'),
    editarFrequencia
);

router.delete(
    '/:id',
    autenticarToken,
    permitirPerfis('admin', 'professor'),
    excluirFrequencia
);


export default router;