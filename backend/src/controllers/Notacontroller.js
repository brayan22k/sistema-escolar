// backend/src/controllers/notaController.js
// MISSÃO 003 — OPERAÇÃO BOLETIM DIGITAL
// MISSÃO 007 — AUDITORIA DE NOTAS

import Nota from '../models/Nota.js';
import Aluno from '../models/Aluno.js';
import { registrarAuditoria } from '../auditoria/auditoriaService.js';


// ======================================================
// LISTAR TODAS AS NOTAS
// ======================================================

async function listarNotas(req, res) {

    try {

        const notas = await Nota.findAll({

            include: [
                {
                    model: Aluno,
                    as: 'aluno',
                    attributes: ['id', 'nome']
                }
            ],

            order: [['id', 'DESC']]

        });

        res.status(200).json(notas);

    } catch (erro) {

        console.error('Erro ao listar notas:', erro);

        res.status(500).send(
            'Erro ao listar notas: ' + erro.message
        );

    }

}


// ======================================================
// CADASTRAR NOTA
// ======================================================

async function cadastrarNota(req, res) {

    try {

        const {
            aluno_id,
            disciplina,
            bimestre,
            nota
        } = req.body || {};


        // --------------------------------------------------
        // VALIDAÇÕES
        // --------------------------------------------------

        if (!aluno_id) {
            return res.status(400).send(
                'O aluno é obrigatório.'
            );
        }

        if (!disciplina) {
            return res.status(400).send(
                'A disciplina é obrigatória.'
            );
        }

        if (!bimestre) {
            return res.status(400).send(
                'O bimestre é obrigatório.'
            );
        }

        if (nota === undefined || nota === null || nota === '') {
            return res.status(400).send(
                'A nota é obrigatória.'
            );
        }

        const notaNumerica = Number(nota);

        if (Number.isNaN(notaNumerica)) {
            return res.status(400).send(
                'A nota deve ser um número válido.'
            );
        }

        if (notaNumerica < 0 || notaNumerica > 10) {
            return res.status(400).send(
                'A nota deve estar entre 0 e 10.'
            );
        }


        // --------------------------------------------------
        // ALUNO PRECISA EXISTIR NO BANCO
        // --------------------------------------------------

        const aluno = await Aluno.findByPk(aluno_id);

        if (!aluno) {
            return res.status(404).send(
                'Aluno não encontrado.'
            );
        }


        // --------------------------------------------------
        // EVITA CADASTRO DUPLICADO
        // --------------------------------------------------

        const notaDuplicada = await Nota.findOne({
            where: {
                aluno_id,
                disciplina,
                bimestre
            }
        });

        if (notaDuplicada) {
            return res.status(409).send(
                `Já existe uma nota de ${disciplina} (${bimestre}) cadastrada para este aluno.`
            );
        }


        // --------------------------------------------------
        // CRIA A NOTA
        // --------------------------------------------------

        const novaNota = await Nota.create({
            aluno_id,
            disciplina,
            bimestre,
            nota: notaNumerica
        });


        console.log(
            'Nota salva no banco:',
            aluno.nome,
            '-',
            disciplina,
            '-',
            bimestre,
            '-',
            notaNumerica
        );


        // --------------------------------------------------
        // AUDITORIA — CRIAÇÃO
        // --------------------------------------------------

        await registrarAuditoria({
            req,
            operacao: 'CRIAR',
            recurso: 'NOTA',
            recurso_id: novaNota.id,
            detalhes: `Nota criada para o aluno ${aluno.nome} - ${disciplina} - ${bimestre} - valor ${notaNumerica}`
        });


        res.status(201).json(novaNota);


    } catch (erro) {

        console.error('Erro ao salvar nota:', erro);

        res.status(400).send(
            'Erro ao salvar nota: ' + erro.message
        );

    }

}


// ======================================================
// EDITAR NOTA
// ======================================================

async function editarNota(req, res) {

    try {

        const { id } = req.params;

        const {
            aluno_id,
            disciplina,
            bimestre,
            nota
        } = req.body || {};


        // --------------------------------------------------
        // PROCURA A NOTA
        // --------------------------------------------------

        const notaExistente = await Nota.findByPk(id);

        if (!notaExistente) {

            return res.status(404).send(
                'Nota não encontrada.'
            );

        }


        // --------------------------------------------------
        // GUARDA OS VALORES ANTIGOS PARA AUDITORIA
        // --------------------------------------------------

        const valoresAntigos = {
            aluno_id: notaExistente.aluno_id,
            disciplina: notaExistente.disciplina,
            bimestre: notaExistente.bimestre,
            nota: notaExistente.nota
        };


        // --------------------------------------------------
        // VALIDAÇÕES
        // --------------------------------------------------

        const novoAlunoId =
            aluno_id !== undefined
                ? aluno_id
                : notaExistente.aluno_id;

        const novaDisciplina =
            disciplina !== undefined
                ? disciplina
                : notaExistente.disciplina;

        const novoBimestre =
            bimestre !== undefined
                ? bimestre
                : notaExistente.bimestre;

        const novaNota =
            nota !== undefined
                ? Number(nota)
                : Number(notaExistente.nota);


        if (!novoAlunoId) {

            return res.status(400).send(
                'O aluno é obrigatório.'
            );

        }


        if (!novaDisciplina) {

            return res.status(400).send(
                'A disciplina é obrigatória.'
            );

        }


        if (!novoBimestre) {

            return res.status(400).send(
                'O bimestre é obrigatório.'
            );

        }


        if (Number.isNaN(novaNota)) {

            return res.status(400).send(
                'A nota deve ser um número válido.'
            );

        }


        if (novaNota < 0 || novaNota > 10) {

            return res.status(400).send(
                'A nota deve estar entre 0 e 10.'
            );

        }


        // --------------------------------------------------
        // VERIFICA SE O NOVO ALUNO EXISTE
        // --------------------------------------------------

        const aluno = await Aluno.findByPk(novoAlunoId);

        if (!aluno) {

            return res.status(404).send(
                'Aluno não encontrado.'
            );

        }


        // --------------------------------------------------
        // EVITA DUPLICIDADE
        // --------------------------------------------------

        const duplicada = await Nota.findOne({

            where: {
                aluno_id: novoAlunoId,
                disciplina: novaDisciplina,
                bimestre: novoBimestre
            }

        });


        if (
            duplicada &&
            Number(duplicada.id) !== Number(id)
        ) {

            return res.status(409).send(
                `Já existe uma nota de ${novaDisciplina} (${novoBimestre}) cadastrada para este aluno.`
            );

        }


        // --------------------------------------------------
        // ATUALIZA A NOTA
        // --------------------------------------------------

        await notaExistente.update({

            aluno_id: novoAlunoId,
            disciplina: novaDisciplina,
            bimestre: novoBimestre,
            nota: novaNota

        });


        console.log(
            'Nota atualizada:',
            notaExistente.id
        );


        // --------------------------------------------------
        // AUDITORIA — EDIÇÃO
        // --------------------------------------------------

        await registrarAuditoria({

            req,

            operacao: 'EDITAR',

            recurso: 'NOTA',

            recurso_id: notaExistente.id,

            detalhes:
                `Nota editada. Antes: aluno_id=${valoresAntigos.aluno_id}, disciplina=${valoresAntigos.disciplina}, bimestre=${valoresAntigos.bimestre}, nota=${valoresAntigos.nota}. Depois: aluno_id=${notaExistente.aluno_id}, disciplina=${notaExistente.disciplina}, bimestre=${notaExistente.bimestre}, nota=${notaExistente.nota}`

        });


        res.status(200).json(notaExistente);


    } catch (erro) {

        console.error('Erro ao editar nota:', erro);

        res.status(400).send(
            'Erro ao editar nota: ' + erro.message
        );

    }

}


// ======================================================
// EXCLUIR NOTA
// ======================================================

async function excluirNota(req, res) {

    try {

        const { id } = req.params;


        // --------------------------------------------------
        // PROCURA A NOTA
        // --------------------------------------------------

        const notaExistente = await Nota.findByPk(id);

        if (!notaExistente) {

            return res.status(404).send(
                'Nota não encontrada.'
            );

        }


        // --------------------------------------------------
        // GUARDA DADOS ANTES DA EXCLUSÃO
        // --------------------------------------------------

        const dadosNota = {

            id: notaExistente.id,

            aluno_id: notaExistente.aluno_id,

            disciplina: notaExistente.disciplina,

            bimestre: notaExistente.bimestre,

            nota: notaExistente.nota

        };


        // --------------------------------------------------
        // EXCLUI A NOTA
        // --------------------------------------------------

        await notaExistente.destroy();


        console.log(
            'Nota excluída:',
            dadosNota.id
        );


        // --------------------------------------------------
        // AUDITORIA — EXCLUSÃO
        // --------------------------------------------------

        await registrarAuditoria({

            req,

            operacao: 'EXCLUIR',

            recurso: 'NOTA',

            recurso_id: dadosNota.id,

            detalhes:
                `Nota excluída. aluno_id=${dadosNota.aluno_id}, disciplina=${dadosNota.disciplina}, bimestre=${dadosNota.bimestre}, nota=${dadosNota.nota}`

        });


        res.status(200).json({

            mensagem: 'Nota excluída com sucesso.',

            nota: dadosNota

        });


    } catch (erro) {

        console.error('Erro ao excluir nota:', erro);

        res.status(400).send(
            'Erro ao excluir nota: ' + erro.message
        );

    }

}


// ======================================================
// LISTAR NOTAS DE UM ALUNO ESPECÍFICO
// ======================================================

async function listarNotasPorAluno(req, res) {

    try {

        const { id } = req.params;

        const aluno = await Aluno.findByPk(id);

        if (!aluno) {
            return res.status(404).send(
                'Aluno não encontrado.'
            );
        }

        const notas = await Nota.findAll({

            where: {
                aluno_id: id
            },

            order: [
                ['disciplina', 'ASC'],
                ['bimestre', 'ASC']
            ]

        });

        res.status(200).json({

            aluno: {

                id: aluno.id,

                nome: aluno.nome

            },

            notas

        });

    } catch (erro) {

        console.error(
            'Erro ao consultar notas do aluno:',
            erro
        );

        res.status(500).send(
            'Erro ao consultar notas do aluno: ' + erro.message
        );

    }

}


// ======================================================
// EXPORTAR CONTROLLER
// ======================================================

export default {

    listarNotas,

    cadastrarNota,

    editarNota,

    excluirNota,

    listarNotasPorAluno

};