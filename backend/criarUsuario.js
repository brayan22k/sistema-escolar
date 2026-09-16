import bcrypt from 'bcrypt';
import Usuario from './src/models/Usuario.js';
import sequelize from './src/config/database.js';

async function criarOuAtualizarUsuario() {
    try {
        await sequelize.authenticate();

        const nome = 'Felipe';
        const email = 'felipexxz@gmail.com';
        const senha = 'felipe123';
        const perfil = 'professor';

        console.log('🔄 Verificando usuário...');

        const usuarioExistente = await Usuario.findOne({
            where: {
                email
            }
        });

        // ======================================================
        // SE O USUÁRIO JÁ EXISTIR → ATUALIZA
        // ======================================================

        if (usuarioExistente) {
            const senhaHash = await bcrypt.hash(senha, 10);

            await usuarioExistente.update({
                nome,
                senha: senhaHash,
                perfil
            });

            console.log('');
            console.log('======================================');
            console.log('✅ USUÁRIO ATUALIZADO COM SUCESSO!');
            console.log('======================================');
            console.log('ID:', usuarioExistente.id);
            console.log('Nome:', usuarioExistente.nome);
            console.log('E-mail:', usuarioExistente.email);
            console.log('Perfil:', usuarioExistente.perfil);
            console.log('Senha redefinida!');
            console.log('======================================');

            return;
        }

        // ======================================================
        // SE NÃO EXISTIR → CRIA
        // ======================================================

        const senhaHash = await bcrypt.hash(senha, 10);

        const usuario = await Usuario.create({
            nome,
            email,
            senha: senhaHash,
            perfil
        });

        console.log('');
        console.log('======================================');
        console.log('✅ NOVO USUÁRIO CRIADO!');
        console.log('======================================');
        console.log('ID:', usuario.id);
        console.log('Nome:', usuario.nome);
        console.log('E-mail:', usuario.email);
        console.log('Perfil:', usuario.perfil);
        console.log('Senha configurada!');
        console.log('======================================');

    } catch (erro) {
        console.error('');
        console.error('❌ ERRO AO CRIAR/ATUALIZAR USUÁRIO:');
        console.error(erro);
    } finally {
        await sequelize.close();
    }
}

criarOuAtualizarUsuario();