import Disciplina from '../models/Disciplina.js';

// ==========================================
// LISTAR DISCIPLINAS
// ==========================================

async function listarDisciplinas(req, res) {
    try {
        const disciplinas = await Disciplina.findAll({
            order: [['id', 'DESC']]
        });

        res.status(200).json(disciplinas);

    } catch (erro) {
        console.error('Erro ao listar disciplinas:', erro);

        res.status(500).json({
            mensagem: 'Erro ao listar disciplinas.',
            erro: erro.message
        });
    }
}

// ==========================================
// BUSCAR DISCIPLINA
// ==========================================

async function buscarDisciplina(req, res) {
    try {
        const { id } = req.params;

        const disciplina = await Disciplina.findByPk(id);

        if (!disciplina) {
            return res.status(404).json({
                mensagem: 'Disciplina não encontrada.'
            });
        }

        res.status(200).json(disciplina);

    } catch (erro) {
        console.error('Erro ao buscar disciplina:', erro);

        res.status(500).json({
            mensagem: 'Erro ao buscar disciplina.',
            erro: erro.message
        });
    }
}

// ==========================================
// CRIAR DISCIPLINA
// ==========================================

async function criarDisciplina(req, res) {
    try {
        const {
            nome,
            descricao
        } = req.body;

        if (!nome || !nome.trim()) {
            return res.status(400).json({
                mensagem: 'O nome da disciplina é obrigatório.'
            });
        }

        const disciplinaExistente = await Disciplina.findOne({
            where: {
                nome: nome.trim()
            }
        });

        if (disciplinaExistente) {
            return res.status(409).json({
                mensagem: 'Esta disciplina já está cadastrada.'
            });
        }

        const disciplina = await Disciplina.create({
            nome: nome.trim(),
            descricao: descricao || ''
        });

        res.status(201).json(disciplina);

    } catch (erro) {
        console.error('Erro ao criar disciplina:', erro);

        res.status(500).json({
            mensagem: 'Erro ao cadastrar disciplina.',
            erro: erro.message
        });
    }
}

// ==========================================
// ATUALIZAR DISCIPLINA
// ==========================================

async function atualizarDisciplina(req, res) {
    try {
        const { id } = req.params;

        const disciplina = await Disciplina.findByPk(id);

        if (!disciplina) {
            return res.status(404).json({
                mensagem: 'Disciplina não encontrada.'
            });
        }

        const {
            nome,
            descricao
        } = req.body;

        if (!nome || !nome.trim()) {
            return res.status(400).json({
                mensagem: 'O nome da disciplina é obrigatório.'
            });
        }

        await disciplina.update({
            nome: nome.trim(),
            descricao: descricao || ''
        });

        res.status(200).json(disciplina);

    } catch (erro) {
        console.error('Erro ao atualizar disciplina:', erro);

        res.status(500).json({
            mensagem: 'Erro ao atualizar disciplina.',
            erro: erro.message
        });
    }
}

// ==========================================
// EXCLUIR DISCIPLINA
// ==========================================

async function excluirDisciplina(req, res) {
    try {
        const { id } = req.params;

        const disciplina = await Disciplina.findByPk(id);

        if (!disciplina) {
            return res.status(404).json({
                mensagem: 'Disciplina não encontrada.'
            });
        }

        await disciplina.destroy();

        res.status(200).json({
            mensagem: 'Disciplina excluída com sucesso.'
        });

    } catch (erro) {
        console.error('Erro ao excluir disciplina:', erro);

        res.status(500).json({
            mensagem: 'Erro ao excluir disciplina.',
            erro: erro.message
        });
    }
}

export {
    listarDisciplinas,
    buscarDisciplina,
    criarDisciplina,
    atualizarDisciplina,
    excluirDisciplina
};