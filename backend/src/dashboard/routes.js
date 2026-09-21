// ======================================================
// DASHBOARD ROUTES
// Sistema Escolar
// ======================================================

import { Router } from 'express';

import {
    listarDashboard
} from './dashboardController.js';


const router = Router();


// ======================================================
// GET /dashboard
// ======================================================

router.get('/', listarDashboard);


export default router;