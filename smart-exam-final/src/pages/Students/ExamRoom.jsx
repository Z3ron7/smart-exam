import { useEffect, useState, useRef } from "react";
import Select from 'react-select';
import axios from "axios";
import ExamStart from './ExamStart'
import {FaPlay} from 'react-icons/fa'
import { Spinner } from "@material-tailwind/react";
import { useParams } from 'react-router-dom';

function ExamRoom() {
  const [showExam, setShowExam] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedCompetency, setSelectedCompetency] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [userExamId, setUserExamId] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const { room_id } = useParams();
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    // Make an API request to your backend to fetch room data
    axios.get(`http://localhost:3001/room/rooms/${room_id}`)
      .then((response) => {
console.log("Rdata:", response.data.room)

        setSelectedRoom(response.data.room); // Assuming your API returns room data as 'room'
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching room data:', error);
        setLoading(false);
      });
  }, [room_id]);

  useEffect(() => {
    if (selectedRoom) {
      const mappedProgram = programIdToValue[selectedRoom.program_id];
      const mappedCompetencyValue = competencyIdToValue[selectedRoom.competency_id];
  
      setSelectedProgram({ value: mappedProgram, label: mappedProgram });
      setSelectedCompetency({ value: mappedCompetencyValue, label: mappedCompetencyValue });
      setSelectedTime(selectedRoom.duration_minutes);
      setRoomId(selectedRoom.room_id);
    }
  }, [selectedRoom]);
  
  const programIdToValue = {
    1: 'Social Work'
  };
  const competencyIdToValue = {
    1: 'SWPPS',
    2: 'Casework',
    3: 'HBSE',
    4: 'CO',
    5: 'Groupwork',
    6: 'All Competency',
  };
  
// Define your Select options
const programOptions = [
  { value: 1, label: 'Social Work' },
];

const competencyOptions = [
  { value: 6, label: 'All Competency' },
  { value: 1, label: 'SWPPS' },
  { value: 2, label: 'Casework' },
  { value: 3, label: 'HBSE' },
  { value: 4, label: 'CO' },
  { value: 5, label: 'Groupwork' },
];
const countdownOptions = [
  { value: 0, label: '0' },
  { value: 0.5, label: '30 minutes' },
  { value: 1, label: '1 hour' },
  { value: 2, label: '2 hours' },
  { value: 3, label: '3 hours' },
  { value: 4, label: '4 hours' },
  { value: 5, label: '5 hours' },
];
const programValueToId = {
  'Social Work': 1,
  // Add other program options here
};
const competencyValueToId = {
  'SWPPS' : 1,
  'Casework' : 2,
  'HBSE': 3,
  'CO': 4,
  'Groupwork': 5,
  'All Competency': 6,
};
const startExam = async () => {
    const currentStartTime = new Date();
    setLoading(true);
    try {
      // Validate selectedProgram and selectedCompetency
      const programValue = selectedProgram ? selectedProgram.value : null;
      const competencyValue = selectedCompetency ? selectedCompetency.value : null;
  
      if (programValue === null || competencyValue === null) {
        // Handle the case where program or competency is not selected
        console.error('Program or competency is not selected.');
        // You can display an error message to the user or handle it as needed.
        return;
      }
  
      // Get the user_id from localStorage
      const user_id = localStorage.getItem('user_id');
      const programId = programValueToId[programValue];
      const competencyId = competencyValueToId[competencyValue];

      // Check if the user has already taken an exam for the given room
    const checkExamResponse = await axios.get(`http://localhost:3001/exam-room/check-user-exam/${user_id}/${roomId}`);
    
    if (checkExamResponse.data.hasTakenExam) {
      // Display an alert or message to the user
      alert('You have already taken this exam.');
      setLoading(false);
      return;
    }
    
      // Create a user_exam entry in the database
      const response = await axios.post('http://localhost:3001/exam-room/exam-room', {
        user_id,
        room_id: roomId,
        program_id: programId,
        competency_id: competencyId,
        duration_minutes: selectedTime * 60, // Convert selectedTime to minutes
        start_time: currentStartTime,
      });
      console.log('ss', programValue)
      // Store the user_exam_id and other relevant data in your frontend state
      setUserExamId(response.data.user_exam_id);
      setCountdownStarted(true);
      setNum(selectedTime * 3600); // Set the countdown time in seconds
      setExamStartTime(currentStartTime);
      setShowExam(true);
      setTimeout(() => {
        // Reset the loading state to false after 2 seconds
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Error starting exam:', error);
      setLoading(false);
    }
  };
// Add your state variables for selected options
const [num, setNum] = useState(0);
const [selectedTime, setSelectedTime] = useState(0);
const [countdownStarted, setCountdownStarted] = useState(false);
const [examStartTime, setExamStartTime] = useState(null);

let intervalRef = useRef();

const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${String(hours).padStart(2, '0')}h:${String(minutes).padStart(2, '0')}m:${String(remainingSeconds).padStart(2, '0')}s`;
};

const decreaseNum = () => setNum((prev) => prev - 1);

useEffect(() => {
  if (countdownStarted && selectedTime > 0 && num > 0) {
    intervalRef.current = setInterval(decreaseNum, 1000);
  } else {
    clearInterval(intervalRef.current);
    if (countdownStarted && num === 0) {
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
    <div>
      {!showExam ? (
        <div className="container min-h-screen h-auto items flex flex-col">
        {selectedRoom ? (
  <>
    <div className="flex flex-row items-center dark:text-white">
      <p className="mr-2 font-bold">Room:</p>
      <h1 className="mr-2">{selectedRoom.room_name}</h1>
      <p className="mr-2">This is room</p>
    </div>

    <div className="flex flex-row dark:text-white">
      <p className="mr-2 font-bold">Description:</p>
      <h2 className="mr-2">{selectedRoom.description}</h2>
    </div>

    <div className="flex flex-row items-center dark:text-white">
      <p className="mr-2 font-bold">Expiry Date:</p>
      <h2 className="mr-2">{selectedRoom.expiry_date}</h2>
    </div>
  </>
) : (
  <p>Loading...</p>
)}

          <div className="flex flex-col lg-flex-row text-center dark-bg-slate-900 py-4 header-bg shadow-md text-lg font-semibold dark-text-white">
            <div className="flex flex-col gap-5 justify-center mx-3 items-center dark-text-white">
              <div className="mb-4 w-72 dark-bg-slate-600">
                <Select
                  placeholder="Program"
                  id="program"
                  name="program"
                  value={selectedProgram}
                  onChange={(selectedOption) => setSelectedProgram(selectedOption)}
                  options={programOptions}
                />
              </div>
  
              <div className="mb-4 w-72">
                <Select
                  placeholder="Competency"
                  id="competency"
                  name="competency"
                  value={selectedCompetency}
                  onChange={(selectedOption) => setSelectedCompetency(selectedOption)}
                  options={competencyOptions}
                />
              </div>
  
              <div className="mb-4 w-72">
                <Select
                  options={countdownOptions}
                  value={countdownOptions.find(option => option.value === selectedTime)}
                  onChange={handleTimeChange}
                  placeholder="Select Time"
                />
              </div>
            </div>
            <div className="flex items-center justify-center">
  <button
    type="button"
    className={`flex text-lg text-white transition ease-in-out items-center justify-center font-medium rounded-lg p-2 px-5 ${
      isLoading ? 'bg-indigo-500 font-semibold cursor-not-allowed' : 'bg-indigo-700 hover-translate-y-1'
    } duration-300`}
    onClick={startExam}
    disabled={isLoading || !selectedProgram || !selectedCompetency || !selectedTime}
  >
    {isLoading ? <Spinner className="flex justify-center mr-2 font-medium"/> : <FaPlay className="mr-2 flex items-center justify-center font-medium" />}
    {isLoading ? 'Processing...' : 'Start Exam'}
  </button>
</div>

          </div>
        </div>
        ) : (
        <ExamStart
          selectedProgram={selectedProgram}
          setSelectedProgram={setSelectedProgram}
          selectedCompetency={selectedCompetency}
          setSelectedCompetency={setSelectedCompetency}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          examStartTime={examStartTime}
          countdownStarted={countdownStarted}
          setCountdownStarted={setCountdownStarted}
          formatTime={formatTime}
          userExamId={userExamId}
          setUserExamId={setUserExamId}
          num={num}
          setNum={setNum}
          handleTimeChange={handleTimeChange}
          selectedRoom={selectedRoom}
        />
        )}
    </div>
  );  
} 

export default ExamRoom;
