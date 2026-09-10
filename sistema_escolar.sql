-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Sep 04, 2026 at 05:04 PM
-- Server version: 8.4.3
-- PHP Version: 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sistema_escolar`
--

-- --------------------------------------------------------

--
-- Table structure for table `alunos`
--

CREATE TABLE `alunos` (
  `id` int NOT NULL,
  `nome` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `data_nascimento` date DEFAULT NULL,
  `turma` varchar(255) DEFAULT NULL,
  `cpf` varchar(14) DEFAULT NULL,
  `telefone` varchar(255) DEFAULT NULL,
  `endereco` text,
  `fk_turma` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `alunos`
--

INSERT INTO `alunos` (`id`, `nome`, `email`, `data_nascimento`, `turma`, `cpf`, `telefone`, `endereco`, `fk_turma`) VALUES
(19, 'lucas', 'lucas@gmail.com', '2001-12-02', NULL, NULL, NULL, NULL, 13),
(20, 'ruam', 'ruam@gmail.com', '2001-12-02', NULL, NULL, NULL, NULL, 13),
(21, 'lucas', 'lucassixseven@gmail.com', '2001-12-02', NULL, NULL, NULL, NULL, 13),
(22, 'felipe', 'teste12@gmail.com', '2001-12-02', NULL, NULL, NULL, NULL, 14);

-- --------------------------------------------------------

--
-- Table structure for table `disciplinas`
--

CREATE TABLE `disciplinas` (
  `id` int NOT NULL,
  `nome` varchar(255) NOT NULL,
  `descricao` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `disciplinas`
--

INSERT INTO `disciplinas` (`id`, `nome`, `descricao`) VALUES
(7, 'Matemática', 'Disciplina de Matemática'),
(8, 'Português', 'Disciplina de Português'),
(9, 'ia', 'ia boost'),
(10, 'backend', 'ia');

-- --------------------------------------------------------

--
-- Table structure for table `notas`
--

CREATE TABLE `notas` (
  `id` int NOT NULL,
  `aluno_id` int NOT NULL,
  `disciplina_id` int DEFAULT NULL,
  `disciplina` varchar(100) NOT NULL,
  `bimestre` varchar(30) NOT NULL,
  `nota` decimal(4,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `notas`
--

INSERT INTO `notas` (`id`, `aluno_id`, `disciplina_id`, `disciplina`, `bimestre`, `nota`) VALUES
(17, 19, 9, 'ia', '2º Bimestre', '10.00'),
(18, 19, NULL, 'Front-End', '1º Bimestre', '0.00'),
(19, 19, NULL, 'Front-End', '3º Bimestre', '10.00'),
(20, 20, NULL, 'Front-End', '1º Bimestre', '10.00'),
(21, 22, NULL, 'Front-End', '2º Bimestre', '10.00'),
(22, 22, NULL, 'Back-End', '1º Bimestre', '10.00');

-- --------------------------------------------------------

--
-- Table structure for table `professores`
--

CREATE TABLE `professores` (
  `id` int NOT NULL,
  `usuario_id` int DEFAULT NULL,
  `nome` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `disciplina` varchar(255) NOT NULL,
  `usuario` varchar(50) DEFAULT NULL,
  `senha` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `professores`
--

INSERT INTO `professores` (`id`, `usuario_id`, `nome`, `email`, `disciplina`, `usuario`, `senha`) VALUES
(10, 3, 'Professor Teste', 'professor@escola.com', 'Matemática', 'professor', '123456'),
(11, 4, 'Professor Teste 2', 'professor2@escola.com', 'Matemática', 'professor2', '123456'),
(13, NULL, 'tomas', 'tomas@gmail.com', 'ia boost', 'tomas', '$2b$10$CWySBY2WVQuBFutcNGa5xeebvOa2Z20PtQIc2jpzb1x/mFaBDJPoi');

-- --------------------------------------------------------

--
-- Table structure for table `professor_disciplinas`
--

CREATE TABLE `professor_disciplinas` (
  `id` int NOT NULL,
  `professor_id` int NOT NULL,
  `disciplina_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `professor_disciplinas`
--

INSERT INTO `professor_disciplinas` (`id`, `professor_id`, `disciplina_id`) VALUES
(1, 10, 7),
(2, 10, 8);

-- --------------------------------------------------------

--
-- Table structure for table `turmas`
--

CREATE TABLE `turmas` (
  `id` int NOT NULL,
  `nome` varchar(100) NOT NULL,
  `serie` varchar(100) NOT NULL,
  `letra` varchar(1) NOT NULL,
  `ano` int NOT NULL,
  `professor` varchar(100) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `turmas`
--

INSERT INTO `turmas` (`id`, `nome`, `serie`, `letra`, `ano`, `professor`, `createdAt`, `updatedAt`) VALUES
(13, '1º Ano A', '1º Ano', 'A', 2026, 'thomas', '2026-09-04 11:52:18', '2026-09-04 11:52:18'),
(14, '1º Ano A', '1º Ano', 'A', 2000, NULL, '2026-09-04 15:47:41', '2026-09-04 15:47:41'),
(15, '3º Ano B', '3º Ano', 'B', 2026, 'anderson', '2026-09-04 16:08:34', '2026-09-04 16:08:34');

-- --------------------------------------------------------

--
-- Table structure for table `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int NOT NULL,
  `nome` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `perfil` enum('admin','professor','aluno') NOT NULL DEFAULT 'aluno'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `usuarios`
--

INSERT INTO `usuarios` (`id`, `nome`, `email`, `senha`, `perfil`) VALUES
(1, 'Administrador', 'admin@escola.com', '$2b$10$E4f4dHxy4rGAT4Aw2ziItexcV/4D.bHxtdH2dFvYeRzsP0LBdmILy', 'admin'),
(3, 'Professor Teste', 'professor@escola.com', '123456', 'professor'),
(4, 'Professor Teste 2', 'professor2@escola.com', '123456', 'professor');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `alunos`
--
ALTER TABLE `alunos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `cpf` (`cpf`),
  ADD KEY `fk_turma` (`fk_turma`);

--
-- Indexes for table `disciplinas`
--
ALTER TABLE `disciplinas`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notas`
--
ALTER TABLE `notas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `notas_aluno_id_disciplina_bimestre` (`aluno_id`,`disciplina`,`bimestre`),
  ADD KEY `fk_notas_disciplina` (`disciplina_id`);

--
-- Indexes for table `professores`
--
ALTER TABLE `professores`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `usuario` (`usuario`),
  ADD KEY `fk_professor_usuario` (`usuario_id`);

--
-- Indexes for table `professor_disciplinas`
--
ALTER TABLE `professor_disciplinas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `professor_disciplinas_professor_id_disciplina_id` (`professor_id`,`disciplina_id`),
  ADD KEY `fk_prof_disc_disciplina` (`disciplina_id`);

--
-- Indexes for table `turmas`
--
ALTER TABLE `turmas`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `alunos`
--
ALTER TABLE `alunos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `disciplinas`
--
ALTER TABLE `disciplinas`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `notas`
--
ALTER TABLE `notas`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `professores`
--
ALTER TABLE `professores`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `professor_disciplinas`
--
ALTER TABLE `professor_disciplinas`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `turmas`
--
ALTER TABLE `turmas`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `alunos`
--
ALTER TABLE `alunos`
  ADD CONSTRAINT `alunos_ibfk_1` FOREIGN KEY (`fk_turma`) REFERENCES `turmas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `notas`
--
ALTER TABLE `notas`
  ADD CONSTRAINT `fk_notas_disciplina` FOREIGN KEY (`disciplina_id`) REFERENCES `disciplinas` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `notas_ibfk_1` FOREIGN KEY (`aluno_id`) REFERENCES `alunos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `professores`
--
ALTER TABLE `professores`
  ADD CONSTRAINT `fk_professor_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

--
-- Constraints for table `professor_disciplinas`
--
ALTER TABLE `professor_disciplinas`
  ADD CONSTRAINT `fk_prof_disc_disciplina` FOREIGN KEY (`disciplina_id`) REFERENCES `disciplinas` (`id`),
  ADD CONSTRAINT `fk_prof_disc_professor` FOREIGN KEY (`professor_id`) REFERENCES `professores` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
