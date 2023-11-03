import React, { useState, useEffect } from 'react';
import { FaListAlt } from 'react-icons/fa';
import axios from 'axios';
import ExamRoom from './ExamRoom';
import { useNavigate } from 'react-router-dom';

const Room = () => {
  const [roomData, setRoomData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch room data from the backend API
    axios.get('http://localhost:3001/room/rooms')
      .then((response) => {
        setRoomData(response.data.rooms);
      })
      .catch((error) => {
        console.error('Error fetching rooms:', error);
      });
  }, []);
  const isRoomExpiredOrDone = (room) => {
    const currentTimestamp = new Date().getTime();
    const expiryTimestamp = new Date(room.expiry_date).getTime();

    return currentTimestamp >= expiryTimestamp;
  };

  const handleRoomClick = (room) => {
    if (isRoomExpiredOrDone(room)) {
      alert('This room is expired and cannot be accessed.');
    } else {
      navigate(`/student-room/exam-room/${room.room_id}`);
    }
  };
  const competencyName = {
    6: 'All Competency',
    1: 'SWWPS',
    2: 'Casework',
    3: 'HBSE',
    4: 'CO',
    5: 'Groupwork',
  };

  const timer = {
   0: '0',
   1: '1 hour',
   2: '2 hours',
   3: '3 hours',
   4: '4 hours',
   5: '5 hours'
  };
  return (
    <div>
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 lg:grid-cols-4 lg:grid-rows-1 gap-4">
            {roomData.map((room, roomIndex) => (
              <div
              key={roomIndex}
              className={`dark:bg-slate-900 border-2 h-[150px] rounded-[8px] bg-white border-l-[6px] border-[#4E73DF] flex items-center px-[20px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out ${
                isRoomExpiredOrDone(room) ? 'cursor-not-allowed' : ''
              }`}
              onClick={() => handleRoomClick(room)}
            >
                <div className="rounded-lg h-8 w-12 flex items-center p-2 justify-center bg-orange-600">
                  <FaListAlt fontSize={20} color="" />
                </div>
                <div className="flex flex-col w-60">
                <div className="flex dark:text-white justify-start ml-2">
                  <label className='mr-2 text-sm'>room:</label>
                  <h2 className="text-blue-600 text-[13px] font-bold">
                    {room.room_name}
                  </h2>
                </div>
                <div className="flex justify-start ml-2">
                  <label className='mr-2 dark:text-white text-xs'>Description:</label>
                  <h2 className="text-blue-600 text-[12px] font-bold">
                  {room.description.length > 15 ? `${room.description.slice(0, 15)}...` : room.description}
                  </h2>
                </div>
                <div className="flex justify-start ml-2">
                  <label className='mr-2 dark:text-white text-sm'>Time limit:</label>
                  <h2 className="text-blue-600 text-[13px] font-bold">
                  {timer[room.duration_minutes] || 'No countdown'}
                  </h2>
                </div>
                <div className="flex justify-start ml-2">
                  <label className='mr-2 dark:text-white text-sm'>Category:</label>
                  <h2 className="text-blue-600 text-[13px] font-bold">
                  {competencyName[room.competency_id] || 'Unknown Competency'}
                  </h2>
                </div>
                <div className="flex justify-end ml-2 mt-3">
              <label className='mr-2 dark:text-white text-sm'>Status:</label>
              <h2 className={`text-blue-600 text-[15px] font-bold ${
                isRoomExpiredOrDone(room) ? 'text-red-500' : ''
              }`}>
                {isRoomExpiredOrDone(room) ? 'Expired' : 'Active'}
              </h2>
            </div>
                </div>
              </div>
            ))}
          </div>
        </>
    </div>
  );
};

export default Room;
