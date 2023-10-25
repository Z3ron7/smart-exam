import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import classNames from "classnames";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import Select from 'react-select';
import ExamResult from './ExamResult'

function ExamStart({selectedProgram, selectedCompetency, selectedTime, examStartTime, countdownStarted, setCountdownStarted, formatTime, num, userExamId}) {
  const [showResults, setShowResults] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [maxQuestions, setMaxQuestions] = useState(10);
  const [score, setScore] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState(Array(maxQuestions).fill(null)); // Adjust the number of questions
  const questionsPerPage = 3; // Adjust the number of questions per page
  const [competencyScores, setCompetencyScores] = useState({});
  const [filteredQuestions, setFilteredQuestions] = useState([]);

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

  const getExamData = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3001/questions/fetch');
      setFilteredQuestions(response.data); // Limit to 10 randomized questions
    } catch (error) {
      console.error('Error fetching data for refresh:', error);
    }
  }, []);
  
  useEffect(() => {
    getExamData();
  }, [getExamData]);  

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (selectedProgram) {
          let response;
          const maxQuestionsPerCategory = 100; // Set the maximum questions per category
          let maxQuestions = 0; // Initialize maxQuestions to zero
  
          if (selectedCompetency?.value === 'All Competency') {
            // Fetch questions for all available competencies
            const competencies = ['SWPPS', 'Casework', 'HBSE']; // Replace with your predefined competencies
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
          } else if (selectedCompetency) {
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
  
            localStorage.setItem('selectedCompetencyId', selectedCompetency.value);
          } else {
            // If no competency is selected, use all questions
            await getExamData();
            return; // Exit early to avoid setting state again
          }
  
          const randomizedQuestions = shuffleArray(response.data).slice(0, 500);
          // Process choices
          const processedQuestions = shuffleArrayWithCorrectChoice(randomizedQuestions);
  
          setFilteredQuestions(processedQuestions);
          setMaxQuestions(maxQuestions); // Set the total questions count
          setCurrentQuestion(0);
          setSelectedChoices(Array(maxQuestions).fill(-1));
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

const handleChoiceClick = (choiceIndex, choice, competencyId) => {
  const updatedSelectedChoices = [...selectedChoices];
  updatedSelectedChoices[choiceIndex] = choice;
  setSelectedChoices(updatedSelectedChoices);

  // Calculate the score for the current competency
  const competencyScore = calculateScore(updatedSelectedChoices, competencyId);
  updateCompetencyScore(competencyId, competencyScore);
};


const [localSelectedCompetency, setLocalSelectedCompetency] = useState('All Competency');

  // Function to filter questions based on selected competency
  const filteredQuestionsByCompetency = localSelectedCompetency === 'All Competency'
    ? filteredQuestions
    : filteredQuestions.filter(question => question.competency_id === localSelectedCompetency);

  // Function to calculate the total score for selected questions
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

    const response = await axios.post('http://localhost:3001/exam-room/end-exam-room', {
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

const nextPage = () => {
  const nextPage = Math.min(currentPage + 1, totalPages); // Ensure we don't go beyond the last page
  const nextQuestion = (nextPage - 1) * questionsPerPage;
  setCurrentQuestion(nextQuestion);
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
      <div className="flex flex-col lg:flex-row text-center dark:bg-slate-900 py-4 header-bg shadow-md text-lg font-semibold dark:text-white">
        
        {selectedTime > 0 && (
            <div className="flex items-center">
              {formatTime(num)}
              {!countdownStarted ? (
                null
              ) : (
                <button className="text-red-700" disabled>
                  Counting Down
                </button>
              )}
            </div>
          )}
      </div>

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
                      onClick={() => {
                        // Add the console.log statement here
                        console.log('selectedChoices before update:', selectedChoices);
                        handleChoiceClick(currentQuestion + index, choice);
                        console.log('selectedChoices after update:', selectedChoices);
                      }}
                      className={classNames(
                        "container btn-container items-center flex border border-gray-700 mb-2 rounded-3xl cursor-pointer",
                        {
                          "bg-indigo-700 text-white": selectedChoices[currentQuestion + index] === choice,
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
            <div className="flex justify-center p-4">
            <div className="justify-center items-center">
              <button
          className="relative rounded h-10 mr-2 bg-indigo-700 px-3 py-1.5 text-sm font-medium text-white transition-all duration-300 flex"
          onClick={handleFinishExam}
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
                : "hover:bg-indigo-600 text-white"
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

export default ExamStart;
