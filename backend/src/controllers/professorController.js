// backend/src/controllers/professorController.js

import Professor from '../models/Professor.js';


// ==========================================
// LISTAR PROFESSORES
// ==========================================

async function listarProfessores(req, res) {

    try {

        const professores =
            await Professor.findAll();

        res.status(200).json(professores);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            mensagem: 'Erro ao listar professores.'
        });

    }

}


// ==========================================
// CADASTRAR PROFESSOR
// ==========================================

async function cadastrarProfessor(req, res) {

    try {

        const {
            nome,
            email,
            disciplina
        } = req.body;


        if (!nome || !email || !disciplina) {

            return res.status(400).json({
                mensagem:
                    'Nome, e-mail e disciplina são obrigatórios.'
            });

        }


        const professor =
            await Professor.create({
                nome,
                email,
                disciplina
            });


        res.status(201).json(professor);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            mensagem:
                'Erro ao cadastrar professor.'
        });

    }

}


// ==========================================
// ATUALIZAR PROFESSOR
// ==========================================

async function atualizarProfessor(req, res) {

    try {

        const { id } = req.params;


        const professor =
            await Professor.findByPk(id);


        if (!professor) {

            return res.status(404).json({
                mensagem:
                    'Professor não encontrado.'
            });

        }


        const {
            nome,
            email,
            disciplina
        } = req.body;


        await professor.update({
            nome,
            email,
            disciplina
        });


        res.status(200).json(professor);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            mensagem:
                'Erro ao atualizar professor.'
        });

    }

}


// ==========================================
// EXCLUIR PROFESSOR
// ==========================================

async function excluirProfessor(req, res) {

    try {

        const { id } = req.params;


        const professor =
            await Professor.findByPk(id);


        if (!professor) {

            return res.status(404).json({
                mensagem:
                    'Professor não encontrado.'
            });

        }


        await professor.destroy();


        res.status(200).json({
            mensagem:
                'Professor excluído com sucesso.'
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            mensagem:
                'Erro ao excluir professor.'
        });

    }

}


export {
    listarProfessores,
    cadastrarProfessor,
    atualizarProfessor,
    excluirProfessor
};