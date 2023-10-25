import React, { useState, useEffect } from 'react';
import { FaRegCalendarMinus } from 'react-icons/fa';
import axios from 'axios';
import ExamRoom from './ExamRoom';

const Room = () => {
  const [roomData, setRoomData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [examToEdit, setExamToEdit] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

   const openModal = (room) => {
    setIsModalOpen(true);
    setExamToEdit(room);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setExamToEdit(null);
  };

  const handleRoomSelection = (room) => {
    setSelectedRoom(room);
  };

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
  const competencyName = {
    4: 'All Competency',
    1: 'SWWPS',
    2: 'Casework',
    3: 'HBSE',
    5: 'CO',
    6: 'Groupwork',
  };
  return (
    <div>
      {selectedRoom ? (
        <ExamRoom selectedRoom={selectedRoom} />
      ) : (
        <>
          <header className="dark:bg-slate-800 space-y-4 p-4 sm:px-8 sm:py-6 lg:p-4 xl:px-8 xl:py-6 mb-2 border-[#4E73DF] border-2">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-900 items-center dark-text-white">Exam Room</h2>
            </div>
            <form className="group relative">
              <svg width="20" height="20" fill="currentColor" className="absolute left-3 top-1/2 -mt-2.5 text-slate-400 pointer-events-none group-focus-within:text-blue-500" aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
              </svg>
              <input className="focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 placeholder-slate-400 rounded-md py-2 pl-10 ring-1 ring-slate-200 shadow-sm" type="text" aria-label="Filter room" placeholder="Filter room..." />
            </form>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 lg:grid-cols-4 lg:grid-rows-1 gap-4">
            {roomData.map((room, roomIndex) => (
              <div
                key={roomIndex}
                className="dark-bg-slate-800 border-2 h-[150px] rounded-[8px] bg-white border-l-[6px] border-[#4E73DF] flex items-center px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out"
                onClick={() => setSelectedRoom(room)}
              >
                <div className="rounded-full h-12 w-12 flex items-center justify-center bg-orange-600">
                  <FaRegCalendarMinus fontSize={28} color="" />
                </div>
                <div className="flex flex-col w-60">
                  <h2 className="text-[#B589DF] text-[20px] leading-[17px] px-[10px] font-bold">
                    {room.room_name}
                  </h2>
                  <h3 className="text-[#B589DF] text-[15px] leading-[17px] px-[10px] font-bold">{room.duration_minutes}</h3>
                  <h1 className="text-[12px] leading-[24px] font-bold text-[#5a5c69] mt-[5px] px-[10px] dark-text-white">
                    {room.description.length > 30 ? `${room.description.slice(0, 30)}...` : room.description}
                  </h1>
                  <div className="flex items-center flex-nowrap mt-3 justify-end">
                    <h2 className="text-[#B589DF] text-[20px] leading-[17px] px-[10px] font-bold">
                      {competencyName[room.competency_id] || 'Unknown Competency'}
                    </h2>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Room;
