import { DataTypes, Model } from 'sequelize';

import sequelize from '../config/database.js';


class Nota extends Model {}


Nota.init(
    {
        // ======================================================
        // ALUNO
        // ======================================================

        aluno_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },


        // ======================================================
        // DISCIPLINA
        // ======================================================

        disciplina: {
            type: DataTypes.STRING(100),
            allowNull: false
        },


        // ======================================================
        // BIMESTRE
        // ======================================================

        bimestre: {
            type: DataTypes.STRING(20),
            allowNull: false
        },


        // ======================================================
        // NOTA
        // ======================================================

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

        indexes: [
            {
                unique: true,

                fields: [
                    'aluno_id',
                    'disciplina',
                    'bimestre'
                ]
            }
        ]
    }
);


export default Nota;