import bcrypt from 'bcrypt';
import Usuario from './src/models/Usuario.js';
import sequelize from './src/config/database.js';

async function criarOuAtualizarAdmin() {
    try {
        await sequelize.authenticate();

        const nome = 'Administrador';
        const email = 'admin@escola.com';
        const senha = 'admin123';
        const perfil = 'admin';

        console.log('🔄 Verificando administrador...');

        const admin = await Usuario.findOne({
            where: { email }
        });

        if (admin) {
            const senhaHash = await bcrypt.hash(senha, 10);

            await admin.update({
                nome,
                senha: senhaHash,
                perfil
            });

            console.log('');
            console.log('======================================');
            console.log('✅ ADMIN ATUALIZADO COM SUCESSO!');
            console.log('======================================');
            console.log('ID:', admin.id);
            console.log('Nome:', nome);
            console.log('E-mail:', email);
            console.log('Perfil:', perfil);
            console.log('Senha: admin123');
            console.log('======================================');

            return;
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        const novoAdmin = await Usuario.create({
            nome,
            email,
            senha: senhaHash,
            perfil
        });

        console.log('');
        console.log('======================================');
        console.log('✅ ADMIN CRIADO COM SUCESSO!');
        console.log('======================================');
        console.log('ID:', novoAdmin.id);
        console.log('Nome:', nome);
        console.log('E-mail:', email);
        console.log('Perfil:', perfil);
        console.log('Senha: admin123');
        console.log('======================================');

    } catch (erro) {
        console.error('❌ ERRO:', erro);
    } finally {
        await sequelize.close();
    }
}

criarOuAtualizarAdmin();