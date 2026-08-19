import express from 'express';

import alunosRoutes from './alunos/routes.js';

import turmasRoutes from './turmas/routes.js';

import notasRoutes from './notas/routes.js';

import professoresRoutes from './professores/routes.js';


const routes = express.Router();


// ==========================================
// ALUNOS
// ==========================================

routes.use(alunosRoutes);


// ==========================================
// TURMAS
// ==========================================

routes.use(turmasRoutes);


// ==========================================
// NOTAS - MISSÃO 003
// ==========================================

routes.use(notasRoutes);


// ==========================================
// PROFESSORES
// ==========================================

routes.use(professoresRoutes);


export default routes;  