import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import classNames from "classnames";
import Select from 'react-select';

function Exam() {
  const [showResults, setShowResults] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [maxQuestions, setMaxQuestions] = useState(10);
  const [score, setScore] = useState(0);
  const [userExamId, setUserExamId] = useState(null);
  const [questionData, setQuestionData] = useState([]);
  const [selectedChoices, setSelectedChoices] = useState(Array(maxQuestions).fill(null)); // Adjust the number of questions
  const questionsPerPage = 2; // Adjust the number of questions per page
  const [selectedProgram, setSelectedProgram] = useState({ value: 'Social Work', label: 'Social Work' });
  const [selectedCompetency, setSelectedCompetency] = useState(null);
  const getExamData = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:3001/questions/fetch"); // Adjust the URL
      console.log("Response data:", response.data);
      setQuestionData(response.data);
      setMaxQuestions(response.data.length);
      setCurrentQuestion(0);
      setSelectedChoices(Array(response.data.length).fill(-1));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    getExamData();
  }, []);

  const [filteredQuestions, setFilteredQuestions] = useState([]);

  // Use a separate useEffect to refresh the data
  const refresh = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3001/questions/refresh');
      console.log('filter: ', response.data)
      setFilteredQuestions(response.data);
    } catch (error) {
      console.error('Error fetching data for refresh:', error);
    }
  }, []);
  
  useEffect(() => {
    refresh();
  }, [refresh]);  
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (selectedProgram) {
          let response;
  
          if (selectedCompetency?.value === 'All Competency') {
            // If "All Competency" is selected, fetch questions for all available competencies
            const competencies = ['SWPPS', 'Casework', 'HBSE']; // Replace with your predefined competencies
            const allQuestions = [];
  
            // Fetch questions for each competency and merge the results
            for (const competency of competencies) {
              const competencyResponse = await axios.get(
                `http://localhost:3001/questions/refresh?program=${selectedProgram.label || ''}&competency=${competency}`
              );
  
              // Check if questions already exist in allQuestions array
              for (const question of competencyResponse.data) {
                const existingQuestion = allQuestions.find((q) => q.question_id === question.question_id);
                if (!existingQuestion) {
                  allQuestions.push(question);
                }
              }
            }
  
            response = { data: allQuestions };
          } else if (selectedCompetency) {
            // Fetch questions for the selected competency
            response = await axios.get(
              `http://localhost:3001/questions/refresh?program=${selectedProgram.label || ''}&competency=${selectedCompetency.value || ''}`
            );
          } else {
            // If no competency is selected, use all questions
            await getExamData();
            return; // Exit early to avoid setting state again
          }
  
          setFilteredQuestions(response.data);
          setMaxQuestions(response.data.length);
          setCurrentQuestion(0);
          setSelectedChoices(Array(response.data.length).fill(-1));
          console.log('filter 2: ', response.data);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    fetchData();
  }, [selectedProgram, selectedCompetency]);
  

  const nextPage = () => {
    const nextQuestion = currentQuestion + questionsPerPage;
    setCurrentQuestion(nextQuestion);
  };

  const prevPage = () => {
    const prevQuestion = currentQuestion - questionsPerPage;
    setCurrentQuestion(prevQuestion);
  };

  const handleChoiceClick = (choiceIndex, choice) => {
    const updatedSelectedChoices = [...selectedChoices];
    updatedSelectedChoices[choiceIndex] = choice;
    setSelectedChoices(updatedSelectedChoices);
  };

  const calculateScore = () => {
    let score = 0;
    for (let i = 0; i < selectedChoices.length; i++) {
      const selectedChoice = selectedChoices[i];
      if (selectedChoice && selectedChoice.isCorrect) {
        score++;
      }
    }
    return score;
  };

  const resetGame = () => {
    setSelectedChoices(Array(maxQuestions).fill(null)); // Reset selected answers
    setScore(0); // Reset the score
    setCurrentQuestion(0);
    setShowResults(false);
    setCountdownStarted(false);
  };
// Define your Select options
const programOptions = [
  { value: 'Social Work', label: 'Social Work' },
  { value: 'Option', label: 'Option' },
];

const competencyOptions = [
  { value: 'All Competency', label: 'All Competency' },
  { value: 'SWPPS', label: 'SWPPS' },
  { value: 'Casework', label: 'Casework' },
  { value: 'HBSE', label: 'HBSE' },
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
  } catch (error) {
    console.error('Error starting exam:', error);
  }
};

const endExam = async () => {
  try {
    const user_exam_id = userExamId;
    const endTime = new Date();
    // Convert JavaScript Date to DATETIME string in 24-hour format
const formattedEndTime = `${endTime.getFullYear()}-${(endTime.getMonth() + 1).toString().padStart(2, '0')}-${endTime.getDate().toString().padStart(2, '0')} ${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}:${endTime.getSeconds().toString().padStart(2, '0')}`;

    const startTime = examStartTime;

    // Calculate the duration in milliseconds
    const durationMilliseconds = endTime - startTime;

    // Calculate the total duration in minutes (including the interval time)
    const total_duration_minutes_with_interval = (durationMilliseconds / 60000).toFixed(2);

    // Send the total duration in the "00h:00m:00s" format
    const formattedTotalDuration = `${String(Math.floor(total_duration_minutes_with_interval / 60)).padStart(2, '0')}h:${String(
      Math.floor(total_duration_minutes_with_interval % 60)
    ).padStart(2, '0')}m:${String(Math.floor((total_duration_minutes_with_interval % 1) * 60)).padStart(2, '0')}s`;

    const response = await axios.post('http://localhost:3001/exams/end-exam', {
      exam_id: user_exam_id, // Replace with the actual exam ID
      score: calculateScore(), // Replace with your score calculation logic
      total_duration_minutes: formattedTotalDuration, // Send the total duration in the "00h:00m:00s" format
      endTime: formattedEndTime,
    });

    if (response.status === 200) {
      // The exam has ended successfully, and you can handle any further actions here.
      console.log('Exam ended successfully');
    }
  } catch (error) {
    console.error('Error ending exam:', error);
  }
};


const handleFinishExam = () => {
  setShowResults(true);
  setCountdownStarted(false);
  endExam(); // Call the endExam function when the Finish button is clicked
};

  const isLastPage = currentQuestion + questionsPerPage >= maxQuestions;
  const isFirstPage = currentQuestion === 0;
  const totalPages = Math.ceil(maxQuestions / questionsPerPage);

  const renderResult = () => {
    if (!filteredQuestions || filteredQuestions.length === 0) {
      // Handle the case when filteredQuestions is empty or not yet loaded
      return (
        <div className="text-center">
          Loading questions...
        </div>
      );
    }

    const filteredResults = filteredQuestions.filter((question, index) => {
    if (!selectedProgram && !selectedCompetency) {
      // No filtering, return all questions
      return true;
    }
    if (selectedProgram && selectedCompetency) {
      // Filter by both program and competency
      return (
        question.program_id === selectedProgram.value &&
        question.competency_id === selectedCompetency.value
      );
    }
    if (selectedProgram) {
      // Filter by program only
      return question.program_id === selectedProgram.value;
    }
    if (selectedCompetency) {
      // Filter by competency only
      return question.competency_id === selectedCompetency.value;
    }
    return true;
  });
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Final Results</h1>
        <h2 className="flex mb-4 mx-auto justify-center">
          Score: {calculateScore(filteredResults)} out of {maxQuestions} correct - ({((calculateScore() / maxQuestions) * 100).toFixed(2)}%)
        </h2>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          onClick={resetGame}
        >
          Restart Game
        </button>
        {filteredQuestions.map((question, index) => (
          <div key={index} className="mb-4">
            <h2 className="text-xl text-center dark:text-white btn-primary">Question {index + 1}/{maxQuestions}</h2>
            <p className="mb-2">{question.questionText}</p>
            <ul>
            {question.choices && question.choices.map((choice, choiceIndex) => (
                <li
                  key={choiceIndex}
                  className={classNames("container btn-container items-center flex border border-gray-700 mb-2 rounded-3xl cursor-pointer", {
                    "bg-green-400": choice.isCorrect && selectedChoices[index] === choice,
                    "bg-red-600": !choice.isCorrect && selectedChoices[index] === choice,
                  })}
                >
                  <div className="dark:text-white py-2 px-4 bg-gray-700 text-white font-bold text-lg rounded-3xl m-1 shadow-md btn-primary">
                  {String.fromCharCode(65 + choiceIndex)}
                </div>
                <div className="dark:text-white py-2 px-4 text-gray-700 font-semibold">
                  {choice.choiceText}
                </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
        
      </div>
    );
  };

  return (
    <div className="container min-h-screen h-auto items flex flex-col">
      <div className="flex flex-col lg:flex-row text-center py-4 header-bg shadow-md text-lg font-semibold dark:text-white ">
          <div className="flex flex-col lg:flex-row md:col-4 sm:col-2 gap-5 justify-center items-center mx-auto dark:text-white">
            <div className="mb-4 lg:w-72 md:w-36 sm:w-16 dark:bg-slate-600">
              <Select
                placeholder="Program"
                id="program"
                name="program"
                value={selectedProgram}
                onChange={(selectedOption) => setSelectedProgram(selectedOption)}
                options={programOptions}
              />
            </div>

            <div className="mb-4 lg:w-72 md:w-36 sm:w-16">
              <Select
                placeholder="Competency"
                id="competency"
                name="competency"
                value={selectedCompetency}
                onChange={(selectedOption) => setSelectedCompetency(selectedOption)}
                options={competencyOptions}
              />
            </div>

            <div className="mb-4 lg:w-72 md:w-36 sm:w-16">
              <Select
                options={countdownOptions}
                value={countdownOptions.find(option => option.value === selectedTime)}
                onChange={handleTimeChange}
                placeholder="Select Time"
              />
            </div>

            {selectedTime > 0 && (
            <div>
                {formatTime(num)}
                {!countdownStarted ? (
                <button
                className="ml-3 text-lg transition ease-in-out rounded-lg p-2 px-5 delay-150 bg-indigo-700 hover:-translate-y-1 duration-300 ..."
                onClick={startExam}
                disabled={!selectedProgram || !selectedCompetency || !selectedTime}
              >
                Start
              </button>
              
                ) : (
                <button className="text-red-700" disabled>Counting Down</button>
                )}
            </div>
            )}
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-4 mx-auto justify-center dark:text-gray-500">Pre-board Exam</h1>

        {!showResults && (
          <div>
            {filteredQuestions.slice(currentQuestion, currentQuestion + questionsPerPage).map((question, index) => (
              <div key={index} className="border-2 dark:border-gray-700 dark:rounded-lg dark:bg-slate-900 shadow-lg items-center justify-center my-2 mb-4">
                <h2 className="text-xl text-center dark:text-white btn-primary">Question {currentQuestion + index + 1}/{maxQuestions}</h2>
                <p className="p-3 dark:text-white text-2xl text-center">{question.questionText}</p>
                <ul className="p-3">
                {question.choices && question.choices.map((choice, choiceIndex) => (
                    <li
                      key={choiceIndex}
                      onClick={() => handleChoiceClick(currentQuestion + index, choice)}
                      className={classNames(
                        "container btn-container items-center flex border border-gray-700 mb-2 rounded-3xl cursor-pointer",
                        {
                          "bg-indigo-700": selectedChoices[currentQuestion + index] === choice,
                        }
                      )}
                      disabled={!countdownStarted}
                    >
                      <div className="dark:text-white py-2 px-4 bg-gray-700 text-white font-bold text-lg rounded-3xl m-1 shadow-md btn-primary">
                  {String.fromCharCode(65 + choiceIndex)}
                </div>
                <div className="dark:text-white py-2 px-4 text-gray-700 font-semibold">
                  {choice.choiceText}
                </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

<div className="container text-center header-bg p-2 text-gray-800 mt-auto">
          <div className="flex justify-center mx-auto dark:text-white">
          <button
            onClick={handleFinishExam}
              className="relative ml-3 text-lg transition ease-out rounded-lg p-2 px-5 bg-indigo-700 duration-300"
            >
              End Exam

            </button>
          </div>
            <h2 className="text-2xl pb-1 border-b text-gray-900 dark:text-white border-gray-500">
              Questions remaining: 
            </h2>
          </div>
          <div className="container flex justify-center p-4 header-bg dark:text-white">
          <ul className="list-style-none flex">
              <li>
              {!isFirstPage && (
                  <button
                    className="relative block rounded bg-primary-100 px-3 py-1.5 text-sm font-medium text-primary-700 transition-all duration-300"
                    onClick={prevPage}
                  >
                    Previous
                  </button>
                )}
              </li>
              {Array.from({ length: totalPages }, (v, i) => (
                <li key={i}>
                  <button
                    className={`relative block rounded bg-transparent px-3 py-1.5 text-sm ${
                      i + 1 === questionsPerPage
                        ? "font-medium text-primary-700 bg-primary-100"
                        : "text-neutral-600"
                    } transition-all duration-300`}
                    onClick={() => questionsPerPage(i + 1)}
                  >
                    {i + 1}
                    {i + 1 === questionsPerPage && (
                      <span className="absolute -m-px h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)]">
                        (current)
                      </span>
                    )}
                  </button>
                </li>
              ))}
              <li>
              {currentQuestion + questionsPerPage < maxQuestions && (
                  <button
                    className="relative block rounded bg-primary-100 dark:text-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-all duration-300"
                    onClick={nextPage}
                  >
                    Next
                  </button>
                )}
              </li>
            </ul>
          </div>
          </div>
        )}

        {showResults && renderResult()}
    </div>
  );
} 

export default Exam;
