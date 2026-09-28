// backend/src/routes/Notas/routes.js
// MISSÃO 003 — OPERAÇÃO BOLETIM DIGITAL
// MISSÃO 008 — PORTAL DO ALUNO

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
// LISTAR MINHAS NOTAS
// MISSÃO 008 — PORTAL DO ALUNO
// ======================================================
//
// O aluno somente poderá visualizar as próprias notas.
//
// O aluno_id não vem da URL.
// Ele é obtido através do JWT:
//
// req.usuario.aluno_id
//
// ======================================================

router.get(

    '/minhas',

    autenticarToken,

    permitirPerfis('aluno'),

    notaController.listarMinhasNotas

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