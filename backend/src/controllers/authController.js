import Professor from '../models/Professor.js';
import Usuario from '../models/Usuario.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// ======================================================
// LOGIN ANTIGO DO PROFESSOR
// ======================================================

export async function loginProfessor(req, res) {
    try {
        const { usuario, senha } = req.body;

        if (!usuario || !senha) {
            return res.status(400).json({
                erro: 'Usuário e senha são obrigatórios'
            });
        }

        const professor = await Professor.findOne({
            where: { usuario }
        });

        if (!professor) {
            return res.status(401).json({
                erro: 'Usuário ou senha inválidos'
            });
        }

        if (professor.senha !== senha) {
            return res.status(401).json({
                erro: 'Usuário ou senha inválidos'
            });
        }

        return res.json({
            mensagem: 'Login realizado com sucesso!',
            professor: {
                id: professor.id,
                nome: professor.nome,
                usuario: professor.usuario
            }
        });

    } catch (erro) {
        console.error('ERRO REAL NO LOGIN:', erro);

        return res.status(500).json({
            erro: 'Erro ao realizar login',
            detalhes: erro.message
        });
    }
}


// ======================================================
// LOGIN COM JWT
// ======================================================

export async function login(req, res) {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                erro: 'E-mail e senha são obrigatórios'
            });
        }

        const usuario = await Usuario.findOne({
            where: { email }
        });

        if (!usuario) {
            return res.status(401).json({
                erro: 'E-mail ou senha inválidos'
            });
        }

        const senhaValida = await bcrypt.compare(
            senha,
            usuario.senha
        );

        if (!senhaValida) {
            return res.status(401).json({
                erro: 'E-mail ou senha inválidos'
            });
        }

        const token = jwt.sign(
            {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                perfil: usuario.perfil
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h'
            }
        );

        return res.status(200).json({
            mensagem: 'Login realizado com sucesso!',
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                perfil: usuario.perfil
            }
        });

    } catch (erro) {
        console.error('ERRO NO LOGIN JWT:', erro);

        return res.status(500).json({
            erro: 'Erro ao realizar login'
        });
    }
}