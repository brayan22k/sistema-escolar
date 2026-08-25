import express from 'express';

import {
    listarDisciplinas,
    buscarDisciplina,
    criarDisciplina,
    atualizarDisciplina,
    excluirDisciplina
} from '../../controllers/disciplinaController.js';

const router = express.Router();

router.get('/', listarDisciplinas);

router.get('/:id', buscarDisciplina);

router.post('/', criarDisciplina);

router.put('/:id', atualizarDisciplina);

router.delete('/:id', excluirDisciplina);

export default router;