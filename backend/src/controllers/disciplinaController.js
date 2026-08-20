import Disciplina from '../models/Disciplina.js';

// ======================================================
// LISTAR TODAS AS DISCIPLINAS
// GET /disciplinas
// ======================================================
export async function listarDisciplinas(req, res) {
    try {
        const disciplinas = await Disciplina.findAll();

        return res.status(200).json(disciplinas);
    } catch (erro) {
        console.error('Erro ao listar disciplinas:', erro);

        return res.status(500).json({
            erro: 'Erro ao listar disciplinas',
            detalhe: erro.message
        });
    }
}

// ======================================================
// BUSCAR DISCIPLINA POR ID
// GET /disciplinas/:id
// ======================================================
export async function buscarDisciplina(req, res) {
    try {
        const { id } = req.params;

        const disciplina = await Disciplina.findByPk(id);

        if (!disciplina) {
            return res.status(404).json({
                erro: 'Disciplina não encontrada'
            });
        }

        return res.status(200).json(disciplina);
    } catch (erro) {
        console.error('Erro ao buscar disciplina:', erro);

        return res.status(500).json({
            erro: 'Erro ao buscar disciplina',
            detalhe: erro.message
        });
    }
}

// ======================================================
// CRIAR DISCIPLINA
// POST /disciplinas
// ======================================================
export async function criarDisciplina(req, res) {
    try {
        const { nome, descricao } = req.body;

        if (!nome || nome.trim() === '') {
            return res.status(400).json({
                erro: 'O nome da disciplina é obrigatório'
            });
        }

        const disciplina = await Disciplina.create({
            nome: nome.trim(),
            descricao: descricao || null
        });

        return res.status(201).json(disciplina);
    } catch (erro) {
        console.error('Erro ao criar disciplina:', erro);

        return res.status(500).json({
            erro: 'Erro ao criar disciplina',
            detalhe: erro.message
        });
    }
}

// ======================================================
// ATUALIZAR DISCIPLINA
// PUT /disciplinas/:id
// ======================================================
export async function atualizarDisciplina(req, res) {
    try {
        const { id } = req.params;
        const { nome, descricao } = req.body;

        const disciplina = await Disciplina.findByPk(id);

        if (!disciplina) {
            return res.status(404).json({
                erro: 'Disciplina não encontrada'
            });
        }

        if (nome !== undefined && nome.trim() === '') {
            return res.status(400).json({
                erro: 'O nome da disciplina não pode ficar vazio'
            });
        }

        await disciplina.update({
            nome: nome !== undefined ? nome.trim() : disciplina.nome,
            descricao: descricao !== undefined
                ? descricao
                : disciplina.descricao
        });

        return res.status(200).json(disciplina);
    } catch (erro) {
        console.error('Erro ao atualizar disciplina:', erro);

        return res.status(500).json({
            erro: 'Erro ao atualizar disciplina',
            detalhe: erro.message
        });
    }
}

// ======================================================
// EXCLUIR DISCIPLINA
// DELETE /disciplinas/:id
// ======================================================
export async function excluirDisciplina(req, res) {
    try {
        const { id } = req.params;

        const disciplina = await Disciplina.findByPk(id);

        if (!disciplina) {
            return res.status(404).json({
                erro: 'Disciplina não encontrada'
            });
        }

        await disciplina.destroy();

        return res.status(200).json({
            mensagem: 'Disciplina excluída com sucesso'
        });
    } catch (erro) {
        console.error('Erro ao excluir disciplina:', erro);

        return res.status(500).json({
            erro: 'Erro ao excluir disciplina',
            detalhe: erro.message
        });
    }
}