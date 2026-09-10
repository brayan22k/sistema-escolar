import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class ProfessorDisciplina extends Model {}

ProfessorDisciplina.init(
    {
        professor_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        disciplina_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: 'ProfessorDisciplina',
        tableName: 'professor_disciplinas',
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['professor_id', 'disciplina_id']
            }
        ]
    }
);

export default ProfessorDisciplina;