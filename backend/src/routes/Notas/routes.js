import express from 'express';

import notaController from '../../controllers/notaController.js';

import { autenticarToken } from '../../middlewares/authMiddleware.js';
import { permitirPerfis } from '../../middlewares/perfilMiddleware.js';

const router = express.Router();

// ======================================================
// LISTAR TODAS AS NOTAS
// GET /api/notas
// ======================================================

router.get(
    '/',
    autenticarToken,
    notaController.listarNotas
);

// ======================================================
// CADASTRAR NOTA
// POST /api/notas
// SOMENTE ADMIN OU PROFESSOR
// ======================================================

router.post(
    '/',
    autenticarToken,
    permitirPerfis('admin', 'professor'),
    notaController.cadastrarNota
);

// ======================================================
// LISTAR NOTAS DE UM ALUNO
// GET /api/notas/aluno/:id
// ======================================================

router.get(
    '/aluno/:id',
    autenticarToken,
    notaController.listarNotasPorAluno
);

export default router;