import express from 'express';
import alunosRoutes from './alunos/routes.js';
import turmasRoutes from './turmas/routes.js';

const routes = express.Router();

routes.use(alunosRoutes);
routes.use(turmasRoutes);

export default routes;
