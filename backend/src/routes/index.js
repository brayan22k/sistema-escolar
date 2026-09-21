import express from 'express';

import alunosRoutes from './alunos/routes.js';

import turmasRoutes from './turmas/routes.js';

import notasRoutes from './Notas/routes.js';

import professoresRoutes from './professores/routes.js';

import professorDisciplinaRoutes from './professorDisciplina/routes.js';

import disciplinasRoutes from './disciplina/routes.js';

import authRoutes from './auth/routes.js';

import dashboardRoutes from '../dashboard/routes.js';

// ======================================================
// AUDITORIA
// ======================================================

import auditoriaRoutes from '../auditoria/routes.js';


const routes = express.Router();


// ======================================================
// ROTAS PRINCIPAIS
// ======================================================

routes.use('/alunos', alunosRoutes);

routes.use('/turmas', turmasRoutes);

routes.use('/notas', notasRoutes);

routes.use('/professores', professoresRoutes);

routes.use('/professores', professorDisciplinaRoutes);

routes.use('/disciplinas', disciplinasRoutes);

routes.use('/auth', authRoutes);

routes.use('/dashboard', dashboardRoutes);


// ======================================================
// AUDITORIA
// ======================================================

routes.use('/auditoria', auditoriaRoutes);


// ======================================================
// LOGS
// ======================================================

console.log('======================================');

console.log('ROTAS PRINCIPAIS CARREGADAS');

console.log('ROTA /auth REGISTRADA');

console.log('ROTA /professores REGISTRADA');

console.log('ROTA /auditoria REGISTRADA');

console.log('ROTA /dashboard REGISTRADA');

console.log('======================================');


export default routes;