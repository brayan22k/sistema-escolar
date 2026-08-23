# Persistema - Sistema Escolar

Sistema didático desenvolvido pelos alunos do 3º ano de Desenvolvimento de
Sistemas. A Missão 003 introduz o boletim digital com lançamento e consulta de
notas.

O histórico de decisões e o estado entre conversas ficam em
[CONTEXTO.md](CONTEXTO.md).

## Missão 003 entregue

O sistema permite:

- cadastrar alunos, turmas e vincular alunos a uma turma;
- lançar notas por aluno, disciplina e bimestre;
- listar as notas cadastradas em uma tabela centralizada;
- consultar o desempenho por disciplina e situação da nota;
- calcular uma média geral e exibir um resumo do boletim;
- manter a base da Missão 001 e 002 funcionando no mesmo painel.

## Como executar

### Backend

```bash
cd backend
npm install
npm run dev
```

O backend usa as configurações do arquivo `backend/.env` e sincroniza os modelos
quando o servidor inicia. `DB_SYNC_ALTER=true` mantém os registros existentes ao
atualizar a estrutura do banco.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Acesse `http://localhost:5173`.

## Endpoints da Missão 003

| Método | Endpoint | Finalidade |
| --- | --- | --- |
| `GET` | `/notas` | Lista as notas cadastradas |
| `POST` | `/notas` | Cadastra uma nova nota |
| `DELETE` | `/notas/:id` | Exclui uma nota |

O módulo de alunos e turmas continua com seus endpoints anteriores em `/alunos`
 e `/turmas`.

Exemplo de cadastro:

```json
{
  "aluno_id": 1,
  "disciplina": "Matemática",
  "bimestre": "1º Bimestre",
  "nota": 8.5
}
```

## Organização do código

- `backend/src/models/Aluno.js`: modelo de aluno com `turma_id` opcional.
- `backend/src/models/Turma.js`: modelo de turma.
- `backend/src/models/Nota.js`: modelo de notas do boletim.
- `backend/src/controllers/notaController.js`: regras de cadastro e consulta de notas.
- `backend/src/routes/boletim/routes.js`: rotas da Missão 003.
- `frontend/src/App.jsx`: painel com módulos de alunos, turmas e boletim.

Cada módulo do backend mantém suas rotas, controller e model separados. O
arquivo `backend/src/routes/index.js` apenas registra os módulos existentes.

## Padrão dos relatórios

As listas de registros são apresentadas com tabela do Material UI. A tela de
boletim segue o mesmo padrão: busca global, colunas objetivas e ações rápidas.

## Validações realizadas

- Build do frontend executado com sucesso.
- Sintaxe dos arquivos JavaScript do backend validada com `node --check`.
- O fluxo contra o MySQL depende das credenciais configuradas em `backend/.env`.

## Próxima etapa

A próxima missão pode ampliar o boletim com média por disciplina, ranking de
alunos, dashboard do diretor e mini boletim individual.

## Guia pedagógico da Missão 003

Objetivo da Missão 003:
- lançar notas do aluno;
- registrar disciplina, bimestre e nota;
- consultar notas e médias;
- preparar o sistema para boletim digital.

### Modelagem sugerida

- `notas`: id, aluno_id, disciplina, bimestre, nota.
- Relacionamento: `Aluno` possui muitas `Notas`.

### Checklist de QA

- cadastro com aluno, disciplina, bimestre e nota preenchidos;
- nota salva com valor válido entre 0 e 10;
- lista exibe os registros corretamente;
- média geral calculada sem erros visíveis;
- sistema continua funcionando com as missões anteriores.

### Boss Challenge

- calcular média do aluno;
- classificar aprovação, recuperação ou reprovação;
- mostrar resumo geral do boletim.  "serie": "3o Ano",
  "ano": "2026"
}

Padrao de resposta esperada:

{
  "id": 1,
  "nome": "3o DS",
  "serie": "3o Ano",
  "ano": "2026"
}

## 5) Erros comuns que a turma deve evitar

- Colocar todas as rotas no mesmo arquivo.
- Misturar logica de alunos e turmas no mesmo controller.
- Alterar diretamente o server para adicionar regra de negocio.
- Quebrar o endpoint de alunos ja pronto.
- Pular validacao de campos obrigatorios.

## 6) Definicao de pronto da Missao 002

A missao esta pronta quando:
- Existe modulo de turmas separado no backend.
- Front consegue cadastrar e listar turmas.
- Existe relacao turma-aluno validada pelo QA.
- Missao 001 continua funcionando.

## 7) Sugestao de apresentacao final (3 minutos)

1. Problema: alunos sem organizacao por turma.
2. Solucao tecnica: novo modulo "turmas" com rotas e controller proprios.
3. Evidencia: cadastro de turma + vinculacao de aluno + consulta.
4. Aprendizado: separacao de responsabilidades e modularizacao.
