import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ExamHistory() {
  const [openTab, setOpenTab] = useState(1);
  const [userExams, setUserExams] = useState([]);
  const [adminExams, setAdminExams] = useState([]);

  useEffect(() => {
    // Fetch user exams and admin exams when the component mounts
    fetchUserExams();
    fetchAdminExams();
  }, []);

  const fetchUserExams = () => {
    // Replace 'userId' with the actual user ID from localStorage
    const userId = localStorage.getItem("user_id");

    axios.get(`http://localhost:3001/users/fetch-user-exams?userId=${userId}`)
      .then((response) => {
        setUserExams(response.data.userExams);
      })
      .catch((error) => {
        console.error("Error fetching user exams:", error);
      });
  };

  const fetchAdminExams = () => {
    const userId = localStorage.getItem("user_id");
    axios.get(`http://localhost:3001/fetch-admin-exams?userId=${userId}`)
      .then((response) => {
        setAdminExams(response.data.adminExams);
      })
      .catch((error) => {
        console.error("Error fetching admin exams:", error);
      });
  };

  return (
    <div>
      <div className="container mx-auto mt-12">
        <div className="flex flex-col items-center justify-center max-w-xl">
          <ul className="flex space-x-2">
            <li>
              <a
                href="#"
                onClick={() => setOpenTab(1)}
                className={` ${openTab === 1 ? "bg-purple-600 text-white" : ""} inline-block px-4 py-2 text-gray-600 bg-white rounded shadow`}
              >
                Admin-set Exams
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={() => setOpenTab(2)}
                className={` ${openTab === 2 ? "bg-purple-600 text-white" : ""} inline-block px-4 py-2 text-gray-600 bg-white rounded shadow`}
              >
                Personal Exams
              </a>
            </li>
          </ul>
          <div className="p-3 mt-6 bg-white border">
            <div className={openTab === 1 ? "block" : "hidden"}>
              {/* Display admin-set exams */}
              {adminExams.map((exam) => (
                <div key={exam.exam_id} className="border-2 p-4 m-2">
                  <h3>{exam.exam_name}</h3>
                  <p>{exam.description}</p>
                  <p>Score: {exam.score}</p>
                  <p>Total Duration (minutes): {exam.total_duration_minutes}</p>
                  <p>Program: {exam.program_name}</p>
                  <p>Competency: {exam.competency_name}</p>
                  <p>Duration: {exam.duration_minutes} minutes</p>
                </div>
              ))}
            </div>
            <div className={openTab === 2 ? "block" : "hidden"}>
              {/* Display personal exams */}
              {userExams.map((exam) => (
                <div key={exam.exam_id} className="border-2 p-4 m-2">
                  <p>Program: {exam.program_name}</p>
                  <p>Competency: {exam.competency_name}</p>
                  <p>Start Time: {exam.start_time}</p>
                  <p>End Time: {exam.end_time}</p>
                  <p>Score: {exam.score}</p>
                  <p>Total Duration (minutes): {exam.total_duration_minutes}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
