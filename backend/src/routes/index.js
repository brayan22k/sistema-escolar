import express from 'express';

import alunosRoutes from './alunos/routes.js';
import turmasRoutes from './turmas/routes.js';
import notasRoutes from './notas/routes.js';
import professoresRoutes from './professores/routes.js';
import disciplinasRoutes from './disciplina/routes.js';

const routes = express.Router();

routes.use('/alunos', alunosRoutes);
routes.use('/turmas', turmasRoutes);
routes.use('/notas', notasRoutes);
routes.use('/professores', professoresRoutes);
routes.use('/disciplinas', disciplinasRoutes);

console.log('ROTA /professores REGISTRADA');

export default routes;