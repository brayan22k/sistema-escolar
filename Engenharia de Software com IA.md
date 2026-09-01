# Engenharia de Software com IA
## Como estruturar projetos para trabalhar de forma eficiente com agentes de Inteligência Artificial

---

# 1. Introdução

A Inteligência Artificial deixou de ser apenas uma ferramenta para gerar pequenos trechos de código.

Atualmente, ferramentas como agentes de IA conseguem:

- analisar projetos inteiros;
- compreender arquiteturas;
- criar e modificar arquivos;
- executar comandos;
- executar testes;
- identificar erros;
- refatorar código;
- implementar funcionalidades;
- documentar alterações;
- continuar trabalhos iniciados por outros agentes.

Porém, existe um problema:

> Quanto maior o projeto, maior a quantidade de informações que a IA precisa compreender.

Se o projeto não possuir uma estrutura adequada de contexto, cada nova sessão pode exigir que a IA descubra novamente:

- o que o sistema faz;
- quais são seus requisitos;
- quais tecnologias são utilizadas;
- quais decisões arquiteturais foram tomadas;
- quais regras de negócio existem;
- o que já foi implementado;
- o que ainda precisa ser feito;
- por que determinadas decisões foram tomadas.

Por isso, trabalhar profissionalmente com IA exige mais do que saber escrever prompts.

É necessário aprender a **projetar o contexto que será fornecido ao agente**.

---

# 2. O problema do contexto

Imagine que um desenvolvedor entregue para um agente de IA um projeto com:

- 300 arquivos;
- 50 módulos;
- banco de dados;
- API;
- frontend;
- testes;
- documentação;
- regras de negócio.

E faça simplesmente o pedido:

> "Implemente o módulo de usuários."

O agente precisará descobrir sozinho:

- onde está o módulo;
- como a arquitetura funciona;
- como os usuários são armazenados;
- quais regras existem;
- como os endpoints são estruturados;
- como os testes são escritos;
- quais padrões devem ser utilizados.

Isso pode funcionar em projetos pequenos.

Em projetos maiores, entretanto, surgem problemas.

## Problemas comuns

### 2.1 Perda de contexto

A IA não possui necessariamente memória permanente de todas as sessões anteriores.

Uma nova sessão pode interpretar o projeto de maneira diferente da anterior.

### 2.2 Decisões esquecidas

Uma equipe pode ter decidido:

> "Não utilizaremos uma classe CRUD genérica."

Sem documentação dessa decisão, outro agente pode criar exatamente essa abstração.

### 2.3 Duplicação

O agente pode implementar algo que já existe porque não encontrou ou não compreendeu uma funcionalidade existente.

### 2.4 Alterações inconsistentes

Uma implementação pode seguir um padrão diferente do restante do projeto.

### 2.5 Contexto excessivo

Também existe o problema contrário.

Fornecer todos os arquivos para a IA não significa necessariamente fornecer melhor contexto.

Quanto mais informações irrelevantes forem apresentadas, mais difícil pode ser identificar aquilo que realmente importa para a tarefa.

---

# 3. A nova habilidade: Engenharia de Contexto

Quando desenvolvemos software utilizando agentes de IA, surge uma nova preocupação:

> Como organizar as informações do projeto para que diferentes agentes consigam compreendê-lo e modificá-lo corretamente?

Podemos chamar isso de:

## Engenharia de Contexto para Desenvolvimento de Software

O objetivo é construir uma estrutura que permita ao agente descobrir:

1. Como deve trabalhar.
2. O que o sistema deve fazer.
3. Por que determinadas decisões foram tomadas.
4. O que está sendo desenvolvido atualmente.
5. O que aconteceu durante o desenvolvimento.
6. O que realmente está implementado.

---

# 4. Separando tipos diferentes de conhecimento

Uma das principais ideias é não colocar todas as informações em um único documento.

Diferentes informações possuem diferentes funções.

Uma arquitetura de contexto pode utilizar:

```text
Projeto
│
├── AI.md
│
├── spec/
│
├── decisions/
│
├── tasks/
│
├── memory/
│
├── src/
│
└── tests/
```

Cada camada responde a uma pergunta diferente.

| Camada | Pergunta |
|---|---|
| AI.md | Como a IA deve trabalhar? |
| spec/ | O que o sistema deve ser? |
| decisions/ | Por que decidimos fazer dessa forma? |
| tasks/ | O que estamos fazendo agora? |
| memory/ | O que aconteceu durante o desenvolvimento? |
| src/ | O que está implementado? |
| tests/ | O que foi comprovado que funciona? |

Essa separação é fundamental.

---

# 5. AI.md — O contrato de trabalho da IA

O arquivo `AI.md` representa as regras de atuação do agente.

Ele não deve ser utilizado para descrever detalhadamente todo o sistema.

Sua função é explicar **como o agente deve trabalhar naquele projeto**.

Pode conter:

- papel do agente;
- princípios de desenvolvimento;
- arquitetura utilizada;
- padrões obrigatórios;
- tecnologias;
- regras para alteração do código;
- regras de testes;
- regras de documentação;
- utilização da memória;
- utilização das especificações;
- comportamento diante de dúvidas;
- processo de validação.

---

## 5.1 Exemplo conceitual

```text
Antes de implementar uma alteração:

1. Compreender a tarefa.
2. Identificar o domínio afetado.
3. Consultar a especificação correspondente.
4. Consultar as decisões arquiteturais relacionadas.
5. Consultar a tarefa atual.
6. Analisar o código existente.
7. Propor a estratégia de implementação.
8. Implementar.
9. Executar testes.
10. Atualizar a documentação necessária.
11. Registrar o resultado.
```

O objetivo não é controlar cada linha escrita pela IA.

O objetivo é estabelecer um **processo consistente**.

---

# 6. Spec — A especificação do sistema

O diretório `spec/` representa aquilo que o sistema **deve ser**.

Ele pode conter:

```text
spec/
│
├── product/
├── requirements/
├── domains/
├── business-rules/
├── use-cases/
├── api/
└── architecture/
```

A organização pode variar conforme o projeto.

O princípio é:

> A especificação descreve o comportamento esperado do sistema.

---

# 7. O que deve existir em uma especificação?

Uma especificação pode descrever:

### Produto

- objetivo;
- público;
- escopo;
- funcionalidades.

### Requisitos

- requisitos funcionais;
- requisitos não funcionais.

### Domínios

- entidades;
- relacionamentos;
- responsabilidades.

### Regras de negócio

- validações;
- restrições;
- condições;
- comportamentos obrigatórios.

### Casos de uso

- fluxos;
- atores;
- pré-condições;
- resultados esperados.

### Arquitetura

- componentes;
- comunicação;
- tecnologias;
- padrões.

---

# 8. Decisões arquiteturais

Durante o desenvolvimento, muitas decisões são tomadas.

Por exemplo:

> "Escolhemos utilizar determinada tecnologia."

Mas uma pergunta inevitavelmente aparece:

> Por quê?

É aí que entram os registros de decisões.

Podemos utilizar:

```text
decisions/
```

ou o padrão conhecido como:

```text
ADR — Architecture Decision Record
```

---

# 9. O que é um ADR?

Um ADR registra uma decisão importante.

Uma estrutura simples pode ser:

```text
ADR-001 — Escolha da arquitetura

Status:
Accepted

Contexto:
O sistema precisa suportar múltiplos módulos.

Decisão:
Será utilizada uma arquitetura baseada em funcionalidades.

Motivo:
Permite maior isolamento entre os módulos.

Consequências:
Cada funcionalidade possuirá seus próprios componentes.
```

---

# 10. Por que decisões são importantes para agentes?

Sem uma decisão registrada:

```text
Agente A
     ↓
Escolhe arquitetura X
```

Depois:

```text
Agente B
     ↓
Analisa o projeto
     ↓
Escolhe arquitetura Y
```

O segundo agente pode acreditar que está melhorando o projeto.

Na realidade, pode estar desfazendo uma decisão anterior.

Com ADR:

```text
Agente B
   ↓
Consulta ADR
   ↓
Entende a decisão
   ↓
Mantém a arquitetura
```

O histórico passa a ser conhecimento reutilizável.

---

# 11. Tasks — O trabalho atual

Existe uma diferença entre:

> O que o sistema é?

e:

> O que estamos fazendo agora?

Essa segunda pergunta pertence às tarefas.

Podemos utilizar:

```text
tasks/
│
├── backlog.md
├── current.md
└── completed.md
```

Uma tarefa deve possuir um objetivo claro.

---

# 12. Estrutura de uma tarefa

Exemplo:

```text
TASK-023 — Implementar autenticação

Objetivo:
Implementar autenticação dos usuários.

Referências:
- especificação de autenticação;
- regras de segurança;
- arquitetura da API.

Critérios de aceite:
- usuário consegue autenticar;
- credenciais inválidas são rejeitadas;
- sessão é criada corretamente;
- testes são implementados.

Status:
In Progress
```

Isso fornece ao agente um contexto muito mais específico.

---

# 13. Memory — Memória operacional

A memória possui uma função diferente.

Ela não deve substituir a especificação.

Ela registra principalmente:

- progresso;
- problemas encontrados;
- descobertas;
- contexto de sessões;
- tarefas concluídas;
- pendências;
- informações úteis para continuidade.

Uma estrutura possível:

```text
memory/
│
├── project-state.md
├── problems.md
├── pending.md
├── completed.md
└── sessions/
```

---

# 14. O que NÃO deve ser colocado na memória?

Evite transformar a memória em uma segunda especificação.

Por exemplo, não é adequado manter:

```text
memory/project.md

Usuário possui:
id
nome
email
senha
```

se essa informação já pertence à especificação ou ao código.

Isso cria duas fontes de verdade.

Se o sistema mudar, a memória poderá ficar desatualizada.

---

# 15. Fontes de verdade

Uma regra importante:

> Nem todo documento possui o mesmo nível de autoridade.

Podemos pensar em diferentes fontes.

```text
Especificação
     ↓
Código
     ↓
Testes
     ↓
Memória
```

Mas a relação entre elas precisa ser definida pelo projeto.

O princípio fundamental é:

> Cada informação importante deve possuir uma fonte de verdade claramente identificada.

---

# 16. Código e documentação

Existe uma diferença importante entre:

### Especificação

> O sistema deve permitir que usuários recuperem suas senhas.

### Código

Implementa essa funcionalidade.

### Teste

Comprova determinados comportamentos.

### Memória

Pode registrar:

> A implementação foi alterada porque a primeira abordagem apresentava problemas de segurança.

Cada camada possui uma função diferente.

---

# 17. O fluxo de trabalho do agente

Uma arquitetura de contexto funciona melhor quando existe um processo.

Podemos representar:

```text
Solicitação
     ↓
Identificar objetivo
     ↓
Identificar domínio
     ↓
Consultar especificação
     ↓
Consultar decisões
     ↓
Consultar tarefa
     ↓
Analisar código
     ↓
Planejar
     ↓
Implementar
     ↓
Testar
     ↓
Validar
     ↓
Atualizar documentação
     ↓
Registrar memória
     ↓
Finalizar
```

Esse processo reduz alterações impulsivas.

---

# 18. Contexto mínimo necessário

Um dos princípios mais importantes:

> O agente não precisa conhecer todo o projeto para executar toda tarefa.

Imagine:

```text
Projeto
├── Usuários
├── Produtos
├── Pedidos
├── Pagamentos
├── Relatórios
└── Notificações
```

Se a tarefa for:

> Implementar validação de produtos.

Não é necessário carregar todo o contexto de pagamentos, notificações e relatórios.

O agente deveria buscar:

```text
Produto
  ↓
Especificação
  ↓
Regras de negócio
  ↓
Decisões relacionadas
  ↓
Código relacionado
  ↓
Testes relacionados
```

Isso é **contexto direcionado**.

---

# 19. Contexto excessivo também é um problema

É comum pensar:

> "Quanto mais informações eu fornecer para a IA, melhor."

Isso não é necessariamente verdade.

Contexto irrelevante pode:

- aumentar o custo;
- aumentar o tempo;
- dificultar a análise;
- gerar confusão;
- fazer o agente perder informações importantes;
- aumentar a possibilidade de decisões incorretas.

O objetivo não é fornecer **mais contexto**.

O objetivo é fornecer:

> **o contexto certo.**

---

# 20. Agente não deve começar codificando

Um erro comum é pedir:

> "Implemente essa funcionalidade."

e esperar que o agente imediatamente comece a criar arquivos.

Uma abordagem profissional começa com investigação.

O agente deve primeiro descobrir:

- o que precisa ser feito;
- onde deve ser feito;
- quais regras existem;
- quais padrões devem ser seguidos;
- quais decisões precisam ser respeitadas;
- como validar a implementação.

Somente depois deve modificar o código.

---

# 21. Planejamento antes da implementação

Um fluxo recomendado:

```text
ENTENDER
   ↓
INVESTIGAR
   ↓
PLANEJAR
   ↓
IMPLEMENTAR
   ↓
TESTAR
   ↓
DOCUMENTAR
```

A IA não deve ser avaliada apenas pela quantidade de código produzido.

Um bom agente produz:

> código correto + contexto correto + validação correta.

---

# 22. Testes como parte do contexto

Os testes possuem uma função adicional.

Eles não servem apenas para encontrar erros.

Eles também documentam comportamentos esperados.

Por exemplo:

```text
Teste:
usuário não pode realizar determinada operação
sem autorização.
```

Esse teste passa a ser uma forma executável de especificação.

Por isso:

> Testes são também uma fonte de conhecimento para agentes.

Ao implementar uma nova funcionalidade, o agente deve analisar testes existentes relacionados.

---

# 23. Memória entre agentes

Imagine uma equipe utilizando:

- Agente A;
- Agente B;
- Agente C.

O Agente A implementa uma funcionalidade.

Depois o projeto é entregue ao Agente B.

O Agente B não deveria depender da memória pessoal do Agente A.

As informações importantes devem estar no próprio projeto.

```text
Agente A
   ↓
Código
   ↓
Decisões
   ↓
Tasks
   ↓
Memory
   ↓
Agente B
```

O projeto passa a ser capaz de **transportar contexto entre agentes**.

---

# 24. O projeto como memória externa

Essa é uma das ideias centrais desta abordagem.

Um projeto preparado para IA não depende apenas do modelo.

Ele possui uma memória externa estruturada.

```text
                 ┌───────────────┐
                 │   Agente IA   │
                 └───────┬───────┘
                         │
             ┌───────────┴───────────┐
             │                       │
             ▼                       ▼
       Contexto do projeto      Código
             │                       │
     ┌───────┼────────┐              │
     ▼       ▼        ▼              ▼
    Spec  Decisions  Memory        Tests
```

Isso permite que diferentes agentes trabalhem sobre o mesmo sistema.

---

# 25. Uma arquitetura completa

Uma estrutura genérica poderia ser:

```text
projeto/
│
├── AI.md
│
├── spec/
│   ├── product/
│   ├── requirements/
│   ├── domains/
│   ├── business-rules/
│   ├── use-cases/
│   └── architecture/
│
├── decisions/
│   ├── ADR-001.md
│   ├── ADR-002.md
│   └── ADR-003.md
│
├── tasks/
│   ├── backlog.md
│   ├── current.md
│   └── completed.md
│
├── memory/
│   ├── project-state.md
│   ├── problems.md
│   ├── pending.md
│   └── sessions/
│
├── src/
│
└── tests/
```

Essa estrutura não é obrigatória.

Ela é um **modelo conceitual**.

Cada projeto pode adaptá-la.

---

# 26. O papel do desenvolvedor muda

Quando trabalhamos com agentes de IA, o desenvolvedor não deixa de ser responsável pelo software.

O papel muda.

O desenvolvedor passa a atuar cada vez mais como:

- arquiteto;
- planejador;
- revisor;
- responsável pelas decisões;
- responsável pelos requisitos;
- responsável pela qualidade;
- orientador dos agentes.

A IA pode escrever código.

Mas alguém precisa determinar:

> Qual código deve ser escrito?

---

# 27. Prompt não é suficiente

Um prompt pode dizer:

> "Crie uma API para gerenciar produtos."

Mas um projeto profissional precisa responder:

- Qual arquitetura?
- Quais regras?
- Qual banco?
- Quais padrões?
- Quais validações?
- Quais permissões?
- Quais erros?
- Quais testes?
- Quais critérios de aceite?

Essas informações não deveriam depender exclusivamente de um prompt.

Elas devem existir como **conhecimento estruturado do projeto**.

---

# 28. Prompt versus contexto estruturado

### Abordagem simples

```text
Prompt
  ↓
IA
  ↓
Código
```

### Abordagem estruturada

```text
Requisitos
    ↓
Especificação
    ↓
Decisões
    ↓
Tarefa
    ↓
Contexto
    ↓
IA
    ↓
Código
    ↓
Testes
    ↓
Memória
```

A segunda abordagem é mais adequada para projetos complexos e de longa duração.

---

# 29. Benefícios

Uma estrutura de contexto bem definida proporciona:

### Consistência

Diferentes agentes seguem os mesmos padrões.

### Continuidade

Um agente consegue continuar o trabalho de outro.

### Rastreabilidade

É possível entender por que uma decisão foi tomada.

### Menos retrabalho

A IA não precisa redescobrir continuamente o projeto.

### Melhor qualidade

Requisitos, testes e decisões ficam disponíveis.

### Maior autonomia

Agentes conseguem executar tarefas com menos intervenção humana.

### Escalabilidade

A estratégia continua funcionando à medida que o projeto cresce.

---

# 30. Riscos

A utilização de IA também cria novos riscos.

### Documentação desatualizada

Uma documentação incorreta pode induzir o agente ao erro.

### Memória contraditória

Diferentes arquivos podem apresentar informações diferentes.

### Agente excessivamente autônomo

Um agente pode fazer alterações além do necessário.

### Falta de validação

Código gerado não significa código correto.

### Dependência excessiva da IA

O desenvolvedor continua sendo responsável pelas decisões.

---

# 31. Regra de ouro

Uma regra simples para projetos desenvolvidos com IA:

> **Não permita que uma informação importante exista apenas na memória de uma pessoa ou de um agente.**

Se uma decisão é importante:

Documente.

Se uma regra é importante:

Especifique.

Se uma funcionalidade é importante:

Teste.

Se uma tarefa está em andamento:

Registre.

Se uma decisão mudou:

Registre a decisão e seu motivo.

---

# 32. Exercício prático

Imagine que sua equipe recebeu o seguinte projeto:

> Desenvolver um sistema para uma biblioteca.

O sistema deverá permitir:

- cadastro de livros;
- cadastro de usuários;
- empréstimos;
- devoluções;
- controle de atrasos;
- relatórios.

Agora imagine que três agentes de IA trabalharão no projeto.

### Desafio

Determine quais informações deveriam estar em:

```text
AI.md
spec/
decisions/
tasks/
memory/
tests/
```

---

# 33. Exercício — AI.md

Defina pelo menos cinco regras que o agente deveria seguir.

Exemplos de perguntas:

- O agente pode modificar qualquer arquivo?
- Deve executar testes?
- Deve consultar a especificação?
- Pode tomar decisões arquiteturais sozinho?
- Como deve registrar alterações?

---

# 34. Exercício — Spec

Defina quais documentos seriam necessários para descrever o sistema da biblioteca.

Considere:

- requisitos;
- entidades;
- regras de negócio;
- casos de uso;
- arquitetura.

---

# 35. Exercício — Decisions

Imagine que a equipe decidiu:

> "O sistema não permitirá empréstimos para usuários com livros atrasados."

Crie um registro de decisão explicando:

- contexto;
- decisão;
- motivo;
- consequências.

---

# 36. Exercício — Tasks

Crie uma tarefa:

> Implementar o processo de empréstimo de livros.

Defina:

- objetivo;
- referências;
- critérios de aceite;
- testes necessários.

---

# 37. Exercício — Memory

Durante a implementação, o agente descobriu que existia um problema no modelo de dados.

A equipe decidiu alterar a estrutura.

Pergunta:

> Essa informação deve ir para `spec`, `decisions` ou `memory`?

Justifique.

---

# 38. Exercício final

Imagine que você iniciou o desenvolvimento de um projeto hoje.

Amanhã outro agente assumirá o trabalho.

Pergunte:

> O que esse agente precisaria encontrar no projeto para continuar o desenvolvimento sem precisar conversar com o agente anterior?

A resposta para essa pergunta representa o objetivo desta arquitetura.

---

# 39. Conclusão

O desenvolvimento de software com IA não consiste apenas em escrever prompts melhores.

Existe uma nova preocupação:

> **Construir projetos que sejam compreensíveis por agentes de inteligência artificial.**

Para isso, precisamos separar:

```text
Como a IA trabalha
        ↓
      AI.md

O que o sistema deve fazer
        ↓
      spec/

Por que decidimos dessa forma
        ↓
    decisions/

O que estamos fazendo agora
        ↓
      tasks/

O que aconteceu durante o trabalho
        ↓
     memory/

O que realmente está implementado
        ↓
       código

O que foi comprovado
        ↓
      testes
```

O objetivo final não é criar uma grande quantidade de arquivos Markdown.

O objetivo é criar **contexto confiável, organizado e reutilizável**.

---

# 40. Mensagem final

A inteligência artificial pode escrever milhares de linhas de código.

Mas o diferencial de um bom desenvolvedor continuará sendo saber:

- definir o problema;
- compreender o domínio;
- projetar a solução;
- estabelecer regras;
- tomar decisões;
- organizar o contexto;
- validar resultados;
- garantir qualidade.

A IA aumenta a capacidade de desenvolvimento.

A arquitetura de contexto aumenta a capacidade da IA de trabalhar corretamente.

> **O futuro do desenvolvimento de software não será apenas programar com IA. Será saber construir sistemas nos quais a IA consiga trabalhar de forma consistente, segura e previsível.**