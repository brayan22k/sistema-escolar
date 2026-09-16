import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Auditoria extends Model {}

Auditoria.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        usuario_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },

        usuario_nome: {
            type: DataTypes.STRING(150),
            allowNull: true
        },

        perfil: {
            type: DataTypes.STRING(50),
            allowNull: true
        },

        operacao: {
            type: DataTypes.STRING(50),
            allowNull: false
        },

        recurso: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        recurso_id: {
            type: DataTypes.STRING(100),
            allowNull: true
        },

        detalhes: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        criado_em: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    },
    {
        sequelize,
        modelName: 'Auditoria',
        tableName: 'auditoria',
        timestamps: false,

        indexes: [
            {
                fields: ['criado_em']
            },
            {
                fields: ['operacao']
            },
            {
                fields: ['recurso']
            }
        ]
    }
);

export default Auditoria;