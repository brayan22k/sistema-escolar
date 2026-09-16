// ======================================================
// AUTH CONTROLLER
// SISTEMA ESCOLAR
// ======================================================

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import Usuario from '../models/Usuario.js';
import Professor from '../models/Professor.js';

import { registrarAuditoria } from '../auditoria/auditoriaService.js';


// ======================================================
// CONFIGURAÇÃO JWT
// ======================================================

const JWT_SECRET =
    process.env.JWT_SECRET ||
    'segredo-sistema-escolar';

const JWT_EXPIRES_IN = '8h';


// ======================================================
// LOGIN DO PROFESSOR
// ======================================================

export async function loginProfessor(req, res) {

    try {

        const { usuario, senha } = req.body || {};


        // --------------------------------------------------
        // VALIDAR CAMPOS
        // --------------------------------------------------

        if (!usuario || !senha) {

            return res.status(400).json({
                erro: 'Informe o usuário e a senha.'
            });

        }


        // --------------------------------------------------
        // BUSCAR PROFESSOR
        // --------------------------------------------------

        const professor = await Professor.findOne({
            where: {
                usuario
            }
        });


        // --------------------------------------------------
        // PROFESSOR NÃO ENCONTRADO
        // --------------------------------------------------

        if (!professor) {

            await registrarAuditoria({

                usuario_id: null,

                usuario_nome: usuario,

                perfil: 'professor',

                operacao: 'LOGIN_RECUSADO',

                recurso: 'AUTH',

                recurso_id: null,

                detalhes:
                    'Tentativa de login de professor com usuário inexistente'

            });


            return res.status(401).json({
                erro: 'Usuário ou senha inválidos.'
            });

        }


        // --------------------------------------------------
        // VERIFICAR SENHA
        // --------------------------------------------------

        const senhaValida =
            await bcrypt.compare(
                senha,
                professor.senha
            );


        // --------------------------------------------------
        // SENHA INCORRETA
        // --------------------------------------------------

        if (!senhaValida) {

            await registrarAuditoria({

                usuario_id: professor.id,

                usuario_nome: professor.nome,

                perfil: 'professor',

                operacao: 'LOGIN_RECUSADO',

                recurso: 'AUTH',

                recurso_id: professor.id,

                detalhes:
                    'Tentativa de login de professor com senha incorreta'

            });


            return res.status(401).json({
                erro: 'Usuário ou senha inválidos.'
            });

        }


        // --------------------------------------------------
        // GERAR TOKEN
        // --------------------------------------------------

        const token = jwt.sign(

            {
                id: professor.id,

                nome: professor.nome,

                email: professor.email,

                perfil: 'professor'

            },

            JWT_SECRET,

            {
                expiresIn: JWT_EXPIRES_IN
            }

        );


        // --------------------------------------------------
        // AUDITORIA LOGIN SUCESSO
        // --------------------------------------------------

        await registrarAuditoria({

            usuario_id: professor.id,

            usuario_nome: professor.nome,

            perfil: 'professor',

            operacao: 'LOGIN_SUCESSO',

            recurso: 'AUTH',

            recurso_id: professor.id,

            detalhes:
                'Login de professor realizado com sucesso'

        });


        // --------------------------------------------------
        // RESPOSTA
        // --------------------------------------------------

        return res.status(200).json({

            mensagem:
                'Login realizado com sucesso!',

            token,

            professor: {

                id: professor.id,

                nome: professor.nome,

                email: professor.email,

                perfil: 'professor'

            }

        });


    } catch (erro) {

        console.error(
            'ERRO NO LOGIN DO PROFESSOR:',
            erro
        );


        return res.status(500).json({

            erro:
                'Erro interno ao realizar login.'

        });

    }

}


// ======================================================
// LOGIN PRINCIPAL
// ======================================================

export async function login(req, res) {

    try {

        const { email, senha } =
            req.body || {};


        // --------------------------------------------------
        // VALIDAR CAMPOS
        // --------------------------------------------------

        if (!email || !senha) {

            return res.status(400).json({

                erro:
                    'Informe o e-mail e a senha.'

            });

        }


        // --------------------------------------------------
        // LIMPAR E-MAIL
        // --------------------------------------------------

        const emailLimpo =
            email.trim();


        // --------------------------------------------------
        // BUSCAR USUÁRIO
        // --------------------------------------------------

        const usuario =
            await Usuario.findOne({

                where: {
                    email: emailLimpo
                }

            });


        // --------------------------------------------------
        // USUÁRIO NÃO EXISTE
        // --------------------------------------------------

        if (!usuario) {

            await registrarAuditoria({

                usuario_id: null,

                usuario_nome: emailLimpo,

                perfil: null,

                operacao:
                    'LOGIN_RECUSADO',

                recurso:
                    'AUTH',

                recurso_id: null,

                detalhes:
                    'Tentativa de login com usuário inexistente'

            });


            return res.status(401).json({

                erro:
                    'E-mail ou senha inválidos'

            });

        }


        // --------------------------------------------------
        // VERIFICAR SENHA
        // --------------------------------------------------

        const senhaValida =
            await bcrypt.compare(
                senha,
                usuario.senha
            );


        // --------------------------------------------------
        // SENHA INCORRETA
        // --------------------------------------------------

        if (!senhaValida) {

            await registrarAuditoria({

                usuario_id:
                    usuario.id,

                usuario_nome:
                    usuario.nome,

                perfil:
                    usuario.perfil,

                operacao:
                    'LOGIN_RECUSADO',

                recurso:
                    'AUTH',

                recurso_id:
                    usuario.id,

                detalhes:
                    'Tentativa de login com senha incorreta'

            });


            return res.status(401).json({

                erro:
                    'E-mail ou senha inválidos'

            });

        }


        // --------------------------------------------------
        // GERAR TOKEN
        // --------------------------------------------------

        const token =
            jwt.sign(

                {
                    id:
                        usuario.id,

                    nome:
                        usuario.nome,

                    email:
                        usuario.email,

                    perfil:
                        usuario.perfil
                },

                JWT_SECRET,

                {
                    expiresIn:
                        JWT_EXPIRES_IN
                }

            );


        // --------------------------------------------------
        // AUDITORIA LOGIN SUCESSO
        // --------------------------------------------------

        await registrarAuditoria({

            usuario_id:
                usuario.id,

            usuario_nome:
                usuario.nome,

            perfil:
                usuario.perfil,

            operacao:
                'LOGIN_SUCESSO',

            recurso:
                'AUTH',

            recurso_id:
                usuario.id,

            detalhes:
                'Login realizado com sucesso'

        });


        // --------------------------------------------------
        // RESPOSTA
        // --------------------------------------------------

        return res.status(200).json({

            mensagem:
                'Login realizado com sucesso!',

            token,

            usuario: {

                id:
                    usuario.id,

                nome:
                    usuario.nome,

                email:
                    usuario.email,

                perfil:
                    usuario.perfil

            }

        });


    } catch (erro) {

        console.error(
            'ERRO NO LOGIN:',
            erro
        );


        return res.status(500).json({

            erro:
                'Erro interno ao realizar login.'

        });

    }

}


// ======================================================
// ALTERAR SENHA
// ======================================================

export async function alterarSenha(req, res) {

    try {

        // --------------------------------------------------
        // VERIFICAR AUTENTICAÇÃO
        // --------------------------------------------------

        if (
            !req.usuario ||
            !req.usuario.id
        ) {

            return res.status(401).json({

                erro:
                    'Usuário não autenticado.'

            });

        }


        // --------------------------------------------------
        // RECEBER DADOS
        // --------------------------------------------------

        const {
            senhaAtual,
            novaSenha
        } = req.body || {};


        // --------------------------------------------------
        // VALIDAR CAMPOS
        // --------------------------------------------------

        if (
            !senhaAtual ||
            !novaSenha
        ) {

            return res.status(400).json({

                erro:
                    'Informe a senha atual e a nova senha.'

            });

        }


        // --------------------------------------------------
        // VALIDAR TAMANHO
        // --------------------------------------------------

        if (
            novaSenha.length < 6
        ) {

            return res.status(400).json({

                erro:
                    'A nova senha deve ter pelo menos 6 caracteres.'

            });

        }


        // --------------------------------------------------
        // IMPEDIR MESMA SENHA
        // --------------------------------------------------

        if (
            senhaAtual === novaSenha
        ) {

            return res.status(400).json({

                erro:
                    'A nova senha deve ser diferente da senha atual.'

            });

        }


        // --------------------------------------------------
        // BUSCAR USUÁRIO
        // --------------------------------------------------

        const usuario =
            await Usuario.findByPk(
                req.usuario.id
            );


        // --------------------------------------------------
        // USUÁRIO NÃO ENCONTRADO
        // --------------------------------------------------

        if (!usuario) {

            return res.status(404).json({

                erro:
                    'Usuário não encontrado.'

            });

        }


        // --------------------------------------------------
        // CONFERIR SENHA ATUAL
        // --------------------------------------------------

        const senhaAtualValida =
            await bcrypt.compare(
                senhaAtual,
                usuario.senha
            );


        // --------------------------------------------------
        // SENHA ATUAL INCORRETA
        // --------------------------------------------------

        if (!senhaAtualValida) {

            await registrarAuditoria({

                req,

                operacao:
                    'ALTERAR_SENHA_RECUSADO',

                recurso:
                    'USUARIO',

                recurso_id:
                    usuario.id,

                detalhes:
                    'Tentativa de alteração de senha com senha atual incorreta'

            });


            return res.status(401).json({

                erro:
                    'A senha atual está incorreta.'

            });

        }


        // --------------------------------------------------
        // GERAR HASH
        // --------------------------------------------------

        const novaSenhaHash =
            await bcrypt.hash(
                novaSenha,
                10
            );


        // --------------------------------------------------
        // SALVAR
        // --------------------------------------------------

        usuario.senha =
            novaSenhaHash;


        await usuario.save();


        // --------------------------------------------------
        // AUDITORIA
        // --------------------------------------------------

        await registrarAuditoria({

            req,

            operacao:
                'ALTERAR_SENHA',

            recurso:
                'USUARIO',

            recurso_id:
                usuario.id,

            detalhes:
                'Senha do usuário alterada com sucesso'

        });


        // --------------------------------------------------
        // RESPOSTA
        // --------------------------------------------------

        return res.status(200).json({

            mensagem:
                'Senha alterada com sucesso!'

        });


    } catch (erro) {

        console.error(
            'ERRO AO ALTERAR SENHA:',
            erro
        );


        return res.status(500).json({

            erro:
                'Erro ao alterar a senha.'

        });

    }

}


// ======================================================
// RECUPERAR SENHA
// ======================================================
//
// Esta rota recebe o e-mail e registra a solicitação.
// O envio real de e-mail será configurado posteriormente.
// ======================================================

export async function recuperarSenha(req, res) {

    try {

        // --------------------------------------------------
        // RECEBER E-MAIL
        // --------------------------------------------------

        const { email } =
            req.body || {};


        // --------------------------------------------------
        // VALIDAR
        // --------------------------------------------------

        if (
            !email ||
            !email.trim()
        ) {

            return res.status(400).json({

                erro:
                    'Digite o e-mail da sua conta.'

            });

        }


        const emailLimpo =
            email.trim();


        // --------------------------------------------------
        // BUSCAR USUÁRIO
        // --------------------------------------------------

        const usuario =
            await Usuario.findOne({

                where: {
                    email: emailLimpo
                }

            });


        // --------------------------------------------------
        // RESPOSTA PADRÃO
        // --------------------------------------------------
        //
        // Mesmo que o usuário não exista, não revelamos isso
        // diretamente na resposta.
        //
        // Isso evita expor quais e-mails estão cadastrados.
        // --------------------------------------------------

        const mensagemPadrao =
            'Se o e-mail estiver cadastrado, as instruções de recuperação serão enviadas.';


        // --------------------------------------------------
        // E-MAIL NÃO CADASTRADO
        // --------------------------------------------------

        if (!usuario) {

            await registrarAuditoria({

                usuario_id:
                    null,

                usuario_nome:
                    emailLimpo,

                perfil:
                    null,

                operacao:
                    'RECUPERACAO_SENHA',

                recurso:
                    'AUTH',

                recurso_id:
                    null,

                detalhes:
                    'Solicitação de recuperação de senha recebida'

            });


            return res.status(200).json({

                mensagem:
                    mensagemPadrao

            });

        }


        // --------------------------------------------------
        // AUDITORIA
        // --------------------------------------------------

        await registrarAuditoria({

            usuario_id:
                usuario.id,

            usuario_nome:
                usuario.nome,

            perfil:
                usuario.perfil,

            operacao:
                'RECUPERACAO_SENHA',

            recurso:
                'AUTH',

            recurso_id:
                usuario.id,

            detalhes:
                'Solicitação de recuperação de senha recebida'

        });


        // --------------------------------------------------
        // RESPOSTA
        // --------------------------------------------------

        return res.status(200).json({

            mensagem:
                mensagemPadrao

        });


    } catch (erro) {

        console.error(
            'ERRO NA RECUPERAÇÃO DE SENHA:',
            erro
        );


        return res.status(500).json({

            erro:
                'Não foi possível solicitar a recuperação da senha.'

        });

    }

}