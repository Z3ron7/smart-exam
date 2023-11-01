import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import classNames from "classnames";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import Select from 'react-select';
import ExamResult from './ExamResult'

function Exam() {
  const [showResults, setShowResults] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [maxQuestions, setMaxQuestions] = useState(null);
  const [score, setScore] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState(Array(maxQuestions).fill(null)); // Adjust the number of questions
  const questionsPerPage = 3; // Adjust the number of questions per page
  const [selectedProgram, setSelectedProgram] = useState({ value: 'Social Work', label: 'Social Work' });
  const [selectedCompetency, setSelectedCompetency] = useState({ value: 'All Competency', label: 'All Competency' });
  const [competencyScores, setCompetencyScores] = useState({});
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [userExamId, setUserExamId] = useState(null);

  function shuffleArray(array) {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  }

  function shuffleArrayWithCorrectChoice(questions) {
    const shuffledQuestions = [...questions];
  
    for (let i = 0; i < shuffledQuestions.length; i++) {
      if (shuffledQuestions[i].choices) {
        const correctChoices = shuffledQuestions[i].choices.filter((choice) => choice.isCorrect);
        const incorrectChoices = shuffledQuestions[i].choices.filter((choice) => !choice.isCorrect);
  
        if (correctChoices.length > 0 && incorrectChoices.length > 2) {
          // Shuffle the choices, ensuring one correct and three incorrect choices
          const shuffledCorrectChoice = shuffleArray(correctChoices);
          const shuffledIncorrectChoices = shuffleArray(incorrectChoices.slice(0, 3));
          shuffledQuestions[i].choices = [...shuffledCorrectChoice, ...shuffledIncorrectChoices];
        }
      }
    }
  
    return shuffledQuestions;
  }  

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (selectedProgram) {
          let response;
          const maxQuestionsPerCategory = 100; // Set the maximum questions per category
          let maxQuestions = 0; // Initialize maxQuestions to zero

          if (selectedCompetency?.value === 'All Competency') {
            // Check if competency data is already saved in local storage
            const competencyDataAll = localStorage.getItem('competencyData_All');
            if (competencyDataAll) {
              const parsedData = JSON.parse(competencyDataAll);
              response = { data: parsedData };
              // Set maxQuestions to the number of questions available for all competencies
              maxQuestions = parsedData.length;
            } else {
              // Fetch questions for all available competencies
              const competencies = ['SWPPS', 'Casework', 'HBSE', 'CO', 'Groupwork']; // Replace with your predefined competencies
              const allQuestions = [];
  
              // Fetch questions for each competency and merge the results
              for (const competency of competencies) {
                const competencyResponse = await axios.get(
                  `http://localhost:3001/questions/refresh?program=${selectedProgram.label || ''}&competency=${competency}`
                );
  
                // Limit to maxQuestionsPerCategory questions per category
                const limitedQuestions = shuffleArray(competencyResponse.data).slice(0, maxQuestionsPerCategory);
                maxQuestions += limitedQuestions.length; // Increment the total questions count
  
                // Check if maxQuestions exceeds 500, and if so, truncate the questions.
                if (maxQuestions > 500) {
                  const overflow = maxQuestions - 500;
                  limitedQuestions.splice(-overflow);
                  maxQuestions = 500;
                }
  
                allQuestions.push(...limitedQuestions);
  
                // If maxQuestions is already 500, break the loop.
                if (maxQuestions >= 500) {
                  break;
                }
              }
  
              response = { data: allQuestions };
              localStorage.setItem('selectedCompetencyId', 'All');
              localStorage.setItem('competencyData_All', JSON.stringify(allQuestions));
            }
          } else if (selectedCompetency) {
            // Check if competency data is already saved in local storage
            const competencyData = localStorage.getItem(`competencyData_${selectedCompetency.value}`);
            if (competencyData) {
              const parsedData = JSON.parse(competencyData);
              response = { data: parsedData };
              // Set maxQuestions to the number of questions available for the selected competency
              maxQuestions = parsedData.length;
            } else {
              // Fetch questions for the selected competency
              response = await axios.get(
                `http://localhost:3001/questions/refresh?program=${selectedProgram.label || ''}&competency=${selectedCompetency.value || ''}`
              );
  
              // Limit to maxQuestionsPerCategory questions for the selected category
              response.data = shuffleArray(response.data).slice(0, maxQuestionsPerCategory);
              maxQuestions = response.data.length; // Set the total questions count
  
              // Truncate if maxQuestions exceeds 500
              if (maxQuestions > 500) {
                response.data.splice(-maxQuestions + 500);
                maxQuestions = 500;
              }
  
              // Save the competency data to local storage
              localStorage.setItem(`competencyData_${selectedCompetency.value}`, JSON.stringify(response.data));
            }
            localStorage.setItem('selectedCompetencyId', selectedCompetency.value);
          } else {
            // If no competency is selected, use all questions
            return; // Exit early to avoid setting state again
          }

          // Load selectedChoices from local storage
        const storedSelectedChoices = localStorage.getItem('selectedChoices');
        if (storedSelectedChoices) {
          setSelectedChoices(JSON.parse(storedSelectedChoices));
        } else {
          // If selectedChoices aren't in local storage, initialize it
          setSelectedChoices(Array(maxQuestions).fill(-1));
        }

        const storedCurrentQuestion = localStorage.getItem('currentQuestion');
        if (storedCurrentQuestion) {
          currentQuestion = parseInt(storedCurrentQuestion, 10);
          setCurrentQuestion(currentQuestion);
        } else {
          setCurrentQuestion(0);
        }
  
          const randomizedQuestions = shuffleArray(response.data).slice(0, 500);
          // Process choices
          const processedQuestions = shuffleArrayWithCorrectChoice(randomizedQuestions);
  
          setFilteredQuestions(processedQuestions);
          setMaxQuestions(maxQuestions); // Set the total questions count
          console.log('filteredQuestions:', response.data);
          console.log('selectedCompetencyId', selectedCompetency.value);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    fetchData();
  }, [selectedProgram, selectedCompetency]);

// Function to update scores for each competency
const updateCompetencyScore = (competencyId, score) => {
  setCompetencyScores((prevScores) => ({
    ...prevScores,
    [competencyId]: score,
  }));
};
// Save exam state to localStorage
const saveExamStateToLocalStorage = () => {
  const examState = {
    currentQuestion: currentQuestion,
    score,
    userExamId,
    selectedProgram,
    selectedCompetency,
    maxQuestions: maxQuestions,
    filteredQuestions: filteredQuestions.map(question => ({ ...question })), // Convert to plain objects
  };
  localStorage.setItem('examState', JSON.stringify(examState));
};

// Load exam state from localStorage
useEffect(() => {
  const savedExamState = localStorage.getItem('examState');
  if (savedExamState) {
    const parsedState = JSON.parse(savedExamState);
    setCurrentQuestion(parsedState.currentQuestion); // Set the current question using the index
    setScore(parsedState.score);
    setSelectedCompetency(parsedState.selectedCompetency);
    setUserExamId(parsedState.userExamId);
    setSelectedProgram(parsedState.selectedProgram);
    setMaxQuestions(parsedState.maxQuestions);
    setFilteredQuestions(parsedState.filteredQuestions); // Convert plain objects back to the original format
  }
}, []);

const handleChoiceClick = (choiceIndex, choice, competencyId) => {
  const updatedSelectedChoices = [...selectedChoices];
  updatedSelectedChoices[choiceIndex] = choice;
  setSelectedChoices(updatedSelectedChoices);

  // Calculate the score for the current competency
  const competencyScore = calculateScore(updatedSelectedChoices, competencyId);
  updateCompetencyScore(competencyId, competencyScore);
  localStorage.setItem('selectedChoices', JSON.stringify(updatedSelectedChoices));
  saveExamStateToLocalStorage()

};

  // Function to calculate the total score for selected questions
  const calculateScore = () => {
    const scoresByCompetency = {}; // Create an object to store scores by competency ID
  
    filteredQuestions.forEach((question, index) => {
      const selectedChoice = selectedChoices[index];
  
      if (selectedChoice && selectedChoice.isCorrect) {
        // Check if the competency ID exists in the question
        if (question.competency_id) {
          const competencyId = question.competency_id;
  
          if (!scoresByCompetency[competencyId]) {
            scoresByCompetency[competencyId] = 0;
          }
  
          scoresByCompetency[competencyId]++;
        }
      }
    });
  
    // Log the scores for each competency
    console.log('Scores by Competency ID:', scoresByCompetency);
  
    return JSON.stringify(scoresByCompetency); // Convert the object to a JSON string
  };
  

  const resetGame = () => {
    setSelectedChoices(Array(maxQuestions).fill(-1)); // Reset selected answers
    setScore(0); // Reset the score
    setCurrentQuestion(0);
    setShowResults(false);
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
  { value: 'CO', label: 'CO' },
  { value: 'Groupwork', label: 'Groupwork' },
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
    saveTimerStateToLocalStorage();
  } else {
    clearInterval(intervalRef.current);
    if (countdownStarted && num === 0) {
      handleFinishExam(); // Trigger handleFinishExam when the timer reaches 0 and the exam has started
    }
  }
  return () => clearInterval(intervalRef.current);
}, [countdownStarted, selectedTime, num]);


const handleTimeChange = (selectedOption) => {
  setSelectedTime(selectedOption.value);
  setNum(selectedOption.value * 3600);
  setCountdownStarted(false);
};

const saveTimerStateToLocalStorage = () => {
  const timerState = {
    num,
    selectedTime,
    countdownStarted,
  };
  localStorage.setItem('timerState', JSON.stringify(timerState));
};

// Load timer state from localStorage when the component mounts
useEffect(() => {
  const savedTimerState = localStorage.getItem('timerState');
  if (savedTimerState) {
    const parsedTimerState = JSON.parse(savedTimerState);
    setNum(parsedTimerState.num);
    setSelectedTime(parsedTimerState.selectedTime);
    setCountdownStarted(parsedTimerState.countdownStarted);
  }
}, []);
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
    saveTimerStateToLocalStorage();
    setNum(selectedTime * 3600); // Set the countdown time in seconds
    setExamStartTime(currentStartTime);
    localStorage.removeItem('examState');
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
    localStorage.removeItem('examState');
    localStorage.removeItem('timerState');
    localStorage.removeItem('selectedChoices');
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
  saveTimerStateToLocalStorage();
};

const nextPage = () => {
  const nextPage = Math.min(currentPage + 1, totalPages); // Ensure we don't go beyond the last page
  const nextQuestion = (nextPage - 1) * questionsPerPage;
  setCurrentQuestion(nextQuestion);
  saveExamStateToLocalStorage()
};

const prevPage = () => {
  const prevPage = Math.max(currentPage - 1, 1); // Ensure we don't go before the first page
  const prevQuestion = (prevPage - 1) * questionsPerPage;
  setCurrentQuestion(prevQuestion);
};

const handlePageClick = (page) => {
const newPage = Math.max(1, Math.min(page, totalPages)); // Ensure the selected page is within valid bounds
const newQuestion = (newPage - 1) * questionsPerPage;
setCurrentQuestion(newQuestion);
};

const totalPages = Math.ceil(maxQuestions / questionsPerPage);
  const currentPage = Math.floor(currentQuestion / questionsPerPage) + 1;
  const displayPages = 4;
  const pages = [];
  for (let i = Math.max(1, currentPage - Math.floor(displayPages / 2)); i <= Math.min(totalPages, currentPage + Math.floor(displayPages / 2)); i++) {
    pages.push(i);
  }
  return (
    <div className="container min-h-screen h-auto items flex flex-col">
      <div className="text-center border-2 dark:border-gray-700 border-indigo-700 rounded-lg dark:rounded-lg dark:bg-slate-900 py-4 header-bg shadow-md text-lg font-semibold dark:text-white">
        <div className="flex flex-row gap-5 justify-center mx-3 items-center dark:text-white">
          <div className="mb-4 lg:w-72 dark:bg-slate-600">
        {!showResults && ( 
            <Select
              placeholder="Program"
              id="program"
              name="program"
              value={selectedProgram}
              onChange={(selectedOption) => setSelectedProgram(selectedOption)}
              options={programOptions}
              isDisabled={countdownStarted}
            />
        )}
          </div>

          <div className="mb-4 lg:w-72">
        {!showResults && ( 
            <Select
              placeholder="Competency"
              id="competency"
              name="competency"
              value={selectedCompetency}
              onChange={(selectedOption) => setSelectedCompetency(selectedOption)}
              options={competencyOptions}
              isDisabled={countdownStarted}
            />
        )}
          </div>

          <div className="mb-4 lg:w-72">
        {!showResults && ( 
            <Select
              options={countdownOptions}
              value={countdownOptions.find(option => option.value === selectedTime)}
              onChange={handleTimeChange}
              placeholder="Select Time"
              isDisabled={countdownStarted}
            />
        )}
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center w-full sticky top-0 left-0 bg-white dark:bg-transparent text-center">
      {selectedTime > 0 && (
            <div className="flex items-center dark:text-white dark:bg-slate-900 p-2 border-x-2 border-b-2 rounded-b-lg dark:border-gray-700 border-indigo-700">
              <div className='text-blue-600 text-lg'>{formatTime(num)}</div>
              {!countdownStarted ? (
        !showResults && ( 
          <button
            className="ml-3 text-lg h-8 transition flex justify-center items-center ease-in-out rounded-lg px-5 delay-150 bg-indigo-700 hover:-translate-y-2 duration-300 ..."
            onClick={startExam}
            disabled={!selectedProgram || !selectedCompetency || !selectedTime}
          >
            <span className='text-white font-normal'>Start</span>
          </button>
        )
              ) : (
                <button className="text-red-700 text-base ml-2" disabled>
                  Counting Down
                </button>
              )}
            </div>
          )}
      </div>
        {!showResults && (
          <div>
            {filteredQuestions.slice(currentQuestion, currentQuestion + questionsPerPage).map((question, index) => (
              <div key={index} className="border-2 dark:border-gray-700 border-indigo-700 rounded-lg dark:rounded-lg dark:bg-slate-900 shadow-lg items-center justify-center my-2 mb-4">
                <h2 className="text-xl text-center dark:text-white btn-primary">Question {currentQuestion + index + 1}/{maxQuestions}</h2>
                <p className="p-3 dark:text-white text-2xl text-center">{question.questionText}</p>
                <ul className="p-3">
                {question.choices && question.choices.map((choice, choiceIndex) => (
                    <div
                      key={choiceIndex}
                      onClick={() => {
                        if (countdownStarted) {
                        console.log('selectedChoices before update:', selectedChoices);
                        handleChoiceClick(currentQuestion + index, choice);
                        console.log('selectedChoices after update:', selectedChoices);
                        }
                      }}
                      className={
                        `container dark:text-white text-gray-700 btn-container items-center flex border border-gray-700 mb-2 rounded-3xl cursor-pointer 
                         ${selectedChoices[currentQuestion + index] === choice ? 'bg-indigo-500 text-white' : ''}`
                      }
                      disabled={!countdownStarted}
                    >
                      <div className="dark:text-white py-2 px-4 bg-gray-700 text-white font-bold text-lg rounded-3xl m-1 shadow-md btn-primary">
                  {String.fromCharCode(65 + choiceIndex)}
                </div>
                <div className=" py-2 px-4 font-semibold">
                  {choice.choiceText}
                </div>
                    </div>
                  ))}
                </ul>
              </div>
            ))}
            <div className="flex justify-center p-4">
            <div className="container w-full flex justify-end items-end">
            <button
    className="relative rounded justify-center items-center h-10 mr-2 bg-indigo-700 px-3 py-1.5 text-md font-medium text-white flex ease-in-out transition delay-150 hover:-translate-y-2 duration-300 ..."
              onClick={() => {
                if (countdownStarted) {
                  const confirmSubmit = window.confirm("Are you sure you want to continue?");
                  if (confirmSubmit) {
                    // The user confirmed, you can proceed with the action
                    handleFinishExam();
                  }
                }
              }}
              disabled={!countdownStarted}
            >
              Submit
            </button>
            </div>
          <div className="container flex justify-end header-bg dark:text-white">
          <ul className="list-style-none flex">
          <li>
        {currentPage > 1 && (
          <button
          className="relative rounded h-10 mr-2 bg-indigo-700 px-3 py-1.5 text-sm font-medium text-white transition-all duration-300 flex items-center"
          onClick={prevPage}
        >
          <ArrowLeftIcon strokeWidth={2} className="h-4 w-4 mr-2" />
          Previous
        </button>
        
        )}
      </li>
      {pages.map((page) => (
        <li key={page}>
          <button
            className={`${
              currentPage === page
                ? "bg-indigo-700 text-white "
                : "hover:bg-indigo-600 hover:text-white dark:text-white text-black"
            } py-2 px-4 rounded gap-1`}
            onClick={() => handlePageClick(page)}
          >
            {page}
          </button>
        </li>
      ))}
      <li>
        {currentPage < totalPages && (
          <button
            className="relative rounded bg-indigo-700 hover:bg-indigo-600 text-white ml-2 py-2 px-4 flex items-center"
            onClick={nextPage}
          >
            Next
            <ArrowRightIcon strokeWidth={2} className="h-4 w-4 ml-2" />
          </button>
        )}
      </li>
            </ul>
          </div>
          </div>
        </div>
        )}
        {showResults && <ExamResult 
        filteredQuestions={filteredQuestions} 
        selectedChoices={selectedChoices} 
        resetGame={resetGame} 
        selectedCompetency={selectedCompetency} />}
    </div>
  );
} 

export default Exam;
