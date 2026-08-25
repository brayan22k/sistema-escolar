import Professor from '../models/Professor.js';

// LISTAR PROFESSORES
export async function listarProfessores(req, res) {
    try {
        const professores = await Professor.findAll();

        res.json(professores);
    } catch (erro) {
        console.error('Erro ao listar professores:', erro);

        res.status(500).json({
            erro: 'Erro ao listar professores',
            detalhes: erro.message
        });
    }
}

// CADASTRAR PROFESSOR
export async function cadastrarProfessor(req, res) {
    try {
        const professor = await Professor.create(req.body);

        res.status(201).json(professor);
    } catch (erro) {
        console.error('Erro ao cadastrar professor:', erro);

        res.status(500).json({
            erro: 'Erro ao cadastrar professor',
            detalhes: erro.message
        });
    }
}

// BUSCAR PROFESSOR
export async function buscarProfessor(req, res) {
    try {
        const { id } = req.params;

        const professor = await Professor.findByPk(id);

        if (!professor) {
            return res.status(404).json({
                erro: 'Professor não encontrado'
            });
        }

        res.json(professor);
    } catch (erro) {
        console.error('Erro ao buscar professor:', erro);

        res.status(500).json({
            erro: 'Erro ao buscar professor',
            detalhes: erro.message
        });
    }
}

// EDITAR PROFESSOR
export async function editarProfessor(req, res) {
    try {
        const { id } = req.params;

        const professor = await Professor.findByPk(id);

        if (!professor) {
            return res.status(404).json({
                erro: 'Professor não encontrado'
            });
        }

        await professor.update(req.body);

        res.json(professor);
    } catch (erro) {
        console.error('Erro ao editar professor:', erro);

        res.status(500).json({
            erro: 'Erro ao editar professor',
            detalhes: erro.message
        });
    }
}

// EXCLUIR PROFESSOR
export async function excluirProfessor(req, res) {
    try {
        const { id } = req.params;

        const professor = await Professor.findByPk(id);

        if (!professor) {
            return res.status(404).json({
                erro: 'Professor não encontrado'
            });
        }

        await professor.destroy();

        res.json({
            mensagem: 'Professor excluído com sucesso!'
        });
    } catch (erro) {
        console.error('Erro ao excluir professor:', erro);

        res.status(500).json({
            erro: 'Erro ao excluir professor',
            detalhes: erro.message
        });
    }
}