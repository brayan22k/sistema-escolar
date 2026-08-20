import express from 'express';

import {
    listarDisciplinas,
    buscarDisciplina,
    criarDisciplina,
    atualizarDisciplina,
    excluirDisciplina
} from '../../controllers/disciplinaController.js';

const router = express.Router();


// ======================================================
// LISTAR DISCIPLINAS
// GET /disciplinas
// ======================================================

router.get('/', listarDisciplinas);


// ======================================================
// BUSCAR DISCIPLINA
// GET /disciplinas/:id
// ======================================================

router.get('/:id', buscarDisciplina);


// ======================================================
// CADASTRAR DISCIPLINA
// POST /disciplinas
// ======================================================

router.post('/', criarDisciplina);


// ======================================================
// ATUALIZAR DISCIPLINA
// PUT /disciplinas/:id
// ======================================================

router.put('/:id', atualizarDisciplina);


// ======================================================
// EXCLUIR DISCIPLINA
// DELETE /disciplinas/:id
// ======================================================

router.delete('/:id', excluirDisciplina);


export default router;