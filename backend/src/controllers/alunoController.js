import bcrypt from 'bcryptjs';

import Aluno from '../models/Aluno.js';

import Usuario from '../models/Usuario.js';


// ======================================================
// LISTAR ALUNOS
// ======================================================

const listarAlunos = async (req, res) => {
    try {
        const alunos = await Aluno.findAll();

        return res.status(200).json(alunos);
    } catch (erro) {
        console.error('Erro ao listar alunos:', erro);

        return res.status(500).json({
            erro: 'Erro ao listar alunos'
        });
    }
};


// ======================================================
// CADASTRAR ALUNO
// ======================================================

const cadastrarAluno = async (req, res) => {
    try {
        const {
            nome,
            email,
            data_nascimento,
            serie,
            cpf,
            telefone,
            endereco,
            fk_turma
        } = req.body;

        if (!nome || !email) {
            return res.status(400).json({
                erro: 'Nome e email são obrigatórios'
            });
        }

        const alunoExistente = await Aluno.findOne({
            where: {
                email
            }
        });

        if (alunoExistente) {
            return res.status(409).json({
                erro: 'Já existe um aluno cadastrado com este email'
            });
        }

        const aluno = await Aluno.create({
            nome,
            email,
            data_nascimento,
            serie,
            cpf,
            telefone,
            endereco,
            fk_turma
        });

        return res.status(201).json({
            mensagem: 'Aluno cadastrado com sucesso',
            aluno
        });
    } catch (erro) {
        console.error('Erro ao cadastrar aluno:', erro);

        return res.status(500).json({
            erro: 'Erro ao cadastrar aluno'
        });
    }
};


// ======================================================
// BUSCAR ALUNO
// ======================================================

const buscarAluno = async (req, res) => {
    try {
        const { id } = req.params;

        const aluno = await Aluno.findByPk(id);

        if (!aluno) {
            return res.status(404).json({
                erro: 'Aluno não encontrado'
            });
        }

        return res.status(200).json(aluno);
    } catch (erro) {
        console.error('Erro ao buscar aluno:', erro);

        return res.status(500).json({
            erro: 'Erro ao buscar aluno'
        });
    }
};


// ======================================================
// EDITAR ALUNO
// ======================================================

const editarAluno = async (req, res) => {
    try {
        const { id } = req.params;

        const aluno = await Aluno.findByPk(id);

        if (!aluno) {
            return res.status(404).json({
                erro: 'Aluno não encontrado'
            });
        }

        const {
            nome,
            email,
            data_nascimento,
            serie,
            cpf,
            telefone,
            endereco,
            fk_turma
        } = req.body;

        if (email && email !== aluno.email) {
            const emailExistente = await Aluno.findOne({
                where: {
                    email
                }
            });

            if (emailExistente && emailExistente.id !== aluno.id) {
                return res.status(409).json({
                    erro: 'Já existe outro aluno cadastrado com este email'
                });
            }
        }

        await aluno.update({
            nome: nome ?? aluno.nome,
            email: email ?? aluno.email,
            data_nascimento:
                data_nascimento ?? aluno.data_nascimento,
            serie: serie ?? aluno.serie,
            cpf: cpf ?? aluno.cpf,
            telefone: telefone ?? aluno.telefone,
            endereco: endereco ?? aluno.endereco,
            fk_turma: fk_turma ?? aluno.fk_turma
        });

        return res.status(200).json({
            mensagem: 'Aluno atualizado com sucesso',
            aluno
        });
    } catch (erro) {
        console.error('Erro ao editar aluno:', erro);

        return res.status(500).json({
            erro: 'Erro ao editar aluno'
        });
    }
};


// ======================================================
// EXCLUIR ALUNO
// ======================================================

const excluirAluno = async (req, res) => {
    try {
        const { id } = req.params;

        const aluno = await Aluno.findByPk(id);

        if (!aluno) {
            return res.status(404).json({
                erro: 'Aluno não encontrado'
            });
        }

        await aluno.destroy();

        return res.status(200).json({
            mensagem: 'Aluno excluído com sucesso'
        });
    } catch (erro) {
        console.error('Erro ao excluir aluno:', erro);

        return res.status(500).json({
            erro: 'Erro ao excluir aluno'
        });
    }
};


// ======================================================
// VINCULAR ALUNO À TURMA
// ======================================================

const vincularTurma = async (req, res) => {
    try {
        const { id } = req.params;
        const { fk_turma } = req.body;

        const aluno = await Aluno.findByPk(id);

        if (!aluno) {
            return res.status(404).json({
                erro: 'Aluno não encontrado'
            });
        }

        await aluno.update({
            fk_turma
        });

        return res.status(200).json({
            mensagem: 'Aluno vinculado à turma com sucesso',
            aluno
        });
    } catch (erro) {
        console.error('Erro ao vincular aluno à turma:', erro);

        return res.status(500).json({
            erro: 'Erro ao vincular aluno à turma'
        });
    }
};


// ======================================================
// CRIAR CREDENCIAL DO ALUNO
// MISSÃO 008
// ======================================================

const criarCredencial = async (req, res) => {
    try {
        const { id } = req.params;

        const { senha } = req.body;

        // --------------------------------------------------
        // VALIDAÇÃO DA SENHA
        // --------------------------------------------------

        if (!senha) {
            return res.status(400).json({
                erro: 'A senha é obrigatória'
            });
        }

        if (typeof senha !== 'string') {
            return res.status(400).json({
                erro: 'A senha deve ser um texto'
            });
        }

        if (senha.length < 6) {
            return res.status(400).json({
                erro: 'A senha deve possuir pelo menos 6 caracteres'
            });
        }

        // --------------------------------------------------
        // BUSCAR ALUNO
        // --------------------------------------------------

        const aluno = await Aluno.findByPk(id);

        if (!aluno) {
            return res.status(404).json({
                erro: 'Aluno não encontrado'
            });
        }

        // --------------------------------------------------
        // VERIFICAR SE JÁ EXISTE CREDENCIAL
        // --------------------------------------------------

        const credencialExistente = await Usuario.findOne({
            where: {
                aluno_id: aluno.id
            }
        });

        if (credencialExistente) {
            return res.status(409).json({
                erro: 'Este aluno já possui uma credencial de acesso'
            });
        }

        // --------------------------------------------------
        // VERIFICAR EMAIL
        // --------------------------------------------------

        const emailExistente = await Usuario.findOne({
            where: {
                email: aluno.email
            }
        });

        if (emailExistente) {
            return res.status(409).json({
                erro: 'O email deste aluno já está sendo utilizado por outro usuário'
            });
        }

        // --------------------------------------------------
        // GERAR HASH DA SENHA
        // --------------------------------------------------

        const senhaHash = await bcrypt.hash(senha, 10);

        // --------------------------------------------------
        // CRIAR USUÁRIO
        // --------------------------------------------------

        const usuario = await Usuario.create({
            nome: aluno.nome,
            email: aluno.email,
            senha: senhaHash,
            perfil: 'aluno',
            aluno_id: aluno.id
        });

        // --------------------------------------------------
        // NÃO DEVOLVER SENHA/HASH
        // --------------------------------------------------

        return res.status(201).json({
            mensagem: 'Credencial do aluno criada com sucesso',
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                perfil: usuario.perfil,
                aluno_id: usuario.aluno_id
            }
        });
    } catch (erro) {
        console.error('Erro ao criar credencial do aluno:', erro);

        return res.status(500).json({
            erro: 'Erro ao criar credencial do aluno'
        });
    }
};


// ======================================================
// EXPORTAÇÕES
// ======================================================

export default {
    listarAlunos,
    cadastrarAluno,
    buscarAluno,
    editarAluno,
    excluirAluno,
    vincularTurma,
    criarCredencial
};