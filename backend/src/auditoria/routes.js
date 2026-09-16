import express from 'express';

import { listarAuditoria } from './auditoriaController.js';

import { autenticarToken } from '../middlewares/authMiddleware.js';

import { permitirPerfis } from '../middlewares/perfilMiddleware.js';


const router = express.Router();


// ======================================================
// AUDITORIA
// Somente administradores podem consultar
// ======================================================

router.get(
    '/',
    autenticarToken,
    permitirPerfis('admin'),
    listarAuditoria
);


export default router;