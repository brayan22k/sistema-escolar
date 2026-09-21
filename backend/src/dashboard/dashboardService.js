// ======================================================
// DASHBOARD SERVICE
// Sistema Escolar
// ======================================================

import { Op } from 'sequelize';

import Aluno from '../models/Aluno.js';
import Professor from '../models/Professor.js';
import Turma from '../models/Turma.js';
import Disciplina from '../models/Disciplina.js';
import Nota from '../models/Nota.js';


// ======================================================
// BUSCAR DADOS DO DASHBOARD
// ======================================================

export async function obterDadosDashboard() {

    // --------------------------------------------------
    // CONTADORES PRINCIPAIS
    // --------------------------------------------------

    const [
        totalAlunos,
        totalProfessores,
        totalTurmas,
        totalDisciplinas,
        totalNotas
    ] = await Promise.all([

        Aluno.count(),

        Professor.count(),

        Turma.count(),

        Disciplina.count(),

        Nota.count()

    ]);


    // --------------------------------------------------
    // BUSCAR TODAS AS NOTAS
    // --------------------------------------------------

    const notas = await Nota.findAll({
        attributes: [
            'aluno_id',
            'nota'
        ],
        raw: true
    });


    // --------------------------------------------------
    // ORGANIZAR NOTAS POR ALUNO
    // --------------------------------------------------

    const notasPorAluno = {};

    for (const registro of notas) {

        const alunoId = registro.aluno_id;

        const valor = Number(registro.nota);


        if (!Number.isFinite(valor)) {
            continue;
        }


        if (!notasPorAluno[alunoId]) {

            notasPorAluno[alunoId] = [];

        }


        notasPorAluno[alunoId].push(valor);

    }


    // --------------------------------------------------
    // CALCULAR SITUAÇÃO DOS ALUNOS
    //
    // Média >= 6  -> Aprovado
    // Média >= 4  -> Recuperação
    // Média < 4   -> Reprovado
    //
    // Aluno sem nota não entra na classificação.
    // --------------------------------------------------

    let aprovados = 0;
    let recuperacao = 0;
    let reprovados = 0;
    let alunosComNotas = 0;

    let somaMedias = 0;


    for (const alunoId of Object.keys(notasPorAluno)) {

        const listaNotas =
            notasPorAluno[alunoId];


        if (!listaNotas.length) {
            continue;
        }


        const soma =
            listaNotas.reduce(
                (total, valor) =>
                    total + valor,
                0
            );


        const media =
            soma / listaNotas.length;


        somaMedias += media;

        alunosComNotas++;


        if (media >= 6) {

            aprovados++;

        } else if (media >= 4) {

            recuperacao++;

        } else {

            reprovados++;

        }

    }


    // --------------------------------------------------
    // MÉDIA GERAL
    // --------------------------------------------------

    const mediaGeral =
        alunosComNotas > 0
            ? somaMedias / alunosComNotas
            : 0;


    // --------------------------------------------------
    // ALUNOS SEM NOTAS
    // --------------------------------------------------

    const alunosSemNotas =
        Math.max(
            totalAlunos - alunosComNotas,
            0
        );


    // --------------------------------------------------
    // PERCENTUAIS
    // --------------------------------------------------

    const totalAvaliados =
        aprovados +
        recuperacao +
        reprovados;


    const percentualAprovados =
        totalAvaliados > 0
            ? (aprovados / totalAvaliados) * 100
            : 0;


    const percentualRecuperacao =
        totalAvaliados > 0
            ? (recuperacao / totalAvaliados) * 100
            : 0;


    const percentualReprovados =
        totalAvaliados > 0
            ? (reprovados / totalAvaliados) * 100
            : 0;


    // --------------------------------------------------
    // RETORNO
    // --------------------------------------------------

    return {

        resumo: {

            alunos: totalAlunos,

            professores:
                totalProfessores,

            turmas:
                totalTurmas,

            disciplinas:
                totalDisciplinas,

            notas:
                totalNotas

        },


        desempenho: {

            aprovados,

            recuperacao,

            reprovados,

            alunosSemNotas,

            alunosComNotas,

            mediaGeral:
                Number(
                    mediaGeral.toFixed(2)
                ),

            percentualAprovados:
                Number(
                    percentualAprovados.toFixed(1)
                ),

            percentualRecuperacao:
                Number(
                    percentualRecuperacao.toFixed(1)
                ),

            percentualReprovados:
                Number(
                    percentualReprovados.toFixed(1)
                )

        }

    };

}