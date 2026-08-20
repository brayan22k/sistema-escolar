import express from 'express';

import alunoController from '../../controllers/alunoController.js';

const routes = express.Router();


// ======================================================
// ALUNOS
// ======================================================

// LISTAR ALUNOS
// GET /alunos
routes.get(
    '/alunos',
    alunoController.listarAlunos
);


// CADASTRAR ALUNO
// POST /alunos
routes.post(
    '/alunos',
    alunoController.cadastrarAluno
);


// BUSCAR ALUNO POR ID
// GET /alunos/:id
routes.get(
    '/alunos/:id',
    alunoController.buscarAluno
);


// EDITAR ALUNO
// PUT /alunos/:id
routes.put(
    '/alunos/:id',
    alunoController.editarAluno
);


// EXCLUIR ALUNO
// DELETE /alunos/:id
routes.delete(
    '/alunos/:id',
    alunoController.excluirAluno
);


// ======================================================
// VINCULAR ALUNO À TURMA
// ======================================================

// PUT /alunos/:id/turma
routes.put(
    '/alunos/:id/turma',
    alunoController.vincularTurma
);


export default routes;