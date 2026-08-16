import express from 'express';
import turmaController from '../../controllers/turmaController.js';

const routes = express.Router();

routes.get('/turmas', turmaController.listarTurmas);
routes.post('/turmas', turmaController.cadastrarTurma);
routes.put('/turmas/:id', turmaController.editarTurma);
routes.delete('/turmas/:id', turmaController.excluirTurma);
routes.post('/turmas/:id/alunos', turmaController.vincularAluno);
routes.get('/turmas/:id/alunos', turmaController.listarAlunosDaTurma);

export default routes;