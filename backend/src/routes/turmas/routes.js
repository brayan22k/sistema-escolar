import express from 'express';

import {
    listarTurmas,
    cadastrarTurma,
    buscarTurma,
    editarTurma,
    excluirTurma
} from '../../controllers/turmaController.js';

const router = express.Router();


// ======================================================
// LISTAR TODAS AS TURMAS
// GET /turmas
// ======================================================

router.get('/', listarTurmas);


// ======================================================
// CADASTRAR TURMA
// POST /turmas
// ======================================================

router.post('/', cadastrarTurma);


// ======================================================
// BUSCAR TURMA POR ID
// GET /turmas/:id
// ======================================================

router.get('/:id', buscarTurma);


// ======================================================
// EDITAR TURMA
// PUT /turmas/:id
// ======================================================

router.put('/:id', editarTurma);


// ======================================================
// EXCLUIR TURMA
// DELETE /turmas/:id
// ======================================================

router.delete('/:id', excluirTurma);


export default router;