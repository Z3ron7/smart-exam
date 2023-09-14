import React, { useRef, useEffect, useState } from "react";

export default function Result() {
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
    }
    return () => clearInterval(intervalRef.current);
  }, [countdownStarted, selectedTime, num]);

  const handleStart = () => {
    if (selectedTime > 0) {
      setNum(selectedTime * 3600); // Convert selected time to seconds
      setCountdownStarted(true);
    }
  };

  const handleTimeChange = (event) => {
    setSelectedTime(parseInt(event.target.value, 10));
    setNum(parseInt(event.target.value, 10) * 3600); // Update num when the time is changed
    setCountdownStarted(false); // Reset the countdown when the time is changed
  };

  return (
    <div>
      <div>
        <select value={selectedTime} onChange={handleTimeChange}>
          <option value={0}>Select Time</option>
          <option value={1}>1 Hour</option>
          <option value={2}>2 Hours</option>
          <option value={3}>3 Hours</option>
          <option value={4}>4 Hours</option>
          <option value={5}>5 Hours</option>
        </select>
        <button onClick={handleStart} disabled={selectedTime === 0 || countdownStarted}>
          Start
        </button>
      </div>
      {selectedTime > 0 && (
        <div>
          {formatTime(num)}
        </div>
      )}
    </div>
  );
}
