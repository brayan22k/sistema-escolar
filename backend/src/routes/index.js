import express from 'express';
import alunosRoutes from './alunos/routes.js';
import turmasRoutes from './turmas/routes.js';
import disciplinasRoutes from './disciplinas/routes.js';
import boletimRoutes from './boletim/routes.js';
import frequenciasRoutes from './frequencias/routes.js';

const routes = express.Router();

routes.use(alunosRoutes);
routes.use(turmasRoutes);
routes.use(disciplinasRoutes);
routes.use(boletimRoutes);
routes.use(frequenciasRoutes);

export default routes;
