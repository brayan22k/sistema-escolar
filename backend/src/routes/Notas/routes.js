import express from 'express';

import notaController from '../../controllers/notaController.js';

import { autenticarToken } from '../../middlewares/authMiddleware.js';

import { permitirPerfis } from '../../middlewares/perfilMiddleware.js';


const router = express.Router();


// ======================================================
// LISTAR NOTAS
// ======================================================

router.get(
    '/',
    autenticarToken,
    notaController.listarNotas
);


// ======================================================
// CADASTRAR NOTA
// ======================================================

router.post(
    '/',
    autenticarToken,
    permitirPerfis('admin', 'professor'),
    notaController.cadastrarNota
);


// ======================================================
// EDITAR NOTA
// ======================================================

router.put(
    '/:id',
    autenticarToken,
    permitirPerfis('admin', 'professor'),
    notaController.editarNota
);


// ======================================================
// EXCLUIR NOTA
// ======================================================

router.delete(
    '/:id',
    autenticarToken,
    permitirPerfis('admin', 'professor'),
    notaController.excluirNota
);


// ======================================================
// LISTAR NOTAS DE UM ALUNO
// ======================================================

router.get(
    '/aluno/:id',
    autenticarToken,
    notaController.listarNotasPorAluno
);


export default router;