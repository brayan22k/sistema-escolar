import express from 'express';

import {
    listarDisciplinasDoProfessor,
    vincularDisciplina,
    desvincularDisciplina
} from '../../controllers/professorDisciplinaController.js';

import { autenticarToken } from '../../middlewares/authMiddleware.js';
import { permitirPerfis } from '../../middlewares/perfilMiddleware.js';

const router = express.Router();

router.get('/:professorId/disciplinas', autenticarToken, listarDisciplinasDoProfessor);
router.post('/:professorId/disciplinas', autenticarToken, permitirPerfis('admin'), vincularDisciplina);
router.delete('/:professorId/disciplinas/:disciplinaId', autenticarToken, permitirPerfis('admin'), desvincularDisciplina);

export default router;
