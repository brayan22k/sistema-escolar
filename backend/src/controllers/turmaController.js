// backend/src/controllers/turmaController.js

import Turma from '../models/Turma.js';


// ======================================================
// LISTAR TODAS AS TURMAS
// ======================================================

async function listarTurmas(req, res) {
    try {

        const turmas = await Turma.findAll();

        res.status(200).json(turmas);

    } catch (erro) {

        console.error(
            'Erro ao listar turmas:',
            erro
        );

        res.status(500).send(
            'Erro ao listar turmas: ' +
            erro.message
        );
    }
}


// ======================================================
// CADASTRAR TURMA
// ======================================================

async function cadastrarTurma(req, res) {
    try {

        const {
            serie,
            letra,
            ano,
            professor
        } = req.body;


        // Verifica série
        if (!serie) {

            return res.status(400).send(
                'A série é obrigatória.'
            );
        }


        // Verifica letra da turma
        if (!letra) {

            return res.status(400).send(
                'A turma é obrigatória.'
            );
        }


        // Verifica ano
        if (!ano) {

            return res.status(400).send(
                'O ano letivo é obrigatório.'
            );
        }


        // ==================================================
        // MONTA O NOME AUTOMATICAMENTE
        // Exemplo: 3º Ano + A = 3º Ano A
        // ==================================================

        const nome = `${serie} ${letra}`;


        // ==================================================
        // CRIA A TURMA
        // ==================================================

        const novaTurma = await Turma.create({

            nome: nome,

            serie: serie,

            letra: letra,

            ano: ano,

            professor: professor || null

        });


        console.log(
            'Turma salva no banco:',
            novaTurma.nome
        );


        res.status(201).json(
            novaTurma
        );


    } catch (erro) {

        console.error(
            'Erro ao salvar turma:',
            erro
        );


        res.status(400).send(
            'Erro ao salvar turma: ' +
            erro.message
        );
    }
}


// ======================================================
// BUSCAR TURMA POR ID
// ======================================================

async function buscarTurma(req, res) {
    try {

        const { id } = req.params;


        const turma =
            await Turma.findByPk(id);


        if (!turma) {

            return res.status(404).send(
                'Turma não encontrada.'
            );
        }


        res.status(200).json(
            turma
        );


    } catch (erro) {

        console.error(
            'Erro ao buscar turma:',
            erro
        );


        res.status(500).send(
            'Erro ao buscar turma: ' +
            erro.message
        );
    }
}


// ======================================================
// EDITAR TURMA
// ======================================================

async function editarTurma(req, res) {
    try {

        const { id } = req.params;


        // Procura a turma
        const turma =
            await Turma.findByPk(id);


        if (!turma) {

            return res.status(404).send(
                'Turma não encontrada.'
            );
        }


        const {
            serie,
            letra,
            ano,
            professor
        } = req.body;


        // Verifica série
        if (!serie) {

            return res.status(400).send(
                'A série é obrigatória.'
            );
        }


        // Verifica letra
        if (!letra) {

            return res.status(400).send(
                'A turma é obrigatória.'
            );
        }


        // Verifica ano
        if (!ano) {

            return res.status(400).send(
                'O ano letivo é obrigatório.'
            );
        }


        // ==================================================
        // MONTA NOVAMENTE O NOME
        // ==================================================

        const nome = `${serie} ${letra}`;


        // ==================================================
        // ATUALIZA A TURMA
        // ==================================================

        await turma.update({

            nome: nome,

            serie: serie,

            letra: letra,

            ano: ano,

            professor: professor || null

        });


        console.log(
            'Turma atualizada:',
            turma.nome
        );


        res.status(200).json(
            turma
        );


    } catch (erro) {

        console.error(
            'Erro ao editar turma:',
            erro
        );


        res.status(400).send(
            'Erro ao editar turma: ' +
            erro.message
        );
    }
}


// ======================================================
// EXCLUIR TURMA
// ======================================================

async function excluirTurma(req, res) {
    try {

        const { id } = req.params;


        const turma =
            await Turma.findByPk(id);


        if (!turma) {

            return res.status(404).send(
                'Turma não encontrada.'
            );
        }


        await turma.destroy();


        console.log(
            'Turma excluída:',
            turma.nome
        );


        res.status(200).json({

            mensagem:
                'Turma excluída com sucesso!'

        });


    } catch (erro) {

        console.error(
            'Erro ao excluir turma:',
            erro
        );


        res.status(400).send(
            'Erro ao excluir turma: ' +
            erro.message
        );
    }
}


// ======================================================
// EXPORTAR CONTROLLER
// ======================================================

export {
    listarTurmas,
    cadastrarTurma,
    buscarTurma,
    editarTurma,
    excluirTurma
};