# Contexto de continuidade

Este arquivo preserva o contexto de trabalho entre conversas. Atualize-o ao
final de cada etapa relevante, registrando decisões e o próximo passo concreto.

## Objetivo do projeto

Construir um sistema escolar com frontend em React/Vite e backend em
Node.js/Express.

## Estado atual

- A Missão 001 contém o módulo inicial de alunos.
- A Missão 002 foi implementada: cadastro, listagem e relação entre turmas e alunos.
- A Missão 003 foi introduzida com o módulo de boletim digital: cadastro de notas, consulta por aluno/disciplina e resumo de médias.
- A sincronização usa `DB_SYNC_ALTER` para atualizar tabelas existentes sem apagar registros.
- As listas de alunos, turmas e notas usam tabela Material UI, busca global e ações de editar/excluir quando relevantes.
- Existe uma carga SQL de teste em `backend/sql/seed-missao-002.sql` com três turmas e seis alunos.
- A estrutura do backend agora inclui `Nota`, rota de `/notas` e associação com `Aluno`.
- O frontend exibe uma aba de boletim com formulário, lista de notas e resumo de desempenho.

## Estrutura relevante

- Backend: `backend/src/server.js`
- Rotas principais: `backend/src/routes/index.js`
- Módulo de alunos: `backend/src/routes/alunos/`, `backend/src/controllers/alunoController.js` e `backend/src/models/Aluno.js`
- Módulo de turma: `backend/src/routes/turmas/`, `backend/src/controllers/turmaController.js` e `backend/src/models/Turma.js`
- Módulo de boletim: `backend/src/routes/boletim/`, `backend/src/controllers/notaController.js` e `backend/src/models/Nota.js`
- Frontend: `frontend/src/App.jsx` e `frontend/src/styles.css`

## Decisões importantes

- Cada novo módulo do backend deve ter suas próprias rotas, controller e model.
- `backend/src/routes/index.js` deve apenas registrar os módulos.
- O cadastro existente de alunos não deve ser quebrado ao implementar turmas ou boletim.
- As notas são armazenadas com relação `Aluno -> Muitas Notas` e validam intervalo entre 0 e 10.
- O boletim precisa manter a lógica de visualização simples e transparente para apresentação em aula.

## Pendências

- Validar o fluxo da Missão 002 contra o MySQL configurado em `backend/.env`.
- Confirmar no navegador o fluxo de edição e exclusão após conectar ao MySQL.
- Manter `DB_SYNC_FORCE=false` ao testar dados persistidos.
- Validar o módulo de boletim com banco real e navegador.
- Ajustar o vínculo de alunos por turma com operação de desvínculo e revínculo em fluxo contínuo.
- Atualizar esta seção conforme cada pendência for resolvida.

## Histórico de missões

### Missões concluídas

- Missão 002: módulo de turmas implementado em 2026-08-16.
  - Cadastro e listagem de turmas.
  - Relacionamento 1:N entre turma e aluno usando `turma_id`.
  - Vínculo e consulta de alunos por turma.
  - Interface de gestão integrada ao painel.
  - Build do frontend e sintaxe do backend validados.
  - Validação contra o banco depende das credenciais locais.

- Missão 003: módulo de boletim digital introduzido em 2026-08-23.
  - Modelagem de notas com `aluno_id`, `disciplina`, `bimestre` e `nota`.
  - Backend com rotas `GET/POST/DELETE /notas`.
  - Associação `Aluno.hasMany(Nota)` e `Nota.belongsTo(Aluno)`.
  - Interface em React com cadastro e listagem de notas.
  - Resumo de média geral e situação do aluno.
  - Validação de build e sintaxe executadas após a implementação.

## Última atualização

- Data: 2026-08-23
- Ação: corrigida a navegação por botões do painel ao definir `type="button"` nos botões de menu e sair, evitando submit implícito e recarregamento de tela.
- Próximo passo: validar o fluxo completo contra o MySQL e concluir a verificação visual no navegador.

## Como atualizar

Ao concluir uma etapa, atualize somente o que mudou:

1. estado atual;
2. decisões que não devem ser esquecidas;
3. pendências concluídas ou novas;
4. última atualização e próximo passo.

Ao concluir uma missão, também:

5. adicione um registro em `Histórico de missões`;
6. reescreva o `README.md` para preparar a próxima missão.