import React, { useRef, useEffect, useState } from "react";
import Select from 'react-select';

export default function Countdown(props) {
  const [num, setNum] = useState(0);
  const [selectedTime, setSelectedTime] = useState(0);
  const [countdownStarted, setCountdownStarted] = useState(false);
  const [startTime, setStartTime] = useState(null);

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
        // Call the handleStartExam function when the timer reaches 0
        props.handleStartExam();
      }
    }
    return () => clearInterval(intervalRef.current);
  }, [countdownStarted, selectedTime, num]);

  const handleStart = () => {
    if (selectedTime > 0) {
      setNum(selectedTime * 3600); // Convert selected time to seconds
      setCountdownStarted(true);
      const currentStartTime = new Date(); // Capture the start time
      setStartTime(currentStartTime); // Set the start time in your state
      // Call the handleStartExam function from props
      props.handleStartExam();
    }
  };

  const handleTimeChange = (selectedOption) => {
    setSelectedTime(selectedOption.value); // Use the selected option value
    setNum(selectedOption.value * 3600); // Update num when the time is changed
    setCountdownStarted(false); // Reset the countdown when the time is changed
  };

  const countdownOptions = [
    { value: 0, label: '0' },
    { value: 1, label: '1 hour' },
    { value: 2, label: '2 hours' },
    { value: 3, label: '3 hours' },
    { value: 4, label: '4 hours' },
    { value: 5, label: '5 hours' },
  ];

  return (
    <div>
      <div className="mb-4 lg:w-72">
        <Select
          options={countdownOptions}
          value={countdownOptions.find(option => option.value === selectedTime)} // Set the selected option based on value
          onChange={handleTimeChange}
          placeholder="Select Time" // Add a placeholder
        />
      </div>
      {selectedTime > 0 && (
        <div>
          {formatTime(num)}
          <button onClick={handleStart} disabled={selectedTime === 0 || countdownStarted}>
            Start
          </button>
        </div>
      )}
    </div>
  );
}
