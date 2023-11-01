import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Select from 'react-select';

const CUSTOM_ANIMATION = {
  mount: { scale: 1 },
  unmount: { scale: 0.9 },
};

const CreateRoom = ({isOpen, onClose}) => {
  const [roomName, setRoomName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedProgram, setSelectedProgram] = useState({ value: 1, label: 'Social Work' });
  const [selectedCompetency, setSelectedCompetency] = useState('All Competency');
  const [expiryDate, setExpiryDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const programValue = selectedProgram ? selectedProgram.value : null;
    const competencyValue = selectedCompetency ? selectedCompetency.value : null;

    if (programValue === null || competencyValue === null) {
      // Handle the case where program or competency is not selected
      console.error('Program or competency is not selected.');
      // You can display an error message to the user or handle it as needed.
      return;
    }

    // Create the room object to send to the API
    const roomData = {
      room_name: roomName,
      description: description,
      program: programValue,
      competency: competencyValue,
      duration_minutes: selectedTime,
      expiry_date: expiryDate,
      date_created: new Date().toISOString(), // Set the current date and time
    };
    console.log('room data:', roomData)

    // Send a POST request to add the room data
    axios.post('http://localhost:3001/room/room', roomData)
      .then((response) => {
        console.log(response.data);
        // Reset the form fields after successful submission
       
      })
      .catch((error) => {
        console.error('Error adding room:', error);
      });
  };

  const programOptions = [
    { value: 'Social Work', label: 'Social Work' },
  ];
  
  const competencyOptions = [
    { value: 4, label: 'All Competency' },
    { value: 1, label: 'SWPPS' },
    { value: 2, label: 'Casework' },
    { value: 3, label: 'HBSE' },
    { value: 5, label: 'CO' },
    { value: 6, label: 'Groupwork' },
  ];
  const countdownOptions = [
    { value: 0, label: '0' },
    { value: 1, label: '1 hour' },
    { value: 2, label: '2 hours' },
    { value: 3, label: '3 hours' },
    { value: 4, label: '4 hours' },
    { value: 5, label: '5 hours' },
  ];
  
  // Add your state variables for selected options
  const [num, setNum] = useState(0);
  const [selectedTime, setSelectedTime] = useState(null);
  const [countdownStarted, setCountdownStarted] = useState(false);
  
  let intervalRef = useRef();
  
  const decreaseNum = () => setNum((prev) => prev - 1);
  
  useEffect(() => {
    if (countdownStarted && selectedTime > 0 && num > 0) {
      intervalRef.current = setInterval(decreaseNum, 1000);
    } else {
      clearInterval(intervalRef.current);
      if (num === 0) {
        // Call the handleEndExam function when the timer reaches 0
      }
    }
    return () => clearInterval(intervalRef.current);
  }, [countdownStarted, selectedTime, num]);
  
  
  const handleTimeChange = (selectedOption) => {
    setSelectedTime(selectedOption.value);
    setNum(selectedOption.value * 3600);
    setCountdownStarted(false);
  };

  return (
    <div animate={CUSTOM_ANIMATION}
      className={`fixed inset-0 flex items-center justify-center z-50 ${
        isOpen ? 'block' : 'hidden' 
      } bg-opacity-50 bg-gray-900`}
      onClick={onClose}
    >
      <div
        className="modal-container bg-white dark:bg-slate-900 w-3/5 p-4 border-2 border-indigo-700 mb-2 rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="absolute top-2 right-2 text-red-600" onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      <form onSubmit={handleSubmit}>
        <div>
          <label className="block font-bold text-gray-700">Room Name:</label>
          <input className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          type="text"value={roomName} onChange={(e) => setRoomName(e.target.value)} />
        </div>
        <div>
          <label className="block font-bold text-gray-700">Description:</label>
          <textarea className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="mb-4">
        <label htmlFor="program" className="block font-bold text-gray-700">
          Program
        </label>
        <Select
          id="program"
          name="program"
          value={selectedProgram}
          onChange={(selectedOption) => setSelectedProgram(selectedOption)}
          options={programOptions}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="competency" className="block font-bold text-gray-700">
          Competency
        </label>
        <Select
          id="competency"
          name="competency"
          value={selectedCompetency}
          onChange={(selectedOption) => setSelectedCompetency(selectedOption)}
          options={competencyOptions}
        />
      </div>
      <div className="mb-4 lg:w-72 md:w-36 sm:w-16">
        <label htmlFor="time" className="block font-bold text-gray-700">
          Select Time Duration
        </label>
            <Select
              options={countdownOptions}
              value={countdownOptions.find(option => option.value === selectedTime)}
              onChange={handleTimeChange}
              placeholder="Select a Timer"
            />
          </div>
        <div className='lg:w-72 md:w-36 sm:w-16'>
          <label className="block font-bold text-gray-700">Expiry Date:</label>
          <input className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
        </div>
        <div className="flex justify-end mt-3">
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none"
        >
          Create Room
        </button>
      </div>
      </form>
    </div>
    </div>
  );
};

export default CreateRoom;
