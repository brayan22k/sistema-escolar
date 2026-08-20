import express from 'express';
import cors from 'cors';
import sequelize from './config/database.js';

// ======================================================
// ROTAS
// ======================================================

import alunosRoutes from './routes/alunos/routes.js';
import disciplinaRoutes from './routes/disciplina/routes.js';
import notasRoutes from './routes/Notas/routes.js';
import professoresRoutes from './routes/professores/routes.js';
import turmasRoutes from './routes/turmas/routes.js';

// ======================================================
// MODELS
// ======================================================

import './models/Aluno.js';
import './models/Disciplina.js';
import './models/Nota.js';
import './models/Professor.js';
import './models/Turma.js';

// ======================================================
// APP
// ======================================================

const app = express();

// ======================================================
// MIDDLEWARES
// ======================================================

app.use(cors());
app.use(express.json());

// ======================================================
// ROTA PRINCIPAL
// ======================================================

app.get('/', (req, res) => {
    res.json({
        mensagem: 'API do Sistema Escolar funcionando!'
    });
});

// ======================================================
// ROTAS DA API
// ======================================================

app.use('/alunos', alunosRoutes);

app.use('/disciplinas', disciplinaRoutes);

app.use('/notas', notasRoutes);

app.use('/professores', professoresRoutes);

app.use('/turmas', turmasRoutes);

// ======================================================
// TRATAMENTO DE ERRO 404
// ======================================================

app.use((req, res) => {
    res.status(404).json({
        erro: 'Rota não encontrada',
        rota: req.originalUrl
    });
});

// ======================================================
// PORTA
// ======================================================

const PORT = process.env.PORT || 3000;

// ======================================================
// CONEXÃO COM BANCO E INICIALIZAÇÃO
// ======================================================

async function iniciarServidor() {
    try {
        await sequelize.authenticate();

        console.log('Banco de dados conectado com sucesso!');

        await sequelize.sync();

        console.log('Banco de dados sincronizado com sucesso!');

        app.listen(PORT, () => {
            console.log(`Servidor rodando em http://localhost:${PORT}`);
        });

    } catch (erro) {
        console.error('Erro ao conectar/iniciar o servidor:');
        console.error(erro);
    }
}

iniciarServidor();