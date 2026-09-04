import express from 'express';

import {
    listarAlunos,
    cadastrarAluno,
    buscarAluno,
    editarAluno,
    excluirAluno,
    vincularTurma
} from '../../controllers/alunoController.js';

import { autenticarToken } from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', autenticarToken, listarAlunos);

router.post('/', autenticarToken, cadastrarAluno);

router.get('/:id', autenticarToken, buscarAluno);

router.put('/:id', autenticarToken, editarAluno);

router.delete('/:id', autenticarToken, excluirAluno);

router.put('/:id/turma', autenticarToken, vincularTurma);

export default router;