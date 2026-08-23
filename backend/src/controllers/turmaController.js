import Aluno from '../models/Aluno.js';
import Turma from '../models/Turma.js';

async function listarTurmas(req, res) {
  try {
    const turmas = await Turma.findAll({
      include: [{ model: Aluno, as: 'alunos', attributes: ['id', 'nome', 'email', 'serie'] }],
      order: [['ano', 'ASC'], ['nome', 'ASC']],
    });
    res.status(200).json(turmas);
  } catch (erro) {
    res.status(500).json({ erro: `Erro ao listar turmas: ${erro.message}` });
  }
}

async function cadastrarTurma(req, res) {
  const { nome, serie, ano } = req.body;

  if (!nome?.trim() || !serie?.trim() || !Number.isInteger(Number(ano))) {
    return res.status(400).json({ erro: 'Nome, série e ano são obrigatórios.' });
  }

  try {
    const novaTurma = await Turma.create({
      nome: nome.trim(),
      serie: serie.trim(),
      ano: Number(ano),
    });
    res.status(201).json({ ...novaTurma.toJSON(), alunos: [] });
    console.log('Turma salva no banco:', novaTurma.nome);
  } catch (erro) {
    res.status(400).json({ erro: `Erro ao salvar turma: ${erro.message}` });
  }
}

async function editarTurma(req, res) {
  const { nome, serie, ano } = req.body;

  if (!nome?.trim() || !serie?.trim() || !Number.isInteger(Number(ano))) {
    return res.status(400).json({ erro: 'Nome, série e ano são obrigatórios.' });
  }

  try {
    const turma = await Turma.findByPk(req.params.id);
    if (!turma) return res.status(404).json({ erro: 'Turma não encontrada.' });

    await turma.update({ nome: nome.trim(), serie: serie.trim(), ano: Number(ano) });
    res.status(200).json(turma);
  } catch (erro) {
    res.status(400).json({ erro: `Erro ao editar turma: ${erro.message}` });
  }
}

async function excluirTurma(req, res) {
  try {
    const turma = await Turma.findByPk(req.params.id);
    if (!turma) return res.status(404).json({ erro: 'Turma não encontrada.' });

    await Aluno.update({ turma_id: null }, { where: { turma_id: turma.id } });
    await turma.destroy();
    res.status(204).send();
  } catch (erro) {
    res.status(400).json({ erro: `Erro ao excluir turma: ${erro.message}` });
  }
}

async function vincularAluno(req, res) {
  const turmaId = Number(req.params.id);
  const alunoId = Number(req.body.alunoId);

  if (!Number.isInteger(turmaId) || !Number.isInteger(alunoId)) {
    return res.status(400).json({ erro: 'Informe IDs válidos para a turma e o aluno.' });
  }

  try {
    const [turma, aluno] = await Promise.all([
      Turma.findByPk(turmaId),
      Aluno.findByPk(alunoId),
    ]);

    if (!turma || !aluno) {
      return res.status(404).json({ erro: 'Turma ou aluno não encontrado.' });
    }

    await aluno.update({ turma_id: turma.id });
    const turmaAtualizada = await Turma.findByPk(turma.id, {
      include: [{ model: Aluno, as: 'alunos', attributes: ['id', 'nome', 'email', 'serie'] }],
    });
    res.status(200).json(turmaAtualizada);
  } catch (erro) {
    res.status(400).json({ erro: `Erro ao vincular aluno: ${erro.message}` });
  }
}

async function listarAlunosDaTurma(req, res) {
  try {
    const turma = await Turma.findByPk(req.params.id, {
      include: [{ model: Aluno, as: 'alunos', attributes: ['id', 'nome', 'email', 'serie'] }],
    });

    if (!turma) {
      return res.status(404).json({ erro: 'Turma não encontrada.' });
    }

    res.status(200).json(turma.alunos);
  } catch (erro) {
    res.status(500).json({ erro: `Erro ao consultar turma: ${erro.message}` });
  }
}

async function desvincularAluno(req, res) {
  const turmaId = Number(req.params.id);
  const alunoId = Number(req.params.alunoId);

  if (!Number.isInteger(turmaId) || !Number.isInteger(alunoId)) {
    return res.status(400).json({ erro: 'Informe IDs válidos para a turma e o aluno.' });
  }

  try {
    const [turma, aluno] = await Promise.all([
      Turma.findByPk(turmaId),
      Aluno.findByPk(alunoId),
    ]);

    if (!turma || !aluno) {
      return res.status(404).json({ erro: 'Turma ou aluno não encontrado.' });
    }

    if (aluno.turma_id !== turma.id) {
      return res.status(400).json({ erro: 'Este aluno não está vinculado a esta turma.' });
    }

    await aluno.update({ turma_id: null });

    const turmaAtualizada = await Turma.findByPk(turma.id, {
      include: [{ model: Aluno, as: 'alunos', attributes: ['id', 'nome', 'email', 'serie'] }],
    });

    res.status(200).json(turmaAtualizada);
  } catch (erro) {
    res.status(400).json({ erro: `Erro ao desvincular aluno: ${erro.message}` });
  }
}

export default {
  listarTurmas,
  cadastrarTurma,
  editarTurma,
  excluirTurma,
  vincularAluno,
  desvincularAluno,
  listarAlunosDaTurma,
};