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

            mensagem:
                'Acesso autorizado!',

            usuario:
                req.usuario

        });

    }
);


// ======================================================
// RECUPERAR SENHA
// ======================================================
//
// O usuário informa apenas o e-mail.
// Não precisa estar logado.
//

router.post(
    '/recuperar-senha',
    recuperarSenha
);


// ======================================================
// TESTE DA ROTA DE ALTERAÇÃO DE SENHA
// ======================================================
//
// Esta rota GET apenas confirma que a rota existe.
// Ela NÃO altera a senha.
//

router.get(
    '/alterar-senha',

    (req, res) => {

        res.status(200).json({

            mensagem:
                'Rota de alteração de senha funcionando!',

            metodo:
                'PUT',

            rota:
                '/auth/alterar-senha'

        });

    }
);


// ======================================================
// ALTERAR SENHA
// ======================================================
//
// Precisa estar autenticado.
//
// Header:
//
// Authorization: Bearer SEU_TOKEN
//
// Body:
//
// {
//     "senhaAtual": "senha antiga",
//     "novaSenha": "senha nova"
// }
//

router.put(
    '/alterar-senha',

    autenticarToken,

    alterarSenha
);


// ======================================================
// TESTE ADMIN
// ======================================================
//
// Somente administrador pode acessar.
//

router.get(
    '/teste-admin',

    autenticarToken,

    permitirPerfis('admin'),

    (req, res) => {

        res.status(200).json({

            mensagem:
                'Acesso de administrador autorizado!'

        });

    }
);


// ======================================================
// EXPORTAR ROTAS
// ======================================================

export default router;