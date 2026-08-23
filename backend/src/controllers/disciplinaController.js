import Disciplina from '../models/Disciplina.js';
import Turma from '../models/Turma.js';

async function listarDisciplinas(req, res) {
  try {
    const disciplinas = await Disciplina.findAll({
      include: [{ model: Turma, as: 'turma', attributes: ['id', 'nome', 'serie', 'ano'] }],
      order: [['nome', 'ASC']],
    });
    res.status(200).json(disciplinas);
  } catch (erro) {
    res.status(500).json({ erro: `Erro ao listar disciplinas: ${erro.message}` });
  }
}

async function listarDisciplinasDaTurma(req, res) {
  try {
    const disciplinas = await Disciplina.findAll({
      where: { turma_id: req.params.turmaId },
      order: [['nome', 'ASC']],
    });
    res.status(200).json(disciplinas);
  } catch (erro) {
    res.status(500).json({ erro: `Erro ao listar disciplinas da turma: ${erro.message}` });
  }
}

async function cadastrarDisciplina(req, res) {
  const { turma_id, nome } = req.body;

  if (!turma_id || !nome?.trim()) {
    return res.status(400).json({ erro: 'Turma e nome da disciplina são obrigatórios.' });
  }

  try {
    const turma = await Turma.findByPk(Number(turma_id));
    if (!turma) {
      return res.status(404).json({ erro: 'Turma não encontrada.' });
    }

    const disciplinaExiste = await Disciplina.findOne({
      where: { turma_id: Number(turma_id), nome: nome.trim() },
    });

    if (disciplinaExiste) {
      return res.status(409).json({ erro: 'Essa disciplina já existe para a turma.' });
    }

    const novaDisciplina = await Disciplina.create({
      turma_id: Number(turma_id),
      nome: nome.trim(),
    });

    res.status(201).json(novaDisciplina);
  } catch (erro) {
    res.status(400).json({ erro: `Erro ao salvar disciplina: ${erro.message}` });
  }
}

async function editarDisciplina(req, res) {
  const { turma_id, nome } = req.body;

  if (!turma_id || !nome?.trim()) {
    return res.status(400).json({ erro: 'Turma e nome da disciplina são obrigatórios.' });
  }

  try {
    const disciplina = await Disciplina.findByPk(req.params.id);
    if (!disciplina) {
      return res.status(404).json({ erro: 'Disciplina não encontrada.' });
    }

    const turma = await Turma.findByPk(Number(turma_id));
    if (!turma) {
      return res.status(404).json({ erro: 'Turma não encontrada.' });
    }

    const jaExiste = await Disciplina.findOne({
      where: {
        turma_id: Number(turma_id),
        nome: nome.trim(),
      },
    });

    if (jaExiste && Number(jaExiste.id) !== Number(disciplina.id)) {
      return res.status(409).json({ erro: 'Essa disciplina já existe para a turma.' });
    }

    await disciplina.update({ turma_id: Number(turma_id), nome: nome.trim() });
    res.status(200).json(disciplina);
  } catch (erro) {
    res.status(400).json({ erro: `Erro ao editar disciplina: ${erro.message}` });
  }
}

async function excluirDisciplina(req, res) {
  try {
    const disciplina = await Disciplina.findByPk(req.params.id);
    if (!disciplina) return res.status(404).json({ erro: 'Disciplina não encontrada.' });

    await disciplina.destroy();
    res.status(204).send();
  } catch (erro) {
    res.status(400).json({ erro: `Erro ao excluir disciplina: ${erro.message}` });
  }
}

export default {
  listarDisciplinas,
  listarDisciplinasDaTurma,
  cadastrarDisciplina,
  editarDisciplina,
  excluirDisciplina,
};
