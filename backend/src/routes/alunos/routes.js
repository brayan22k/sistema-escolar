import express from 'express';

import {
    listarAlunos,
    cadastrarAluno,
    buscarAluno,
    editarAluno,
    excluirAluno,
    vincularTurma
} from '../../controllers/alunoController.js';

const router = express.Router();

// ==========================================
// LISTAR ALUNOS
// GET /alunos
// ==========================================
router.get('/', listarAlunos);

// ==========================================
// CADASTRAR ALUNO
// POST /alunos
// ==========================================
router.post('/', cadastrarAluno);

// ==========================================
// BUSCAR ALUNO POR ID
// GET /alunos/:id
// ==========================================
router.get('/:id', buscarAluno);

// ==========================================
// EDITAR ALUNO
// PUT /alunos/:id
// ==========================================
router.put('/:id', editarAluno);

// ==========================================
// EXCLUIR ALUNO
// DELETE /alunos/:id
// ==========================================
router.delete('/:id', excluirAluno);

// ==========================================
// VINCULAR ALUNO À TURMA
// PUT /alunos/:id/turma
// ==========================================
router.put('/:id/turma', vincularTurma);

export default router;