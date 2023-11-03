import { useEffect, useState, useRef } from "react";
import Select from 'react-select';
import axios from "axios";
import { useParams } from 'react-router-dom';

function ViewRoom() {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedCompetency, setSelectedCompetency] = useState(null);
  const [roomId, setRoomId] = useState(null);
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

// Add your state variables for selected options
const [num, setNum] = useState(0);
const [selectedTime, setSelectedTime] = useState(0);
const [countdownStarted, setCountdownStarted] = useState(false);

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
          </div>
        </div>
        
    </div>
  );  
} 

export default ViewRoom;
