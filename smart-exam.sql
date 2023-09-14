-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 14, 2023 at 04:58 AM
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
-- Table structure for table `exam`
--

CREATE TABLE `exam` (
  `exam_id` int(200) NOT NULL,
  `program_id` int(100) NOT NULL,
  `competency_id` int(220) NOT NULL,
  `question_id` int(100) NOT NULL,
  `time_duration` int(200) NOT NULL,
  `date_started` date NOT NULL,
  `date_completed` date NOT NULL,
  `user_id` int(200) NOT NULL
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
-- Table structure for table `question`
--

CREATE TABLE `question` (
  `question_id` int(200) NOT NULL,
  `program` varchar(50) NOT NULL,
  `competency` varchar(50) NOT NULL,
  `questionText` text NOT NULL,
  `choices` varchar(200) NOT NULL,
  `answer` varchar(200) NOT NULL,
  `is_correct` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `question`
--

INSERT INTO `question` (`question_id`, `program`, `competency`, `questionText`, `choices`, `answer`, `is_correct`) VALUES
(32, 'social_work', 'human_behavior', 'question', 'choices,choices1', 'answer', 0),
(33, 'social_work', 'human_behavior', 'question', 'choices,choices1', 'answer', 0),
(34, 'social_work', 'Human Behavior and Social Environment', 'question', 'choices,choices1', 'answer', 0);

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
(1, 'Zoren', 'zoren.panilagao1@gmail.com', '$2b$05$.zEAOYtKchnR6ejmhN80Vu6cR1PXC1wVbPRMcz2pQvBU8hxaEDVwm', '', '0'),
(2, 'Renzo', 'zoren.panilagao7@gmail.com', '$2b$05$okrD2VHBqSxYE4ZEGKWGUOoSBfJfjysPcFbcFvynPsiggWUUk5UfG', '', '0'),
(3, 'Neroz', 'zoren.panilagao74@gmail.com', '$2b$05$Ew3//KaVO.YMl1mbNq43luZ7WNAnGEEdWT5wDQwTMDAG4QKxIrv8O', '', '0'),
(4, 'Renz', 'zoren.panilagaow74@gmail.com', '$2b$05$tZw7RDprNm96TXlWuPZiw.BpfVsP56X8WhiTyG76.QR4cxtNNHSbO', '', '0'),
(5, 'Zero', 'zoren.panilagao71@gmail.com', '$2b$05$6zbMEComGrvjIf23cjVs6eOMqdOL/10pB6H4V1nB4tyf7f0ts.YBq', '', '0'),
(6, 'sada', 'dsadsadas@gmail.com', '$2b$05$5fY/SpXqjCgbgOcey1zgJulbivpb4GcaGKImZMCS5OOX/11mQYylS', '', '0'),
(7, 'sadas', 'zoren.panilagao74s@gmail.com', '$2b$05$awm/OOFsp/6sNAjmXKAGKOY79xxMV5RxwYEDuNy5Q7BSSzMynx7qu', '', '0'),
(8, 'Zeron', 'zoren.panilagao722@gmail.com', '$2b$05$IwTfGL/7Dy5.mRt860gk0ucHNQRhK8UfFZM/6oM17qL/y3v7YAFrW', '', '0'),
(9, 'Renzs', 'zoren.panilagaos1@gmail.com', '$2b$05$jw1GWo5OI0FhRcSqZHP0He4ksf9Aw7/CssC6cewRtAuD2WGseSMrS', '', '0'),
(10, 'Zorens', 'zoren.panilagaoss7@gmail.com', '$2b$05$d87Bk.hFtx1Bm4XwbQ7Nsuo.jDdx5/k3cLsLI5tu6YbuAIq18o7zu', '', '0'),
(11, 'dsad', 'dasdsa@sdad', '$2b$05$2j5OXEExarFBa1fd.OCHQOJcN1gEc19GEUdFJ1bueDYEkh3xCtPx6', '', '0'),
(12, 'Renzos', 'zoren.panilagao11@gmail.com', '$2b$05$nCfErpF4Z9uAn6aBYe0tH.Y.ndS1nBvbOA/sgjmCuogvA3UZmPhPC', '', '0'),
(13, 'Zorensz', 'zorenn.panilagao1@gmail.com', '$2b$05$Mqc2EDujQagJAWCMlpg5negGfMLD/6T9rpy/FhujJQd0S8/jLYiOC', '', '0'),
(14, 'Neroz', 'zoren.panilagao111@gmail.com', '$2b$05$7atidkUi7xuSpPzClbKPzum4tFvJNeeLuyuVoEvpi/9FAjU//kgiW', 'admin', 'Admin'),
(15, 'guelexort', 'guelexort12@gmail.com', '$2b$05$9GEUXNMbeC2MXm0X1v3J1uO6HoDSFlnAL4fS3/L7bTlNE.Xn0/xXe', '', '0'),
(16, 'Zoren', 'zoren12@gmail.com', '$2b$05$G/p/T/XuebuTaBYooDq9ZunpwNRLGuXHUPmSPhkZ31MpaZhiC5lxm', '', '0'),
(17, 'john', 'john1@gmail.com', '$2b$05$cUSXnniFAO1uJdq4nfW9AOUT4lwVF/dVAxYpiQlM7HLBSPWfUgN1e', '', '0'),
(18, 'Enzo', 'student1@gmail.com', '$2b$05$rROpGVIeX1wOvq51rxO1x.xF2T.thIAVEnJaFLyTCnp4Iu.5YqVDi', 'student', 'Exam-taker'),
(19, 'Dre', 'student2@gmail.com', '$2b$05$ZbmsfioIJgUBRiu2uOw0IOsfooksew4V9/a6rAn2wp9Mpm2.CfpI6', 'student', 'Exam-taker');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `exam`
--
ALTER TABLE `exam`
  ADD PRIMARY KEY (`exam_id`),
  ADD KEY `Test` (`program_id`),
  ADD KEY `Test1` (`competency_id`);

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
-- Indexes for table `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`question_id`);

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
-- AUTO_INCREMENT for table `question`
--
ALTER TABLE `question`
  MODIFY `question_id` int(200) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` int(200) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(200) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `exam`
--
ALTER TABLE `exam`
  ADD CONSTRAINT `Test` FOREIGN KEY (`program_id`) REFERENCES `programs` (`program_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Test1` FOREIGN KEY (`competency_id`) REFERENCES `competency` (`competency_id`);

--
-- Constraints for table `exam_room`
--
ALTER TABLE `exam_room`
  ADD CONSTRAINT `competency` FOREIGN KEY (`competency_id`) REFERENCES `competency` (`competency_id`),
  ADD CONSTRAINT `program_data` FOREIGN KEY (`program_id`) REFERENCES `programs` (`program_id`);

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
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
