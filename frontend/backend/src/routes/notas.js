// backend/src/routes/notas/routes.js

import express from 'express';

import notaController
    from '../../controllers/notaController.js';


const routes = express.Router();


// ======================================================
// NOTAS
// ======================================================


// LISTAR TODAS
routes.get(
    '/notas',
    notaController.listarNotas
);


// LISTAR NOTAS DO ALUNO
routes.get(
    '/notas/aluno/:alunoId',
    notaController.listarNotasPorAluno
);


// BOLETIM DO ALUNO
routes.get(
    '/notas/boletim/:alunoId',
    notaController.boletimAluno
);


// CADASTRAR OU ATUALIZAR
routes.post(
    '/notas',
    notaController.cadastrarOuAtualizarNota
);


// EXCLUIR
routes.delete(
    '/notas/:id',
    notaController.excluirNota
);


export default routes;