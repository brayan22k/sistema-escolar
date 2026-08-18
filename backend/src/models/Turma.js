// backend/src/models/Turma.js
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Turma extends Model { }

Turma.init({
    // Gerado automaticamente pelo backend a partir de serie + letra (ex: "1A", "3C")
    nome: { type: DataTypes.STRING(100), allowNull: false },
    serie: { type: DataTypes.STRING(100), allowNull: false },
    // Missao 002 (ajuste): turma identificada por letra, de A a E
    letra: {
        type: DataTypes.STRING(1),
        allowNull: false,
        validate: { isIn: [['A', 'B', 'C', 'D', 'E']] }
    },
    ano: { type: DataTypes.INTEGER, allowNull: false },
    professor: {
        type: DataTypes.STRING(100),
        validate: { is: /^[A-Za-zÀ-ÿ\s]*$/ } // somente letras e espacos, sem numeros/simbolos
    }
}, { sequelize, modelName: 'turma' });

export default Turma;