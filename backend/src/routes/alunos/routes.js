import express from 'express';

import alunoController from '../../controllers/alunoController.js';
import { autenticarToken } from '../../middlewares/authMiddleware.js';
import { permitirPerfis } from '../../middlewares/perfilMiddleware.js';

const router = express.Router();

router.get('/', autenticarToken, alunoController.listarAlunos);
router.post('/', autenticarToken, permitirPerfis('admin'), alunoController.cadastrarAluno);
router.get('/:id', autenticarToken, alunoController.buscarAluno);
router.put('/:id', autenticarToken, permitirPerfis('admin'), alunoController.editarAluno);
router.delete('/:id', autenticarToken, permitirPerfis('admin'), alunoController.excluirAluno);
router.put('/:id/turma', autenticarToken, permitirPerfis('admin', 'professor'), alunoController.vincularTurma);

export default router;
