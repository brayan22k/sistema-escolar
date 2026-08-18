// backend/src/routes/alunos/routes.js

import express from 'express';

import alunoController
    from '../../controllers/alunoController.js';


const routes = express.Router();


// ======================================================
// ALUNOS
// ======================================================

// LISTAR
routes.get(
    '/alunos',
    alunoController.listarAlunos
);


// CADASTRAR
routes.post(
    '/alunos',
    alunoController.cadastrarAluno
);


// BUSCAR POR ID
routes.get(
    '/alunos/:id',
    alunoController.buscarAluno
);


// EDITAR
routes.put(
    '/alunos/:id',
    alunoController.editarAluno
);


// EXCLUIR
routes.delete(
    '/alunos/:id',
    alunoController.excluirAluno
);


// ======================================================
// MISSÃO 002
// VINCULAR ALUNO À TURMA
// ======================================================

routes.put(
    '/alunos/:id/turma',
    alunoController.vincularTurma
);


export default routes;