import express from 'express';

import notaController from '../../controllers/notaController.js';

const router = express.Router();


// ======================================================
// LISTAR TODAS AS NOTAS
// GET /api/notas
// ======================================================

router.get('/', notaController.listarNotas);


// ======================================================
// CADASTRAR NOTA
// POST /api/notas
// ======================================================

router.post('/', notaController.cadastrarNota);


// ======================================================
// LISTAR NOTAS DE UM ALUNO
// GET /api/notas/aluno/:id
// ======================================================

router.get(
    '/aluno/:id',
    notaController.listarNotasPorAluno
);


export default router;