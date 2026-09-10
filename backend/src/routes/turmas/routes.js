import express from 'express';

import turmaController from '../../controllers/turmaController.js';
import { autenticarToken } from '../../middlewares/authMiddleware.js';
import { permitirPerfis } from '../../middlewares/perfilMiddleware.js';

const router = express.Router();

router.get('/', autenticarToken, turmaController.listarTurmas);
router.post('/', autenticarToken, permitirPerfis('admin'), turmaController.cadastrarTurma);
router.get('/:id', autenticarToken, turmaController.buscarTurma);
router.put('/:id', autenticarToken, permitirPerfis('admin'), turmaController.editarTurma);
router.delete('/:id', autenticarToken, permitirPerfis('admin'), turmaController.excluirTurma);

export default router;
