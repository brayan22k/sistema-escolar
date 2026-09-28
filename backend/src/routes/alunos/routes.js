import express from 'express';

import alunoController from '../../controllers/alunoController.js';

import { autenticarToken } from '../../middlewares/authMiddleware.js';

import { permitirPerfis } from '../../middlewares/perfilMiddleware.js';


const router = express.Router();


// ======================================================
// LISTAR ALUNOS
// ======================================================

router.get(
    '/',
    autenticarToken,
    alunoController.listarAlunos
);


// ======================================================
// CADASTRAR ALUNO
// SOMENTE ADMIN
// ======================================================

router.post(
    '/',
    autenticarToken,
    permitirPerfis('admin'),
    alunoController.cadastrarAluno
);


// ======================================================
// CRIAR CREDENCIAL DO ALUNO
// MISSÃO 008
// SOMENTE ADMIN
// ======================================================

router.post(
    '/:id/credencial',
    autenticarToken,
    permitirPerfis('admin'),
    alunoController.criarCredencial
);


// ======================================================
// BUSCAR ALUNO POR ID
// ======================================================

router.get(
    '/:id',
    autenticarToken,
    alunoController.buscarAluno
);


// ======================================================
// EDITAR ALUNO
// SOMENTE ADMIN
// ======================================================

router.put(
    '/:id',
    autenticarToken,
    permitirPerfis('admin'),
    alunoController.editarAluno
);


// ======================================================
// EXCLUIR ALUNO
// SOMENTE ADMIN
// ======================================================

router.delete(
    '/:id',
    autenticarToken,
    permitirPerfis('admin'),
    alunoController.excluirAluno
);


// ======================================================
// VINCULAR ALUNO À TURMA
// ADMIN OU PROFESSOR
// ======================================================

router.put(
    '/:id/turma',
    autenticarToken,
    permitirPerfis('admin', 'professor'),
    alunoController.vincularTurma
);


export default router;