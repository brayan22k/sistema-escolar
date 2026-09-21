// backend/src/models/Aluno.js

import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Aluno extends Model { }

Aluno.init(
    {
        // ======================================================
        // DADOS PRINCIPAIS
        // ======================================================

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
            type: DataTypes.DATEONLY,
            allowNull: true
        },


        // ======================================================
        // DADOS ESCOLARES
        // ======================================================

        serie: {
            type: DataTypes.STRING,
            allowNull: true
        },


        // ======================================================
        // DADOS PESSOAIS
        // ======================================================

        cpf: {
            type: DataTypes.STRING(14),
            allowNull: true,
            unique: true
        },

        telefone: {
            type: DataTypes.STRING,
            allowNull: true
        },

        endereco: {
            type: DataTypes.TEXT,
            allowNull: true
        },


        // ======================================================
        // RELACIONAMENTO COM TURMA
        // ALUNOS.fk_turma -> TURMAS.id
        // ======================================================

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