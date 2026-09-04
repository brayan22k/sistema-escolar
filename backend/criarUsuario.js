import bcrypt from 'bcrypt';
import Usuario from './src/models/Usuario.js';
import sequelize from './src/config/database.js';

async function atualizarSenha() {
    try {
        await sequelize.authenticate();

        const senhaHash = await bcrypt.hash('123456', 10);

        const usuario = await Usuario.findOne({
            where: {
                email: 'admin@escola.com'
            }
        });

        if (!usuario) {
            console.log('Usuário não encontrado!');
            return;
        }

        usuario.senha = senhaHash;
        await usuario.save();

        console.log('SENHA ATUALIZADA COM SUCESSO!');
        console.log('E-mail: admin@escola.com');
        console.log('Nova senha: 123456');

    } catch (erro) {
        console.error('ERRO:', erro.message);
    } finally {
        await sequelize.close();
    }
}

atualizarSenha();