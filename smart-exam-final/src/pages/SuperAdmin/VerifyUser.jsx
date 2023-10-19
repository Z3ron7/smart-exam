// SuperAdminVerificationPage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function VerifyUser({isOpen, onClose}) {
  const [unverifiedUsers, setUnverifiedUsers] = useState([]);

  useEffect(() => {
    // Fetch a list of unverified users from the server
    axios.get('http://localhost:3001/verify/unverified-users').then((response) => {
      setUnverifiedUsers(response.data);
    });
  }, []);

  const handleAcceptUser = (userId) => {
    // Send a request to the server to accept the user
    axios.post(`http://localhost:3001/verify/accept-user/${userId}`).then(() => {
      // Update the list of unverified users
      setUnverifiedUsers((users) => users.filter((user) => user.user_id !== userId));

      localStorage.setItem('isVerified', 'true');
    });
  };

  const handleRejectUser = (userId) => {
    // Send a request to the server to reject the user
    axios.post(`http://localhost:3001/verify/reject-user/${userId}`).then(() => {
      // Update the list of unverified users
      setUnverifiedUsers((users) => users.filter((user) => user.user_id !== userId));

      localStorage.setItem('isVerified', 'false');
    });
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 ${
        isOpen ? 'block' : 'hidden'
      } bg-opacity-50 bg-gray-900`}
      onClick={onClose}
    >
      <div
        className="modal-container bg-white w-3/5 p-4 border border-gray-700 mb-2 rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="absolute top-2 right-2 text-gray-600" onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      <h2>User Verification</h2>
      <div className="max-h-96 overflow-y-auto">
      <ul>
  <li className="bg-gray-200 p-2 font-semibold">
    <div className="grid grid-cols-3 gap-2">
      <div>Name</div>
      <div>Email</div>
      <div>Actions</div>
    </div>
  </li>
  {unverifiedUsers.map((user) => (
    <li key={user.user_id} className="border-b border-gray-200 p-2 flex items-center justify-between">
      <div>{user.name}</div>
      <div>{user.username}</div>
      <div>
        <button onClick={() => handleAcceptUser(user.user_id)} className="bg-green-500 text-white px-2 py-1 rounded-md mr-2">
          Accept
        </button>
        <button onClick={() => handleRejectUser(user.user_id)} className="bg-red-500 text-white px-2 py-1 rounded-md">
          Reject
        </button>
      </div>
    </li>
  ))}
</ul>
</div>
    </div>
    </div>
  );
}

export default VerifyUser;


// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       if (selectedProgram) {
//         let response;

//         if (selectedCompetency?.value === 'All Competency') {
//           // If "All Competency" is selected, fetch questions for all available competencies
//           const competencies = ['SWPPS', 'Casework', 'HBSE']; // Replace with your predefined competencies
//           const allQuestions = [];

//           // Fetch questions for each competency and merge the results
//           for (const competency of competencies) {
//             const competencyResponse = await axios.get(
//               `http://localhost:3001/questions/refresh?program=${selectedProgram.label || ''}&competency=${competency}`
//             );

//             // Check if questions already exist in allQuestions array
//             for (const question of competencyResponse.data) {
//               const existingQuestion = allQuestions.find((q) => q.question_id === question.question_id);
//               if (!existingQuestion) {
//                 allQuestions.push(question);
//               }
//             }
//           }
//           response = { data: allQuestions };
//           localStorage.setItem('selectedCompetencyId', 'All');
//         } else if (selectedCompetency) {
//           // Fetch questions for the selected competency
//           response = await axios.get(
//             `http://localhost:3001/questions/refresh?program=${selectedProgram.label || ''}&competency=${selectedCompetency.value || ''}`
//           );
//           localStorage.setItem('selectedCompetencyId', selectedCompetency.value);
//         } else {
//           // If no competency is selected, use all questions
//           await fetchQuestions();
//           return; // Exit early to avoid setting state again
//         }
//         setQuestionsData(response.data);
//         // setMaxQuestions(response.data.length);
//         // setCurrentQuestion(0);

//       }
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   fetchData();
// }, [selectedProgram, selectedCompetency]);