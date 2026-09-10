import express from 'express';

import {
    loginProfessor,
    login
} from '../../controllers/authController.js';

import { autenticarToken } from '../../middlewares/authMiddleware.js';
import { permitirPerfis } from '../../middlewares/perfilMiddleware.js';

const router = express.Router();

// ======================================================
// LOGIN ANTIGO DO PROFESSOR
// ======================================================
router.post('/login-professor', loginProfessor);

// ======================================================
// LOGIN COM JWT
// ======================================================
router.post('/login', login);

// ======================================================
// VERIFICAR USUÁRIO LOGADO
// ======================================================
router.get('/me', autenticarToken, (req, res) => {
    res.json({
        mensagem: 'Acesso autorizado!',
        usuario: req.usuario
    });
});

// ======================================================
// TESTE DE ACESSO EXCLUSIVO DO ADMIN
// ======================================================
router.get(
    '/teste-admin',
    autenticarToken,
    permitirPerfis('admin'),
    (req, res) => {
        res.json({
            mensagem: 'Acesso de administrador autorizado!'
        });
    }
);

export default router;