import express from 'express';
import cors from 'cors';

import sequelize from './config/database.js';
import routes from './routes/index.js';

const app = express();

const PORT = 3000;

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

app.get('/', (req, res) => {
    res.json({
        mensagem: 'API do Sistema Escolar funcionando!'
    });
});

console.log('ROTAS PRINCIPAIS CARREGADAS');

app.use(routes);

app.use((req, res) => {
    res.status(404).json({
        erro: 'Rota não encontrada',
        rota: req.originalUrl
    });
});

async function iniciarServidor() {
    try {
        await sequelize.authenticate();

        console.log('Banco de dados conectado com sucesso!');

        await sequelize.sync();

        console.log('Modelos sincronizados com sucesso!');

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