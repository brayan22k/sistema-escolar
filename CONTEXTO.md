# Contexto de continuidade

Este arquivo preserva o contexto de trabalho entre conversas. Atualize-o ao
final de cada etapa relevante, registrando decisões e o próximo passo concreto.

## Objetivo do projeto

Construir um sistema escolar com frontend em React/Vite e backend em
Node.js/Express.

## Estado atual

- A Missão 001 contém o módulo inicial de alunos.
- A Missão 002 foi implementada: cadastro, listagem e relação entre turmas e alunos.
- A sincronização usa `DB_SYNC_ALTER` para atualizar uma tabela `alunos` já existente.
- As listas de alunos e turmas usam tabela Material UI, busca global e ações de editar/excluir.
- Existe uma carga SQL de teste em `backend/sql/seed-missao-002.sql` com três turmas e seis alunos.
- A Missão 003 trata do boletim diário.
- O histórico do Git possui os commits `Initial commit: sistema escolar frontend and backend` e `ajustes`, mas eles não descrevem detalhadamente cada etapa.

## Estrutura relevante

- Backend: `backend/src/server.js`
- Rotas principais: `backend/src/routes/index.js`
- Módulo de alunos: `backend/src/routes/alunos/`, `backend/src/controllers/alunoController.js` e `backend/src/models/Aluno.js`
- Frontend: `frontend/src/App.jsx` e `frontend/src/styles.css`

## Decisões importantes

- Cada novo módulo do backend deve ter suas próprias rotas, controller e model.
- `backend/src/routes/index.js` deve apenas registrar os módulos.
- O cadastro existente de alunos não deve ser quebrado ao implementar turmas ou boletim.

## Pendências

- Validar o fluxo da Missão 002 contra o MySQL configurado em `backend/.env`.
- Confirmar no navegador o fluxo de edição e exclusão após conectar ao MySQL.
- Manter `DB_SYNC_FORCE=false` ao testar dados persistidos.
- Implementar e validar o boletim diário da Missão 003.
- Atualizar esta seção conforme cada pendência for resolvida.

## Histórico de missões

Use esta seção para registrar o encerramento de cada missão. Cada registro deve
conter o resultado entregue, as validações e as pendências que seguem para a
próxima missão.

### Missões concluídas

- Missão 002: módulo de turmas implementado em 2026-08-16.
	- Cadastro e listagem de turmas.
	- Relacionamento 1:N entre turma e aluno usando `turma_id`.
	- Vínculo e consulta de alunos por turma.
	- Interface de gestão integrada ao painel.
	- Build do frontend e sintaxe do backend validados.
	- Validação contra o banco depende das credenciais locais.

## Última atualização

- Data: 2026-08-16
- Ação: configurado `DB_SYNC_FORCE=false` e `DB_SYNC_ALTER=true` no ambiente local para preservar registros ao criar/ajustar tabelas.
- Próximo passo: validar o fluxo com MySQL antes da apresentação da missão.

## Como atualizar

Ao concluir uma etapa, atualize somente o que mudou:

1. estado atual;
2. decisões que não devem ser esquecidas;
3. pendências concluídas ou novas;
4. última atualização e próximo passo.

Ao concluir uma missão, também:

5. adicione um registro em `Histórico de missões`;
6. reescreva o `README.md` para preparar a próxima missão.