import express from 'express';
import notaController from '../../controllers/notaController.js';

const routes = express.Router();

routes.get('/notas', notaController.listarNotas);
routes.post('/notas', notaController.cadastrarNota);
routes.put('/notas/:id', notaController.editarNota);
routes.delete('/notas/:id', notaController.excluirNota);

export default routes;
