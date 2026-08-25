import express from 'express';

import {
    listarProfessores,
    cadastrarProfessor,
    buscarProfessor,
    editarProfessor,
    excluirProfessor
} from '../../controllers/professorController.js';

const router = express.Router();

console.log('ARQUIVO PROFESSORES ROUTES FOI CARREGADO');

router.get('/', listarProfessores);

router.post('/', cadastrarProfessor);

router.get('/:id', buscarProfessor);

router.put('/:id', editarProfessor);

router.delete('/:id', excluirProfessor);

export default router;