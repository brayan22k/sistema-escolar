// backend/src/controllers/alunoController.js

import Aluno from '../models/Aluno.js';


// ======================================================
// LISTAR TODOS OS ALUNOS
// ======================================================

async function listarAlunos(req, res) {

    try {

        const alunos = await Aluno.findAll();

        res.status(200).json(alunos);

    } catch (erro) {

        console.error('Erro ao listar alunos:', erro);

        res.status(500).send(
            'Erro ao listar alunos: ' + erro.message
        );

    }

}


// ======================================================
// CADASTRAR ALUNO
// ======================================================

async function cadastrarAluno(req, res) {

    try {

        const dadosAluno = {
            nome: req.body.nome,
            email: req.body.email,
            data_nascimento: req.body.data_nascimento || null,
            serie: req.body.serie || null,
            cpf: req.body.cpf || null,
            telefone: req.body.telefone || null,
            endereco: req.body.endereco || null,

            // O aluno pode ser cadastrado sem turma.
            fk_turma: req.body.fk_turma || null
        };


        const novoAluno = await Aluno.create(dadosAluno);


        console.log(
            'Aluno salvo no banco:',
            novoAluno.nome
        );


        res.status(201).json(novoAluno);


    } catch (erro) {

        console.error(
            'Erro ao salvar aluno:',
            erro
        );


        res.status(400).send(
            'Erro ao salvar aluno: ' +
            erro.message
        );

    }

}


// ======================================================
// BUSCAR ALUNO POR ID
// ======================================================

async function buscarAluno(req, res) {

    try {

        const { id } = req.params;


        const aluno = await Aluno.findByPk(id);


        if (!aluno) {

            return res.status(404).send(
                'Aluno não encontrado'
            );

        }


        res.status(200).json(aluno);


    } catch (erro) {

        console.error(
            'Erro ao buscar aluno:',
            erro
        );


        res.status(500).send(
            'Erro ao buscar aluno: ' +
            erro.message
        );

    }

}


// ======================================================
// EDITAR ALUNO
// ======================================================

async function editarAluno(req, res) {

    try {

        const { id } = req.params;


        const aluno = await Aluno.findByPk(id);


        if (!aluno) {

            return res.status(404).send(
                'Aluno não encontrado'
            );

        }


        await aluno.update({

            nome: req.body.nome,

            email: req.body.email,

            data_nascimento:
                req.body.data_nascimento || null,

            serie:
                req.body.serie || null,

            cpf:
                req.body.cpf || null,

            telefone:
                req.body.telefone || null,

            endereco:
                req.body.endereco || null

        });


        console.log(
            'Aluno atualizado:',
            aluno.nome
        );


        res.status(200).json(aluno);


    } catch (erro) {

        console.error(
            'Erro ao editar aluno:',
            erro
        );


        res.status(400).send(
            'Erro ao editar aluno: ' +
            erro.message
        );

    }

}


// ======================================================
// EXCLUIR ALUNO
// ======================================================

async function excluirAluno(req, res) {

    try {

        const { id } = req.params;


        const aluno = await Aluno.findByPk(id);


        if (!aluno) {

            return res.status(404).send(
                'Aluno não encontrado'
            );

        }


        await aluno.destroy();


        console.log(
            'Aluno excluído:',
            aluno.nome
        );


        res.status(200).json({

            mensagem:
                'Aluno excluído com sucesso!'

        });


    } catch (erro) {

        console.error(
            'Erro ao excluir aluno:',
            erro
        );


        res.status(400).send(
            'Erro ao excluir aluno: ' +
            erro.message
        );

    }

}


// ======================================================
// MISSÃO 002
// VINCULAR ALUNO A UMA TURMA
// ======================================================

async function vincularTurma(req, res) {

    try {

        const { id } = req.params;

        const { fk_turma } = req.body;


        const aluno =
            await Aluno.findByPk(id);


        if (!aluno) {

            return res.status(404).send(
                'Aluno não encontrado'
            );

        }


        aluno.fk_turma =
            fk_turma || null;


        await aluno.save();


        res.status(200).json({

            mensagem:
                'Aluno vinculado à turma com sucesso!',

            aluno

        });


    } catch (erro) {

        console.error(
            'Erro ao vincular turma:',
            erro
        );


        res.status(400).send(
            'Erro ao vincular turma: ' +
            erro.message
        );

    }

}


// ======================================================
// EXPORTAR CONTROLLER
// ======================================================

export default {

    cadastrarAluno,

    listarAlunos,

    buscarAluno,

    editarAluno,

    excluirAluno,

    vincularTurma

};