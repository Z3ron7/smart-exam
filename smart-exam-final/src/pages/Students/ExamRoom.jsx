import { useEffect, useState, useRef } from "react";
import Select from 'react-select';
import axios from "axios";
import ExamStart from './ExamStart'

function ExamRoom({selectedRoom}) {
  const [showExam, setShowExam] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedCompetency, setSelectedCompetency] = useState(null);
  const [roomName, setRoomName] = useState(null);
  const [date, setDate] = useState(null);
  const [description, SetDescription] = useState(null);
  const [userExamId, setUserExamId] = useState(null);
 
  useEffect(() => {
    if (selectedRoom) {
      // Map numeric program_id to the corresponding label
      const mappedProgram = programOptions.find(option => option.value === selectedRoom.program_id);
      // Map numeric competency_id to the corresponding label
      const mappedCompetency = competencyOptions.find(option => option.value === selectedRoom.competency_id);
  
      setSelectedProgram(mappedProgram);
      setSelectedCompetency(mappedCompetency);
      setSelectedTime(selectedRoom.duration_minutes);
    }
  }, [selectedRoom]);
// Define your Select options
const programOptions = [
  { value: 1, label: 'Social Work' },
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
const startExam = async () => {
    const currentStartTime = new Date();
  
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
  
      // Create a user_exam entry in the database
      const response = await axios.post('http://localhost:3001/exams/user-exams', {
        user_id,
        program: programValue,
        competency: competencyValue,
        duration_minutes: selectedTime * 60, // Convert selectedTime to minutes
        start_time: currentStartTime,
      });
  
      // Store the user_exam_id and other relevant data in your frontend state
      setUserExamId(response.data.user_exam_id);
      setCountdownStarted(true);
      setNum(selectedTime * 3600); // Set the countdown time in seconds
      setExamStartTime(currentStartTime);
      setShowExam(true);
    } catch (error) {
      console.error('Error starting exam:', error);
    }
  };
// Add your state variables for selected options
const [num, setNum] = useState(0);
const [selectedTime, setSelectedTime] = useState(1);
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
    <div>
      {!showExam ? (
        <div className="container min-h-screen h-auto items flex flex-col">
            <h1>{selectedRoom.room_name}</h1>
            <h2>{selectedRoom.description}</h2>
            <h2>{selectedRoom.expiry_date}</h2>
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
  
              <div className="mb-4 lg-w-72 md-w-36 sm-w-16">
                <Select
                  placeholder="Competency"
                  id="competency"
                  name="competency"
                  value={selectedCompetency}
                  onChange={(selectedOption) => setSelectedCompetency(selectedOption)}
                  options={competencyOptions}
                />
              </div>
  
              <div className="mb-4 lg-w-72 md-w-36 sm-w-16">
                <Select
                  options={countdownOptions}
                  value={countdownOptions.find(option => option.value === selectedTime)}
                  onChange={handleTimeChange}
                  placeholder="Select Time"
                />
              </div>
            </div>
            <div className="flex items-center">
              <button
                className="ml-3 text-lg transition ease-in-out rounded-lg p-2 px-5 delay-150 bg-indigo-700 hover-translate-y-1 duration-300 ..."
                onClick={startExam}
                disabled={!selectedProgram || !selectedCompetency || !selectedTime}
              >
                Start Exam
              </button>
            </div>
          </div>
        </div>
      ) : (
        <ExamStart
          selectedProgram={selectedProgram}
          selectedCompetency={selectedCompetency}
          selectedTime={selectedTime}
          examStartTime={examStartTime}
          countdownStarted={countdownStarted}
          setCountdownStarted={setCountdownStarted}
          formatTime={formatTime}
          userExamId={userExamId}
          num={num}
        />
      )}
    </div>
  );  
} 

export default ExamRoom;
