import { DataTypes, Model } from 'sequelize';

import sequelize from '../config/database.js';

class Frequencia extends Model {}

Frequencia.init(
    {
        aluno_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        data: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },

        presente: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    },
    {
        sequelize,
        modelName: 'frequencia',
        tableName: 'frequencias',
        timestamps: false,

        indexes: [
            {
                unique: true,
                fields: ['aluno_id', 'data']
            }
        ]
    }
);

export default Frequencia;