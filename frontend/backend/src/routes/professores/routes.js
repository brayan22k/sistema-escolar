import express from 'express';

import {
    listarProfessores,
    cadastrarProfessor,
    atualizarProfessor,
    excluirProfessor
} from '../../controllers/professorController.js';

import { autenticarToken } from '../../middlewares/authMiddleware.js';
import { permitirPerfis } from '../../middlewares/perfilMiddleware.js';

const router = express.Router();

console.log('ARQUIVO PROFESSORES ROUTES FOI CARREGADO');

// ==========================================
// LISTAR PROFESSORES
// ==========================================
router.get(
    '/',
    autenticarToken,
    listarProfessores
);

// ==========================================
// CADASTRAR PROFESSOR - SOMENTE ADMIN
// ==========================================
router.post(
    '/',
    autenticarToken,
    permitirPerfis('admin'),
    cadastrarProfessor
);

// ==========================================
// ATUALIZAR PROFESSOR - SOMENTE ADMIN
// ==========================================
router.put(
    '/:id',
    autenticarToken,
    permitirPerfis('admin'),
    atualizarProfessor
);

// ==========================================
// EXCLUIR PROFESSOR - SOMENTE ADMIN
// ==========================================
router.delete(
    '/:id',
    autenticarToken,
    permitirPerfis('admin'),
    excluirProfessor
);

export default router;