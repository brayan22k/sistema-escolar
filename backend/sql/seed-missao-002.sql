-- Dados ficticios para testar a Missao 002.
-- Execute depois que o backend tiver criado as tabelas com sequelize.sync().
-- Banco esperado: MySQL / sistema_escolar.

USE sistema_escolar;

START TRANSACTION;

-- Turmas: evita duplicar registros quando o script for executado novamente.
INSERT INTO turmas (nome, serie, ano, createdAt, updatedAt)
SELECT '1 DS', '1 Ano', 2026, NOW(), NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM turmas WHERE nome = '1 DS' AND ano = 2026
);

INSERT INTO turmas (nome, serie, ano, createdAt, updatedAt)
SELECT '2 DS', '2 Ano', 2026, NOW(), NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM turmas WHERE nome = '2 DS' AND ano = 2026
);

INSERT INTO turmas (nome, serie, ano, createdAt, updatedAt)
SELECT '3 DS', '3 Ano', 2026, NOW(), NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM turmas WHERE nome = '3 DS' AND ano = 2026
);

-- Alunos: os e-mails funcionam como identificadores unicos para reexecucao.
INSERT INTO alunos
  (nome, email, data_nascimento, serie, cpf, telefone, endereco, turma_id, createdAt, updatedAt)
VALUES
  ('Ana Souza', 'ana.souza.teste@escola.local', '2008-03-15', '1 Ano', '90000000001', '(11) 90000-0001', 'Rua A, 101', (SELECT id FROM turmas WHERE nome = '1 DS' AND ano = 2026 LIMIT 1), NOW(), NOW()),
  ('Bruno Lima', 'bruno.lima.teste@escola.local', '2008-07-22', '1 Ano', '90000000002', '(11) 90000-0002', 'Rua B, 202', (SELECT id FROM turmas WHERE nome = '1 DS' AND ano = 2026 LIMIT 1), NOW(), NOW()),
  ('Carla Mendes', 'carla.mendes.teste@escola.local', '2007-02-10', '2 Ano', '90000000003', '(11) 90000-0003', 'Rua C, 303', (SELECT id FROM turmas WHERE nome = '2 DS' AND ano = 2026 LIMIT 1), NOW(), NOW()),
  ('Diego Alves', 'diego.alves.teste@escola.local', '2007-11-05', '2 Ano', '90000000004', '(11) 90000-0004', 'Rua D, 404', (SELECT id FROM turmas WHERE nome = '2 DS' AND ano = 2026 LIMIT 1), NOW(), NOW()),
  ('Elisa Rocha', 'elisa.rocha.teste@escola.local', '2006-01-30', '3 Ano', '90000000005', '(11) 90000-0005', 'Rua E, 505', (SELECT id FROM turmas WHERE nome = '3 DS' AND ano = 2026 LIMIT 1), NOW(), NOW()),
  ('Felipe Costa', 'felipe.costa.teste@escola.local', '2006-09-18', '3 Ano', '90000000006', '(11) 90000-0006', 'Rua F, 606', (SELECT id FROM turmas WHERE nome = '3 DS' AND ano = 2026 LIMIT 1), NOW(), NOW())
ON DUPLICATE KEY UPDATE
  nome = VALUES(nome),
  data_nascimento = VALUES(data_nascimento),
  serie = VALUES(serie),
  cpf = VALUES(cpf),
  telefone = VALUES(telefone),
  endereco = VALUES(endereco),
  turma_id = VALUES(turma_id),
  updatedAt = NOW();

COMMIT;

-- Conferencia dos dados inseridos.
SELECT
  t.nome AS turma,
  t.serie,
  t.ano,
  a.id AS aluno_id,
  a.nome AS aluno,
  a.email
FROM turmas t
LEFT JOIN alunos a ON a.turma_id = t.id
WHERE t.ano = 2026
  AND t.nome IN ('1 DS', '2 DS', '3 DS')
ORDER BY t.nome, a.nome;
