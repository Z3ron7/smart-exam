import React, { useState, useEffect } from 'react';
import { FaRegCalendarMinus } from 'react-icons/fa';
import axios from 'axios';
import CreateRoom from './CreateRoom';
import { FaListAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


const Room = () => {
  const [roomData, setRoomData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [examToEdit, setExamToEdit] = useState(null);
  const navigate = useNavigate();


   const openModal = (room) => {
    setIsModalOpen(true);
    setExamToEdit(room);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setExamToEdit(null);
  };

  const fetchRoomData = () => {
    axios.get('http://localhost:3001/room/rooms')
      .then((response) => {
        setRoomData(response.data.rooms);
      })
      .catch((error) => {
        console.error('Error fetching rooms:', error);
      });
  };

  useEffect(() => {
    fetchRoomData();
  }, []); // Fetch room data when the component mounts

  const handleCreateRoom = (roomData) => {
    axios.get('http://localhost:3001/room/refresh-rooms', roomData)
      .then((response) => {
        console.log(response.data);
        // Reset the form fields after successful submission

        // Fetch room data again to update the room list
        fetchRoomData();
      })
      .catch((error) => {
        console.error('Error adding room:', error);
      });
  };
  const handleDeleteRoom = (room_id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this room?');
  
    if (confirmDelete) {
      axios
        .delete(`http://localhost:3001/room/room/${room_id}`)
        .then((response) => {
          if (response.data.success) {
            fetchRoomData();
          } else {
            console.error('Error deleting room:', response.data.message);
          }
        })
        .catch((error) => {
          console.error('Error deleting room:', error);
        });
    }
  };
  
  const isRoomExpiredOrDone = (room) => {
    const currentTimestamp = new Date().getTime();
    const expiryTimestamp = new Date(room.expiry_date).getTime();

    return currentTimestamp >= expiryTimestamp;
  };

  const competencyName = {
    4: 'All Competency',
    1: 'SWWPS',
    2: 'Casework',
    3: 'HBSE',
    5: 'CO',
    6: 'Groupwork',
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
      <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 lg:grid-cols-4 lg:grid-rows-1 gap-4">
        {roomData && roomData.map((room, roomIndex) => (
          <div
          key={roomIndex}
          className='dark:bg-slate-900 border-2 h-[150px] rounded-[8px] bg-white border-l-[6px] border-[#4E73DF] flex items-center px-[20px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out'
          onClick={() => {
            navigate(`/room/view-room/${room.room_id}`);
          }}
        >
            <div className="rounded-lg h-8 w-12 flex items-center p-2 justify-center bg-orange-600">
              <FaListAlt fontSize={20} color="" />
            </div>
            <div className="flex flex-col w-60">
            <div className="flex dark:text-white justify-start ml-2">
              <label className='mr-2 text-sm'>room:</label>
              <h2 className="text-blue-600 text-[15px] font-bold">
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
              <h2 className="text-blue-600 text-[15px] font-bold">
              {timer[room.duration_minutes] || 'No countdown'}
              </h2>
            </div>
            <div className="flex justify-start ml-2">
              <label className='mr-2 dark:text-white text-sm'>Category:</label>
              <h2 className="text-blue-600 text-[15px] font-bold">
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
            <button
              onClick={() => handleDeleteRoom(room.room_id)}
              className="absolute top-0 text-xl font-semibold right-2 text-red-600 hover:text-red-800 cursor-pointer"
            >
              x
            </button>
          </div>
        ))}
        <li onClick={() => openModal()} className="flex cursor-pointer">
          <a className="cursor-pointer hover:border-indigo-900 hover:border-solid dark:text-white hover:bg-indigo-700 hover:text-blue-500 group w-full flex flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-900 text-sm leading-6 text-slate-900 font-medium py-3">
            <svg className="group-hover:text-white mb-1 text-slate-900" width="20" height="20" fill="currentColor" aria-hidden="true">
              <path d="M10 5a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2h-3v3a1 1 0 1 1-2 0v-3H6a1 1 0 1 1 0-2h3V6a1 1 0 0 1 1-1Z" />
            </svg>
            Create Exam
          </a>
            <CreateRoom
              isOpen={isModalOpen}
              onClose={closeModal}
              examToEdit={examToEdit}
              onCreateRoom={handleCreateRoom}
            />
        </li>
      </div>
    </div>
  );
};

export default Room;
