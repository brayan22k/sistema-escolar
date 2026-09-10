import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Usuario extends Model {}

Usuario.init(
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

        senha: {
            type: DataTypes.STRING(255),
            allowNull: false
        },

        perfil: {
            type: DataTypes.ENUM('admin', 'professor', 'aluno'),
            allowNull: false,
            defaultValue: 'aluno'
        }
    },
    {
        sequelize,
        modelName: 'Usuario',
        tableName: 'usuarios',
        timestamps: false
    }
);

export default Usuario;