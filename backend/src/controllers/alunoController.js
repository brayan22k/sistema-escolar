import Aluno from '../models/Aluno.js'


async function listarAlunos(req, res) {
    try {
        const alunos = await Aluno.findAll();
        res.status(200).json(alunos);
    } catch (erro) {
        res.status(500).send("Erro ao listar alunos: " + erro.message);
    }
}


async function cadastrarAluno(req, res) {
    try {
        const novoAluno = await Aluno.create(req.body);
        res.status(201).json(novoAluno);
        console.log("Aluno salvo no banco:", novoAluno.nome);
    } catch (erro) {
        res.status(400).send("Erro ao salvar: " + erro.message);
    }
}

async function editarAluno(req, res) {
    try {
        const aluno = await Aluno.findByPk(req.params.id);
        if (!aluno) return res.status(404).json({ erro: 'Aluno não encontrado.' });

        await aluno.update(req.body);
        res.status(200).json(aluno);
    } catch (erro) {
        res.status(400).json({ erro: `Erro ao editar aluno: ${erro.message}` });
    }
}

async function excluirAluno(req, res) {
    try {
        const aluno = await Aluno.findByPk(req.params.id);
        if (!aluno) return res.status(404).json({ erro: 'Aluno não encontrado.' });

        await aluno.destroy();
        res.status(204).send();
    } catch (erro) {
        res.status(400).json({ erro: `Erro ao excluir aluno: ${erro.message}` });
    }
}

export default { cadastrarAluno, listarAlunos, editarAluno, excluirAluno };