// backend/src/models/associations.js

import Aluno from './Aluno.js';
import Turma from './Turma.js';
import Nota from './Nota.js';


// Uma turma possui vários alunos
Turma.hasMany(Aluno, {
    foreignKey: 'fk_turma',
    as: 'alunos'
});


// Um aluno pertence a uma turma
Aluno.belongsTo(Turma, {
    foreignKey: 'fk_turma',
    as: 'Turma'
});


// ======================================================
// MISSÃO 003
// Um aluno possui várias notas
// ======================================================

Aluno.hasMany(Nota, {
    foreignKey: 'aluno_id',
    as: 'notas'
});


// Uma nota pertence a um aluno
Nota.belongsTo(Aluno, {
    foreignKey: 'aluno_id',
    as: 'aluno'
});