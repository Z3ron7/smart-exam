-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 29, 2023 at 11:25 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `smart-exam`
--

-- --------------------------------------------------------

--
-- Table structure for table `choices`
--

CREATE TABLE `choices` (
  `choice_id` int(200) NOT NULL,
  `question_id` int(200) NOT NULL,
  `choiceText` varchar(200) NOT NULL,
  `is_correct` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `choices`
--

INSERT INTO `choices` (`choice_id`, `question_id`, `choiceText`, `is_correct`) VALUES
(1, 3, 'chocie', 0),
(2, 3, 'choice2', 1),
(3, 4, 'choisc', 0),
(4, 4, 'choice', 1),
(5, 4, 'sdsd', 0),
(6, 5, 'choice112', 0),
(7, 5, 'choice', 1),
(8, 5, 'choice232', 0);

-- --------------------------------------------------------

--
-- Table structure for table `competency`
--

CREATE TABLE `competency` (
  `competency_id` int(200) NOT NULL,
  `competency_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `competency`
--

INSERT INTO `competency` (`competency_id`, `competency_name`) VALUES
(1, 'SWPPS'),
(2, 'Casework'),
(3, 'HBSE');

-- --------------------------------------------------------

--
-- Table structure for table `exam`
--

CREATE TABLE `exam` (
  `exam_id` int(200) NOT NULL,
  `user_id` int(200) NOT NULL,
  `program_id` int(100) NOT NULL,
  `competency_id` int(220) NOT NULL,
  `question_id` int(200) NOT NULL,
  `total_score` int(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `exam_room`
--

CREATE TABLE `exam_room` (
  `exam_room_id` int(200) NOT NULL,
  `room_name` varchar(100) NOT NULL,
  `program_id` int(50) NOT NULL,
  `competency_id` int(100) NOT NULL,
  `date_created` date NOT NULL,
  `date_expire` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `exam_scores`
--

CREATE TABLE `exam_scores` (
  `score_id` int(200) NOT NULL,
  `exam_id` int(200) NOT NULL,
  `user_id` int(200) NOT NULL,
  `date_completed` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `log-in`
--

CREATE TABLE `log-in` (
  `session_id` int(220) NOT NULL,
  `user_id` int(200) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expiration` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `program`
--

CREATE TABLE `program` (
  `program_id` int(200) NOT NULL,
  `program_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `program`
--

INSERT INTO `program` (`program_id`, `program_name`) VALUES
(1, 'Social Work');

-- --------------------------------------------------------

--
-- Table structure for table `question`
--

CREATE TABLE `question` (
  `question_id` int(200) NOT NULL,
  `program_id` int(200) NOT NULL,
  `competency_id` int(200) NOT NULL,
  `questionText` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `question`
--

INSERT INTO `question` (`question_id`, `program_id`, `competency_id`, `questionText`) VALUES
(1, 1, 2, 'sdsad'),
(2, 1, 1, 'sdsad'),
(3, 1, 1, 'sdsad'),
(4, 1, 3, 'question'),
(5, 1, 2, 'question121');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `role_id` int(200) NOT NULL,
  `role_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`role_id`, `role_name`) VALUES
(1, 'Admin'),
(2, 'Exam-taker'),
(3, 'Admin'),
(4, 'Exam-taker'),
(5, 'Admin'),
(6, 'Admin'),
(7, 'Exam-taker'),
(8, 'Exam-taker');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(200) NOT NULL,
  `name` varchar(100) NOT NULL,
  `username` varchar(80) NOT NULL,
  `password` varchar(220) NOT NULL,
  `status` varchar(50) NOT NULL,
  `role` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `username`, `password`, `status`, `role`) VALUES
(14, 'Neroz', 'zoren.panilagao111@gmail.com', '$2b$05$7atidkUi7xuSpPzClbKPzum4tFvJNeeLuyuVoEvpi/9FAjU//kgiW', 'admin', 'Admin'),
(15, 'guelexort', 'guelexort12@gmail.com', '$2b$05$9GEUXNMbeC2MXm0X1v3J1uO6HoDSFlnAL4fS3/L7bTlNE.Xn0/xXe', '', '0'),
(16, 'Zoren', 'zoren12@gmail.com', '$2b$05$G/p/T/XuebuTaBYooDq9ZunpwNRLGuXHUPmSPhkZ31MpaZhiC5lxm', '', '0'),
(17, 'john', 'john1@gmail.com', '$2b$05$cUSXnniFAO1uJdq4nfW9AOUT4lwVF/dVAxYpiQlM7HLBSPWfUgN1e', '', '0'),
(18, 'Enzo', 'student1@gmail.com', '$2b$05$rROpGVIeX1wOvq51rxO1x.xF2T.thIAVEnJaFLyTCnp4Iu.5YqVDi', 'student', 'Exam-taker'),
(19, 'Dre', 'student2@gmail.com', '$2b$05$ZbmsfioIJgUBRiu2uOw0IOsfooksew4V9/a6rAn2wp9Mpm2.CfpI6', 'student', 'Exam-taker'),
(20, 'Student', 'student@gmail.com', '$2b$05$6T6.E17oU2P2FDUwtKHjNOGq2pMKQkJX2WlTEP/wvQ/Eegqrl7Zka', 'student', 'Exam-taker');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `choices`
--
ALTER TABLE `choices`
  ADD PRIMARY KEY (`choice_id`),
  ADD UNIQUE KEY `choice_id` (`choice_id`),
  ADD KEY `choices` (`question_id`);

--
-- Indexes for table `competency`
--
ALTER TABLE `competency`
  ADD PRIMARY KEY (`competency_id`);

--
-- Indexes for table `exam`
--
ALTER TABLE `exam`
  ADD PRIMARY KEY (`exam_id`),
  ADD KEY `programm` (`program_id`),
  ADD KEY `competencyy` (`competency_id`),
  ADD KEY `question` (`question_id`),
  ADD KEY `user` (`user_id`);

--
-- Indexes for table `exam_room`
--
ALTER TABLE `exam_room`
  ADD PRIMARY KEY (`exam_room_id`),
  ADD KEY `program_data` (`program_id`),
  ADD KEY `competency` (`competency_id`);

--
-- Indexes for table `exam_scores`
--
ALTER TABLE `exam_scores`
  ADD PRIMARY KEY (`score_id`),
  ADD KEY `Test5` (`exam_id`);

--
-- Indexes for table `log-in`
--
ALTER TABLE `log-in`
  ADD PRIMARY KEY (`session_id`),
  ADD KEY `Test6` (`user_id`);

--
-- Indexes for table `program`
--
ALTER TABLE `program`
  ADD PRIMARY KEY (`program_id`);

--
-- Indexes for table `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`question_id`),
  ADD KEY `program` (`program_id`),
  ADD KEY `competency` (`competency_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `choices`
--
ALTER TABLE `choices`
  MODIFY `choice_id` int(200) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `competency`
--
ALTER TABLE `competency`
  MODIFY `competency_id` int(200) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `exam`
--
ALTER TABLE `exam`
  MODIFY `exam_id` int(200) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `exam_room`
--
ALTER TABLE `exam_room`
  MODIFY `exam_room_id` int(200) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `exam_scores`
--
ALTER TABLE `exam_scores`
  MODIFY `score_id` int(200) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `log-in`
--
ALTER TABLE `log-in`
  MODIFY `session_id` int(220) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `program`
--
ALTER TABLE `program`
  MODIFY `program_id` int(200) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `question`
--
ALTER TABLE `question`
  MODIFY `question_id` int(200) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` int(200) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(200) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `choices`
--
ALTER TABLE `choices`
  ADD CONSTRAINT `choices` FOREIGN KEY (`question_id`) REFERENCES `question` (`question_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `exam`
--
ALTER TABLE `exam`
  ADD CONSTRAINT `competencyy` FOREIGN KEY (`competency_id`) REFERENCES `competency` (`competency_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `programm` FOREIGN KEY (`program_id`) REFERENCES `program` (`program_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `question` FOREIGN KEY (`question_id`) REFERENCES `question` (`question_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `exam_scores`
--
ALTER TABLE `exam_scores`
  ADD CONSTRAINT `Test5` FOREIGN KEY (`exam_id`) REFERENCES `exam` (`exam_id`);

--
-- Constraints for table `log-in`
--
ALTER TABLE `log-in`
  ADD CONSTRAINT `Test6` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `question`
--
ALTER TABLE `question`
  ADD CONSTRAINT `competency` FOREIGN KEY (`competency_id`) REFERENCES `competency` (`competency_id`),
  ADD CONSTRAINT `program` FOREIGN KEY (`program_id`) REFERENCES `program` (`program_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
