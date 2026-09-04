import Professor from '../models/Professor.js';
import bcrypt from 'bcrypt';

// ==========================================
// LISTAR PROFESSORES
// ==========================================
async function listarProfessores(req, res) {
    try {
        const professores = await Professor.findAll({
            attributes: {
                exclude: ['senha']
            }
        });

        return res.status(200).json(professores);

    } catch (erro) {
        console.error('ERRO AO LISTAR PROFESSORES:', erro);

        return res.status(500).json({
            erro: 'Erro ao listar professores'
        });
    }
}

// ==========================================
// CADASTRAR PROFESSOR
// ==========================================
async function cadastrarProfessor(req, res) {
    try {
        const {
            nome,
            email,
            disciplina,
            usuario,
            senha
        } = req.body;

        if (!nome || !email || !disciplina) {
            return res.status(400).json({
                erro: 'Nome, email e disciplina são obrigatórios'
            });
        }

        const professorExistente = await Professor.findOne({
            where: { email }
        });

        if (professorExistente) {
            return res.status(409).json({
                erro: 'Já existe um professor com este email'
            });
        }

        let senhaHash = null;

        if (senha) {
            senhaHash = await bcrypt.hash(senha, 10);
        }

        const professor = await Professor.create({
            nome,
            email,
            disciplina,
            usuario,
            senha: senhaHash
        });

        return res.status(201).json({
            mensagem: 'Professor cadastrado com sucesso!',
            professor: {
                id: professor.id,
                nome: professor.nome,
                email: professor.email,
                disciplina: professor.disciplina,
                usuario: professor.usuario
            }
        });

    } catch (erro) {
        console.error('ERRO AO CADASTRAR PROFESSOR:', erro);

        return res.status(500).json({
            erro: 'Erro ao cadastrar professor',
            detalhes: erro.message
        });
    }
}

// ==========================================
// BUSCAR PROFESSOR POR ID
// ==========================================
async function buscarProfessor(req, res) {
    try {
        const { id } = req.params;

        const professor = await Professor.findByPk(id, {
            attributes: {
                exclude: ['senha']
            }
        });

        if (!professor) {
            return res.status(404).json({
                erro: 'Professor não encontrado'
            });
        }

        return res.status(200).json(professor);

    } catch (erro) {
        console.error('ERRO AO BUSCAR PROFESSOR:', erro);

        return res.status(500).json({
            erro: 'Erro ao buscar professor'
        });
    }
}

// ==========================================
// EDITAR PROFESSOR
// ==========================================
async function editarProfessor(req, res) {
    try {
        const { id } = req.params;

        const {
            nome,
            email,
            disciplina,
            usuario,
            senha
        } = req.body;

        const professor = await Professor.findByPk(id);

        if (!professor) {
            return res.status(404).json({
                erro: 'Professor não encontrado'
            });
        }

        const dadosAtualizados = {
            nome,
            email,
            disciplina,
            usuario
        };

        if (senha) {
            dadosAtualizados.senha = await bcrypt.hash(senha, 10);
        }

        await professor.update(dadosAtualizados);

        return res.status(200).json({
            mensagem: 'Professor atualizado com sucesso!'
        });

    } catch (erro) {
        console.error('ERRO AO EDITAR PROFESSOR:', erro);

        return res.status(500).json({
            erro: 'Erro ao editar professor',
            detalhes: erro.message
        });
    }
}

// ==========================================
// EXCLUIR PROFESSOR
// ==========================================
async function excluirProfessor(req, res) {
    try {
        const { id } = req.params;

        const professor = await Professor.findByPk(id);

        if (!professor) {
            return res.status(404).json({
                erro: 'Professor não encontrado'
            });
        }

        await professor.destroy();

        return res.status(200).json({
            mensagem: 'Professor excluído com sucesso!'
        });

    } catch (erro) {
        console.error('ERRO AO EXCLUIR PROFESSOR:', erro);

        return res.status(500).json({
            erro: 'Erro ao excluir professor'
        });
    }
}

// ==========================================
// EXPORTAÇÕES
// ==========================================
export {
    listarProfessores,
    cadastrarProfessor,
    atualizarProfessor,
    excluirProfessor
};