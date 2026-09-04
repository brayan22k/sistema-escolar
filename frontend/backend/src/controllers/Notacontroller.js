// backend/src/controllers/notaController.js
// MISSÃO 003 — OPERAÇÃO BOLETIM DIGITAL

import Nota from '../models/Nota.js';
import Aluno from '../models/Aluno.js';


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
        } = req.body;


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
        // (mesmo aluno + disciplina + bimestre)
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
            aluno.nome, '-', disciplina, '-', bimestre, '-', notaNumerica
        );


        res.status(201).json(novaNota);


    } catch (erro) {

        console.error('Erro ao salvar nota:', erro);

        res.status(400).send(
            'Erro ao salvar nota: ' + erro.message
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
            where: { aluno_id: id },
            order: [['disciplina', 'ASC'], ['bimestre', 'ASC']]
        });

        res.status(200).json({
            aluno: {
                id: aluno.id,
                nome: aluno.nome
            },
            notas
        });

    } catch (erro) {

        console.error('Erro ao consultar notas do aluno:', erro);

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

    listarNotasPorAluno

};