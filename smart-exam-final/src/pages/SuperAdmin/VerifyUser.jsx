import React, { useState, useEffect } from 'react';
import axios from 'axios';
import error from "../../assets/images/error.png"

function VerifyUser() {
  const [unverifiedUsers, setUnverifiedUsers] = useState([]);

  useEffect(() => {
    // Fetch a list of unverified users from the server
    axios.get('http://localhost:3001/verify/unverified-users').then((response) => {
      setUnverifiedUsers(response.data);
    });
  }, []);

  const handleAcceptUser = (userId) => {
    const confirmAccept = window.confirm('Are you sure you want to accept this user?');
    // Send a request to the server to accept the user
    if (confirmAccept) {
      // Send a request to the server to accept the user
      axios.post(`http://localhost:3001/verify/accept-user/${userId}`).then(() => {
        // Update the list of unverified users
        setUnverifiedUsers((users) => users.filter((user) => user.user_id !== userId));
        localStorage.setItem('isVerified', 'true');
      });
  };
  }

  const handleRejectUser = (userId) => {
    const confirmReject = window.confirm('Are you sure you want to reject this user?');
    // Send a request to the server to reject the user
    if (confirmReject) {
      // Send a request to the server to reject the user
      axios.post(`http://localhost:3001/verify/reject-user/${userId}`).then(() => {
        // Update the list of unverified users
        setUnverifiedUsers((users) => users.filter((user) => user.user_id !== userId));
        localStorage.setItem('isVerified', 'false');
      });
    }
  };

  return (
    <div className='flex items-center justify-center'>
      <div className="w-full p-4 mb-2">
        <button className="absolute top-2 right-2 text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="max-h-96 overflow-y-auto">
          {unverifiedUsers.length === 0 ? ( // Check if there are no unverified users
            <div className='text-center'>
              <img src={error} alt="" className='scale-[135%]' />
              <p className='mt-[15px] text-semibold text-gray-500'>No data available</p>
            </div>
          ) : (
            <ul className="dark:text-white ">
              <li className="bg-slate-600 p-2 font-semibold">
                <div className="grid text-white grid-cols-3 gap-2">
                  <div>Name</div>
                  <div>Email</div>
                  <div className='ml-24'>Actions</div>
                </div>
              </li>
              {unverifiedUsers.map((user) => (
                <li key={user.user_id} className="border-b border-gray-200 p-2 flex justify-between">
                  <div>{user.name}</div>
                  <div>{user.username}</div>
                  <div>
                  <button onClick={() => handleAcceptUser(user.user_id)} className=" text-white px-2 py-1 rounded-md mr-2">
                  <img className='w-5 h-5' src="../check.svg" alt="" />
                    </button>
                    <button onClick={() => handleRejectUser(user.user_id)} className=" text-white px-2 py-1 rounded-md">
                    <img className='w-5 h-5' src="../eks.svg" alt="" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default VerifyUser;
