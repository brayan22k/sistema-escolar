import express from 'express';

import {
    listarDisciplinasDoProfessor,
    vincularDisciplina,
    desvincularDisciplina
} from '../../controllers/professorDisciplinaController.js';

const router = express.Router();


// Listar disciplinas de um professor
router.get(
    '/:professorId/disciplinas',
    listarDisciplinasDoProfessor
);


// Vincular disciplina
router.post(
    '/:professorId/disciplinas',
    vincularDisciplina
);


// Desvincular disciplina
router.delete(
    '/:professorId/disciplinas/:disciplinaId',
    desvincularDisciplina
);

export default router;