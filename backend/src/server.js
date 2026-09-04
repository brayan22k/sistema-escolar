import express from 'express';
import cors from 'cors';

import sequelize from './config/database.js';
import routes from './routes/index.js';

import './models/associations.js';

const app = express();

const PORT = 3000;


// ======================================================
// MIDDLEWARES
// ======================================================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));


// ======================================================
// TESTE DA API
// ======================================================

app.get('/', (req, res) => {
    res.json({
        mensagem: 'API do Sistema Escolar funcionando!'
    });
});


// ======================================================
// ROTAS
// ======================================================

console.log('ROTAS PRINCIPAIS CARREGADAS');

app.use(routes);


// ======================================================
// ROTA NÃO ENCONTRADA
// ======================================================

app.use((req, res) => {
    res.status(404).json({
        erro: 'Rota não encontrada',
        rota: req.originalUrl
    });
});


// ======================================================
// INICIAR SERVIDOR
// ======================================================

async function iniciarServidor() {
    try {

        await sequelize.authenticate();

        console.log(
            'Banco de dados conectado com sucesso!'
        );

        await sequelize.sync();

        console.log(
            'Modelos sincronizados com sucesso!'
        );

        app.listen(PORT, () => {

            console.log(
                `Servidor rodando em http://localhost:${PORT}`
            );

        });

    } catch (erro) {

        console.error(
            'Erro ao iniciar o servidor:',
            erro
        );

    }
}

iniciarServidor();