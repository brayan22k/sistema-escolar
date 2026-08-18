// backend/src/models/Nota.js
// MISSÃO 003 — OPERAÇÃO BOLETIM DIGITAL

import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Nota extends Model { }

Nota.init(
    {
        // Chave estrangeira: notas.aluno_id -> alunos.id
        aluno_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        disciplina: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        bimestre: {
            type: DataTypes.STRING(20),
            allowNull: false
        },

        nota: {
            type: DataTypes.DECIMAL(3, 1),
            allowNull: false,
            validate: {
                min: 0,
                max: 10
            }
        }
    },
    {
        sequelize,
        modelName: 'nota',
        tableName: 'notas',
        timestamps: false,

        // Evita nota duplicada para o mesmo aluno + disciplina + bimestre
        indexes: [
            {
                unique: true,
                fields: ['aluno_id', 'disciplina', 'bimestre']
            }
        ]
    }
);

export default Nota;