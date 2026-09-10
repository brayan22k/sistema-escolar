// backend/src/models/Aluno.js

import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Aluno extends Model { }

Aluno.init(
    {
        nome: {
            type: DataTypes.STRING,
            allowNull: false
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },

        data_nascimento: {
            type: DataTypes.DATEONLY
        },

        turma: {
            type: DataTypes.STRING
        },

        // Campos do Boss Challenge
        cpf: {
            type: DataTypes.STRING(14),
            unique: true
        },

        telefone: {
            type: DataTypes.STRING
        },

        endereco: {
            type: DataTypes.TEXT
        },

        // MISSÃO 002
        // Relacionamento: ALUNOS.fk_turma -> TURMAS.id
        fk_turma: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    },
    {
        sequelize,
        modelName: 'aluno',
        tableName: 'alunos',
        timestamps: false
    }
);

export default Aluno; 