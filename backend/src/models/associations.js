import Aluno from './Aluno.js';
import Turma from './Turma.js';
import Nota from './Nota.js';
import Professor from './Professor.js';
import Disciplina from './Disciplina.js';
import ProfessorDisciplina from './ProfessorDisciplina.js';
import Usuario from './Usuario.js';

// ======================================================
// TURMAS ↔ ALUNOS
// ======================================================

Turma.hasMany(Aluno, {
    foreignKey: 'fk_turma',
    as: 'alunos'
});

Aluno.belongsTo(Turma, {
    foreignKey: 'fk_turma',
    as: 'Turma'
});


// ======================================================
// ALUNO ↔ NOTAS
// ======================================================

Aluno.hasMany(Nota, {
    foreignKey: 'aluno_id',
    as: 'notas'
});

Nota.belongsTo(Aluno, {
    foreignKey: 'aluno_id',
    as: 'aluno'
});


// ======================================================
// PROFESSOR ↔ DISCIPLINA
// ======================================================

Professor.belongsToMany(Disciplina, {
    through: ProfessorDisciplina,
    foreignKey: 'professor_id',
    otherKey: 'disciplina_id',
    as: 'disciplinas'
});

Disciplina.belongsToMany(Professor, {
    through: ProfessorDisciplina,
    foreignKey: 'disciplina_id',
    otherKey: 'professor_id',
    as: 'professores'
});


// ======================================================
// PROFESSOR ↔ VÍNCULOS
// ======================================================

Professor.hasMany(ProfessorDisciplina, {
    foreignKey: 'professor_id',
    as: 'vinculosDisciplinas'
});

ProfessorDisciplina.belongsTo(Professor, {
    foreignKey: 'professor_id',
    as: 'professor'
});


// ======================================================
// DISCIPLINA ↔ VÍNCULOS
// ======================================================

Disciplina.hasMany(ProfessorDisciplina, {
    foreignKey: 'disciplina_id',
    as: 'vinculosProfessores'
});

ProfessorDisciplina.belongsTo(Disciplina, {
    foreignKey: 'disciplina_id',
    as: 'disciplina'
});