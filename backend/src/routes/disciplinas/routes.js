import express from 'express';
import disciplinaController from '../../controllers/disciplinaController.js';

const routes = express.Router();

routes.get('/disciplinas', disciplinaController.listarDisciplinas);
routes.get('/turmas/:turmaId/disciplinas', disciplinaController.listarDisciplinasDaTurma);
routes.post('/disciplinas', disciplinaController.cadastrarDisciplina);
routes.put('/disciplinas/:id', disciplinaController.editarDisciplina);
routes.delete('/disciplinas/:id', disciplinaController.excluirDisciplina);

export default routes;
