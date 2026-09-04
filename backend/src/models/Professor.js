import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Professor extends Model {}

Professor.init(
    {
        nome: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true
        },

        disciplina: {
            type: DataTypes.STRING(100),
            allowNull: true
        },

        usuario: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },

        senha: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: 'Professor',
        tableName: 'professores',
        timestamps: false
    }
);

export default Professor;