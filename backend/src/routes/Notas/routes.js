import express from 'express';

import notaController from '../../controllers/notaController.js';
import { autenticarToken } from '../../middlewares/authMiddleware.js';
import { permitirPerfis } from '../../middlewares/perfilMiddleware.js';

const router = express.Router();

router.get('/', autenticarToken, notaController.listarNotas);
router.post('/', autenticarToken, permitirPerfis('admin', 'professor'), notaController.cadastrarNota);
router.get('/aluno/:id', autenticarToken, notaController.listarNotasPorAluno);

export default router;
