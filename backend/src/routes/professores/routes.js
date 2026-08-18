// backend/src/routes/professores/routes.js

import express from 'express';

import {
    listarProfessores,
    cadastrarProfessor,
    atualizarProfessor,
    excluirProfessor
} from '../../controllers/professorController.js';


const router = express.Router();


// ==========================================
// PROFESSORES
// ==========================================

router.get(
    '/professores',
    listarProfessores
);


router.post(
    '/professores',
    cadastrarProfessor
);


router.put(
    '/professores/:id',
    atualizarProfessor
);


router.delete(
    '/professores/:id',
    excluirProfessor
);


export default router;