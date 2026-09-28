// ======================================================
// ROTAS DE AUTENTICAÇÃO
// ======================================================

import express from 'express';

// ======================================================
// CONTROLLERS
// ======================================================

import {
    loginProfessor,
    login,
    alterarSenha,
    recuperarSenha
} from '../../controllers/authController.js';

// ======================================================
// MIDDLEWARES
// ======================================================

import { autenticarToken } from '../../middlewares/authMiddleware.js';
import { permitirPerfis } from '../../middlewares/perfilMiddleware.js';

// ======================================================
// ROUTER
// ======================================================

const router = express.Router();

// ======================================================
// TESTE AUTH
// ======================================================

router.get(
    '/teste',
    (req, res) => {
        res.status(200).json({
            mensagem: 'AUTH funcionando!',
            rota: '/auth/teste'
        });
    }
);

// ======================================================
// LOGIN DO PROFESSOR
// ======================================================

router.post(
    '/login-professor',
    loginProfessor
);

// ======================================================
// LOGIN PRINCIPAL
// ======================================================

router.post(
    '/login',
    login
);

// ======================================================
// VERIFICAR TOKEN
// ======================================================

router.get(
    '/me',
    autenticarToken,
    (req, res) => {
        res.status(200).json({
            mensagem: 'Acesso autorizado!',
            usuario: req.usuario
        });
    }
);

// ======================================================
// RECUPERAR SENHA
// ======================================================

router.post(
    '/recuperar-senha',
    recuperarSenha
);

// ======================================================
// TESTE DA ROTA DE ALTERAÇÃO DE SENHA
// ======================================================

router.get(
    '/alterar-senha',
    (req, res) => {
        res.status(200).json({
            mensagem: 'Rota de alteração de senha funcionando!',
            metodo: 'PUT',
            rota: '/auth/alterar-senha'
        });
    }
);

// ======================================================
// ALTERAR SENHA
// ======================================================

router.put(
    '/alterar-senha',
    autenticarToken,
    alterarSenha
);

// ======================================================
// TESTE ADMIN
// ======================================================

router.get(
    '/teste-admin',
    autenticarToken,
    permitirPerfis('admin'),
    (req, res) => {
        res.status(200).json({
            mensagem: 'Acesso de administrador autorizado!'
        });
    }
);

// ======================================================
// EXPORTAR
// ======================================================

export default router;