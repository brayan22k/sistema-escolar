// backend/src/routes/notas/routes.js

import express from 'express';

import notaController
    from '../../controllers/notaController.js';


const routes = express.Router();


// ======================================================
// NOTAS — MISSÃO 003
// ======================================================

// LISTAR TODAS
routes.get(
    '/notas',
    notaController.listarNotas
);


// CADASTRAR
routes.post(
    '/notas',
    notaController.cadastrarNota
);


// CONSULTAR NOTAS DE UM ALUNO
routes.get(
    '/notas/aluno/:id',
    notaController.listarNotasPorAluno
);


export default routes;