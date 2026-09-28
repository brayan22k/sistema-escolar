import Frequencia from '../models/Frequencia.js';
import Aluno from '../models/Aluno.js';
import { registrarAuditoria } from '../auditoria/auditoriaService.js';

// ======================================================
// LISTAR FREQUÊNCIAS DE UM ALUNO
// ======================================================

export async function listarFrequenciaPorAluno(req, res) {
    try {
        const alunoId = Number(req.params.id);

        if (!Number.isInteger(alunoId) || alunoId <= 0) {
            return res.status(400).json({
                erro: 'ID do aluno inválido'
            });
        }

        const aluno = await Aluno.findByPk(alunoId);

        if (!aluno) {
            return res.status(404).json({
                erro: 'Aluno não encontrado'
            });
        }

        const frequencias = await Frequencia.findAll({
            where: {
                aluno_id: alunoId
            },
            order: [
                ['data', 'DESC']
            ]
        });

        return res.status(200).json({
            aluno: {
                id: aluno.id,
                nome: aluno.nome,
                turma: aluno.turma || null,
                fk_turma: aluno.fk_turma || null
            },
            frequencias
        });

    } catch (erro) {
        console.error('Erro ao listar frequência:', erro);

        return res.status(500).json({
            erro: 'Erro interno ao listar frequência'
        });
    }
}


// ======================================================
// RESUMO DA FREQUÊNCIA
// ======================================================

export async function resumoFrequenciaPorAluno(req, res) {
    try {
        const alunoId = Number(req.params.id);

        if (!Number.isInteger(alunoId) || alunoId <= 0) {
            return res.status(400).json({
                erro: 'ID do aluno inválido'
            });
        }

        const aluno = await Aluno.findByPk(alunoId);

        if (!aluno) {
            return res.status(404).json({
                erro: 'Aluno não encontrado'
            });
        }

        const frequencias = await Frequencia.findAll({
            where: {
                aluno_id: alunoId
            }
        });

        const total = frequencias.length;

        const presencas = frequencias.filter(
            frequencia => frequencia.presente === true
        ).length;

        const faltas = total - presencas;

        const percentual = total > 0
            ? Number(((presencas / total) * 100).toFixed(2))
            : 0;

        return res.status(200).json({
            aluno: {
                id: aluno.id,
                nome: aluno.nome
            },
            resumo: {
                total,
                presencas,
                faltas,
                percentual
            }
        });

    } catch (erro) {
        console.error('Erro ao calcular resumo da frequência:', erro);

        return res.status(500).json({
            erro: 'Erro interno ao calcular frequência'
        });
    }
}


// ======================================================
// CADASTRAR FREQUÊNCIA
// ADMIN / PROFESSOR
// ======================================================

export async function cadastrarFrequencia(req, res) {
    try {
        const { aluno_id, data, presente } = req.body;

        if (!aluno_id || !data) {
            return res.status(400).json({
                erro: 'aluno_id e data são obrigatórios'
            });
        }

        const aluno = await Aluno.findByPk(aluno_id);

        if (!aluno) {
            return res.status(404).json({
                erro: 'Aluno não encontrado'
            });
        }

        const existente = await Frequencia.findOne({
            where: {
                aluno_id,
                data
            }
        });

        if (existente) {
            return res.status(409).json({
                erro: 'Já existe uma frequência registrada para este aluno nesta data'
            });
        }

        const novaFrequencia = await Frequencia.create({
            aluno_id,
            data,
            presente: presente !== false
        });

        await registrarAuditoria({
            req,
            operacao: 'CRIAR',
            recurso: 'FREQUENCIA',
            identificador: novaFrequencia.id
        });

        return res.status(201).json({
            mensagem: 'Frequência registrada com sucesso',
            frequencia: novaFrequencia
        });

    } catch (erro) {
        console.error('Erro ao cadastrar frequência:', erro);

        return res.status(500).json({
            erro: 'Erro interno ao cadastrar frequência'
        });
    }
}


// ======================================================
// EDITAR FREQUÊNCIA
// ADMIN / PROFESSOR
// ======================================================

export async function editarFrequencia(req, res) {
    try {
        const id = Number(req.params.id);

        const frequencia = await Frequencia.findByPk(id);

        if (!frequencia) {
            return res.status(404).json({
                erro: 'Registro de frequência não encontrado'
            });
        }

        const { data, presente } = req.body;

        if (data !== undefined) {
            frequencia.data = data;
        }

        if (presente !== undefined) {
            frequencia.presente = Boolean(presente);
        }

        await frequencia.save();

        await registrarAuditoria({
            req,
            operacao: 'EDITAR',
            recurso: 'FREQUENCIA',
            identificador: frequencia.id
        });

        return res.status(200).json({
            mensagem: 'Frequência atualizada com sucesso',
            frequencia
        });

    } catch (erro) {
        console.error('Erro ao editar frequência:', erro);

        return res.status(500).json({
            erro: 'Erro interno ao editar frequência'
        });
    }
}


// ======================================================
// EXCLUIR FREQUÊNCIA
// ADMIN / PROFESSOR
// ======================================================

export async function excluirFrequencia(req, res) {
    try {
        const id = Number(req.params.id);

        const frequencia = await Frequencia.findByPk(id);

        if (!frequencia) {
            return res.status(404).json({
                erro: 'Registro de frequência não encontrado'
            });
        }

        await frequencia.destroy();

        await registrarAuditoria({
            req,
            operacao: 'EXCLUIR',
            recurso: 'FREQUENCIA',
            identificador: id
        });

        return res.status(200).json({
            mensagem: 'Frequência excluída com sucesso'
        });

    } catch (erro) {
        console.error('Erro ao excluir frequência:', erro);

        return res.status(500).json({
            erro: 'Erro interno ao excluir frequência'
        });
    }
}