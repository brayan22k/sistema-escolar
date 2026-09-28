import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Usuario extends Model {}

Usuario.init(
    {
        // ======================================================
        // DADOS DO USUÁRIO
        // ======================================================

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

        // ======================================================
        // PERFIL
        // ======================================================

        perfil: {
            type: DataTypes.ENUM(
                'admin',
                'professor',
                'aluno'
            ),
            allowNull: false,
            defaultValue: 'aluno'
        },

        // ======================================================
        // VÍNCULO COM ALUNO
        // ======================================================
        //
        // Somente contas com perfil "aluno" utilizarão
        // este campo.
        //
        // Admin e professor:
        // aluno_id = NULL
        //
        // Aluno:
        // aluno_id = ID correspondente em alunos
        //

        aluno_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            unique: true
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