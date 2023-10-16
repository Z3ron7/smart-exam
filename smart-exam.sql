-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 16, 2023 at 04:21 AM
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
-- Table structure for table `question`
--

CREATE TABLE `question` (
  `question_id` int(50) NOT NULL,
  `program_id` int(50) NOT NULL,
  `competency_id` int(50) NOT NULL,
  `questionText` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `question`
--

INSERT INTO `question` (`question_id`, `program_id`, `competency_id`, `questionText`) VALUES
(5, 1, 2, 'question'),
(6, 1, 2, 'questiona'),
(7, 1, 3, 'question napud ni'),
(10, 1, 2, 'adada'),
(11, 1, 1, 'question ra gud'),
(12, 1, 1, 'dasdad'),
(13, 1, 2, 'adnakdasd'),
(14, 1, 2, 'question lagi sa diay ka');

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
  `user_id` int(200) NOT NULL,
  `name` varchar(100) NOT NULL,
  `username` varchar(80) NOT NULL,
  `password` varchar(220) NOT NULL,
  `gender` varchar(11) NOT NULL,
  `status` varchar(50) NOT NULL,
  `role` varchar(50) NOT NULL,
  `isVerified` tinyint(1) NOT NULL DEFAULT 0,
  `image` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `name`, `username`, `password`, `gender`, `status`, `role`, `isVerified`, `image`, `created_at`) VALUES
(1, 'Zoren', 'zoren.panilagao1@gmail.com', '$2b$05$.zEAOYtKchnR6ejmhN80Vu6cR1PXC1wVbPRMcz2pQvBU8hxaEDVwm', '', '', '0', 1, '', '2023-10-15 09:20:00'),
(2, 'Renzo', 'zoren.panilagao7@gmail.com', '$2b$05$okrD2VHBqSxYE4ZEGKWGUOoSBfJfjysPcFbcFvynPsiggWUUk5UfG', '', '', '0', 1, '', '2023-10-15 09:22:25'),
(3, 'Neroz', 'zoren.panilagao74@gmail.com', '$2b$05$Ew3//KaVO.YMl1mbNq43luZ7WNAnGEEdWT5wDQwTMDAG4QKxIrv8O', '', '', '0', 1, '', '2023-10-15 09:22:27'),
(4, 'Renz', 'zoren.panilagaow74@gmail.com', '$2b$05$tZw7RDprNm96TXlWuPZiw.BpfVsP56X8WhiTyG76.QR4cxtNNHSbO', '', '', '0', 1, '', '2023-10-15 09:22:28'),
(6, 'sada', 'dsadsadas@gmail.com', '$2b$05$5fY/SpXqjCgbgOcey1zgJulbivpb4GcaGKImZMCS5OOX/11mQYylS', '', '', '0', 2, '', '2023-10-15 09:22:32'),
(7, 'sadas', 'zoren.panilagao74s@gmail.com', '$2b$05$awm/OOFsp/6sNAjmXKAGKOY79xxMV5RxwYEDuNy5Q7BSSzMynx7qu', '', '', '0', 0, '', '2023-10-15 07:46:22'),
(8, 'Zeron', 'zoren.panilagao722@gmail.com', '$2b$05$IwTfGL/7Dy5.mRt860gk0ucHNQRhK8UfFZM/6oM17qL/y3v7YAFrW', '', '', '0', 0, '', '2023-10-15 07:46:22'),
(9, 'Renzs', 'zoren.panilagaos1@gmail.com', '$2b$05$jw1GWo5OI0FhRcSqZHP0He4ksf9Aw7/CssC6cewRtAuD2WGseSMrS', '', '', '0', 0, '', '2023-10-15 07:46:22'),
(10, 'Zorens', 'zoren.panilagaoss7@gmail.com', '$2b$05$d87Bk.hFtx1Bm4XwbQ7Nsuo.jDdx5/k3cLsLI5tu6YbuAIq18o7zu', '', '', '0', 0, '', '2023-10-15 07:46:22'),
(11, 'dsad', 'dasdsa@sdad', '$2b$05$2j5OXEExarFBa1fd.OCHQOJcN1gEc19GEUdFJ1bueDYEkh3xCtPx6', '', '', '0', 0, '', '2023-10-15 07:46:22'),
(12, 'Renzos', 'zoren.panilagao11@gmail.com', '$2b$05$nCfErpF4Z9uAn6aBYe0tH.Y.ndS1nBvbOA/sgjmCuogvA3UZmPhPC', '', '', '0', 0, '', '2023-10-15 07:46:22'),
(13, 'Zorensz', 'zorenn.panilagao1@gmail.com', '$2b$05$Mqc2EDujQagJAWCMlpg5negGfMLD/6T9rpy/FhujJQd0S8/jLYiOC', '', '', '0', 0, '', '2023-10-15 07:46:22'),
(14, 'Neroz', 'zoren.panilagao111@gmail.com', '$2b$05$7atidkUi7xuSpPzClbKPzum4tFvJNeeLuyuVoEvpi/9FAjU//kgiW', '', 'admin', 'Admin', 0, '', '2023-10-15 07:46:22'),
(15, 'guelexort', 'guelexort12@gmail.com', '$2b$05$9GEUXNMbeC2MXm0X1v3J1uO6HoDSFlnAL4fS3/L7bTlNE.Xn0/xXe', '', '', '0', 0, '', '2023-10-15 07:46:22'),
(16, 'Zoren', 'zoren12@gmail.com', '$2b$05$G/p/T/XuebuTaBYooDq9ZunpwNRLGuXHUPmSPhkZ31MpaZhiC5lxm', '', '', '0', 0, '', '2023-10-15 07:46:22'),
(17, 'john', 'john1@gmail.com', '$2b$05$cUSXnniFAO1uJdq4nfW9AOUT4lwVF/dVAxYpiQlM7HLBSPWfUgN1e', '', '', '0', 0, '', '2023-10-15 07:46:22'),
(18, 'Enzo', 'student1@gmail.com', '$2b$05$rROpGVIeX1wOvq51rxO1x.xF2T.thIAVEnJaFLyTCnp4Iu.5YqVDi', '', 'student', 'Exam-taker', 0, '', '2023-10-15 07:46:22'),
(19, 'Dre', 'student2@gmail.com', '$2b$05$ZbmsfioIJgUBRiu2uOw0IOsfooksew4V9/a6rAn2wp9Mpm2.CfpI6', '', 'student', 'Exam-taker', 0, '', '2023-10-15 07:46:22'),
(21, 'Super Admin', 'super.admin@gmail.com', '$2b$05$CvhtKaUzJnGih1M1jQXObu9CEGFVxVSLOk/oZH9ed7F5quPW64LvC', '', 'super admin', 'Super Admin', 1, '', '2023-10-15 07:46:22'),
(24, 'student3', 'zoren.panilagao71@gmail.coma', '$2b$05$upLibHg1MPa2sAGcpiHKxuGcDicZfhSSHX4v3MFMgqDEwv8KlxiHu', 'male', 'student', 'Exam-taker', 0, 'C:\\Users\\zoren\\smart-exam\\server\\avatar\\1697382322741.jpg', '2023-10-15 15:05:23'),
(25, 'student3', 'zoren.panilagao71@gmail.com', '$2b$05$PnMeYlb0JZK2GdLXQROC0e4SIr0DYAU0h2lQO7nTO4WAbqPf62teS', 'male', 'alumni', 'Exam-taker', 1, 'C:\\Users\\zoren\\smart-exam\\server\\avatar\\1697382500319.png', '2023-10-15 17:52:29'),
(26, 'student4', 'zoren.panilagao71@gmail.comaaa', '$2b$05$IcOM8wF.wwSLKIPJIFG5tOOxAwzbFhwfMWbb8LOhSUGrfN5nsPrMO', 'male', 'alumni', 'Exam-taker', 0, 'server/avatar/Flowchart_Admin.png', '2023-10-15 15:59:51'),
(27, 'student5', 'zoren.panilagao71@gmail.comaaas', '$2b$05$GBmbpMxvO4tMZaKRWbm/quqr2lhFZlO0blNDHMmGH.x1ImPlvPtOe', 'male', 'alumni', 'Exam-taker', 0, 'http://localhost:3000/avatar/Flowchart.jpg', '2023-10-16 00:51:25');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `exam_room`
--
ALTER TABLE `exam_room`
  ADD PRIMARY KEY (`exam_room_id`),
  ADD KEY `program_data` (`program_id`),
  ADD KEY `competency` (`competency_id`);

--
-- Indexes for table `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`question_id`),
  ADD KEY `program` (`program_id`),
  ADD KEY `competencies` (`competency_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `exam_room`
--
ALTER TABLE `exam_room`
  MODIFY `exam_room_id` int(200) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `question`
--
ALTER TABLE `question`
  MODIFY `question_id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` int(200) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(200) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `exam_room`
--
ALTER TABLE `exam_room`
  ADD CONSTRAINT `competency` FOREIGN KEY (`competency_id`) REFERENCES `competency` (`competency_id`),
  ADD CONSTRAINT `program_data` FOREIGN KEY (`program_id`) REFERENCES `program` (`program_id`);

--
-- Constraints for table `question`
--
ALTER TABLE `question`
  ADD CONSTRAINT `competencies` FOREIGN KEY (`competency_id`) REFERENCES `competency` (`competency_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `program` FOREIGN KEY (`program_id`) REFERENCES `program` (`program_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
