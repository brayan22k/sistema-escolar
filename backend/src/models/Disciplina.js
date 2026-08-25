import { DataTypes, Model } from 'sequelize';

import sequelize from '../config/database.js';


class Disciplina extends Model {}


Disciplina.init(

    {

        nome: {

            type: DataTypes.STRING,

            allowNull: false

        },

        descricao: {

            type: DataTypes.TEXT,

            allowNull: true

        }

    },

    {

        sequelize,

        modelName: 'Disciplina',

        tableName: 'disciplinas',

        timestamps: false

    }

);


export default Disciplina;