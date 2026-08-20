import express from 'express';
import cors from 'cors';

import sequelize from './config/database.js';


// ======================================================
// ROTAS
// ======================================================

import alunoRoutes from './routes/alunos/routes.js';

import turmaRoutes from './routes/turmas/routes.js';

import professorRoutes from './routes/professores/routes.js';

import notaRoutes from './routes/notas/routes.js';


// ======================================================
// APP
// ======================================================

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
// ROTA PRINCIPAL
// ======================================================

app.get('/', (req, res) => {

    res.status(200).send(
        'API do Sistema Escolar funcionando!'
    );

});


// ======================================================
// ROTAS DOS ALUNOS
// ======================================================

app.use('/', alunoRoutes);


// ======================================================
// ROTAS DAS TURMAS
// ======================================================

app.use('/', turmaRoutes);


// ======================================================
// ROTAS DOS PROFESSORES
// ======================================================

app.use('/', professorRoutes);


// ======================================================
// ROTAS DAS NOTAS
// ======================================================

app.use('/', notaRoutes);


// ======================================================
// INICIAR SERVIDOR
// ======================================================

async function iniciarServidor() {

    try {

        await sequelize.authenticate();

        console.log(
            'Banco de dados conectado com sucesso!'
        );


        app.listen(PORT, () => {

            console.log(
                `Servidor rodando em http://localhost:${PORT}`
            );

        });

    } catch (erro) {

        console.error(
            'Erro ao conectar ao banco de dados:',
            erro
        );

    }

}


iniciarServidor();