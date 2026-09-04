import ProfessorDisciplina from '../models/ProfessorDisciplina.js';
import Professor from '../models/Professor.js';
import Disciplina from '../models/Disciplina.js';


// ======================================================
// LISTAR DISCIPLINAS DE UM PROFESSOR
// ======================================================

export async function listarDisciplinasDoProfessor(req, res) {
    try {
        const { professorId } = req.params;

        const vinculos = await ProfessorDisciplina.findAll({
            where: {
                professor_id: professorId
            },
            include: [
                {
                    model: Disciplina,
                    as: 'disciplina'
                }
            ]
        });

        return res.json(vinculos);

    } catch (erro) {
        console.error(
            'Erro ao listar disciplinas do professor:',
            erro
        );

        return res.status(500).json({
            erro: 'Erro ao listar disciplinas do professor',
            detalhes: erro.message
        });
    }
}


// ======================================================
// VINCULAR PROFESSOR A UMA DISCIPLINA
// ======================================================

export async function vincularDisciplina(req, res) {
    try {
        const { professorId } = req.params;
        const { disciplina_id } = req.body;

        if (!disciplina_id) {
            return res.status(400).json({
                erro: 'disciplina_id é obrigatório'
            });
        }

        const professor = await Professor.findByPk(professorId);

        if (!professor) {
            return res.status(404).json({
                erro: 'Professor não encontrado'
            });
        }

        const disciplina = await Disciplina.findByPk(
            disciplina_id
        );

        if (!disciplina) {
            return res.status(404).json({
                erro: 'Disciplina não encontrada'
            });
        }

        const existente =
            await ProfessorDisciplina.findOne({
                where: {
                    professor_id: professorId,
                    disciplina_id
                }
            });

        if (existente) {
            return res.status(400).json({
                erro: 'Professor já está vinculado a esta disciplina'
            });
        }

        const vinculo =
            await ProfessorDisciplina.create({
                professor_id: professorId,
                disciplina_id
            });

        return res.status(201).json({
            mensagem: 'Disciplina vinculada com sucesso!',
            vinculo
        });

    } catch (erro) {
        console.error(
            'Erro ao vincular disciplina:',
            erro
        );

        return res.status(500).json({
            erro: 'Erro ao vincular disciplina',
            detalhes: erro.message
        });
    }
}


// ======================================================
// DESVINCULAR PROFESSOR DE UMA DISCIPLINA
// ======================================================

export async function desvincularDisciplina(req, res) {
    try {
        const { professorId, disciplinaId } =
            req.params;

        const vinculo =
            await ProfessorDisciplina.findOne({
                where: {
                    professor_id: professorId,
                    disciplina_id: disciplinaId
                }
            });

        if (!vinculo) {
            return res.status(404).json({
                erro: 'Vínculo não encontrado'
            });
        }

        await vinculo.destroy();

        return res.json({
            mensagem: 'Disciplina desvinculada com sucesso!'
        });

    } catch (erro) {
        console.error(
            'Erro ao desvincular disciplina:',
            erro
        );

        return res.status(500).json({
            erro: 'Erro ao desvincular disciplina',
            detalhes: erro.message
        });
    }
}