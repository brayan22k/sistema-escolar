```js
// backend/src/models/Professor.js

import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Professor extends Model { }

Professor.init(
    {
        nome: {
            type: DataTypes.STRING,
            allowNull: false
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },

        disciplina: {
            type: DataTypes.STRING,
            allowNull: false
        },

        usuario: {
            type: DataTypes.STRING,
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

console.log('CAMPOS DO PROFESSOR:', Object.keys(Professor.rawAttributes));

export default Professor;
```
