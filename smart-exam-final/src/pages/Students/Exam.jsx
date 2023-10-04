import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import classNames from "classnames";
import Select from 'react-select';

function Exam() {
  const [showResults, setShowResults] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [userExamId, setUserExamId] = useState(null);
  const [questionData, setQuestionData] = useState([]);
  const [selectedChoices, setSelectedChoices] = useState(Array(3).fill(null)); // Adjust the number of questions
  const questionsPerPage = 2; // Adjust the number of questions per page
  const [selectedProgram, setSelectedProgram] = useState({ value: 'Social Work', label: 'Social Work' });
  const [selectedCompetency, setSelectedCompetency] = useState(null);

  const getExamData = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:3001/questions/fetch"); // Adjust the URL
      console.log("Response data:", response.data);
      setQuestionData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
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
  
          if (selectedCompetency?.value === 'All Competency') {
            // If "All Competency" is selected, fetch questions for all available competencies
            const competencies = ['SWPPS', 'Casework', 'HBSE']; // Replace with your predefined competencies
            const allQuestions = [];
  
            // Fetch questions for each competency and merge the results
            for (const competency of competencies) {
              const competencyResponse = await axios.get(
                `http://localhost:3001/filter/filterQuestions?programs=${selectedProgram.label || ''}&competency=${competency}`
              );
              allQuestions.push(...competencyResponse.data);
            }
  
            response = { data: allQuestions };
          } else if (selectedCompetency) {
            // Fetch questions for the selected competency
            response = await axios.get(
              `http://localhost:3001/filter/filterQuestions?programs=${selectedProgram.label || ''}&competency=${selectedCompetency.value || ''}`
            );
          } else {
            // If no competency is selected, use all questions
            await getExamData();
            return; // Exit early to avoid setting state again
          }
  
          // setcurrentExams(response.data);
          // setMaxQuestions(response.data.length);
          setCurrentQuestion(0);
          // setSelectedChoices(Array(response.data.length).fill(-1));
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
    setSelectedChoices(Array(3).fill(null)); // Reset selected answers
    setScore(0); // Reset the score
    setCurrentQuestion(0);
    setShowResults(false);
    setCountdownStarted(false);
  };

  const isLastPage = currentQuestion + questionsPerPage >= questionData.length;
  const isFirstPage = currentQuestion === 0;

  const renderResult = () => {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Final Results</h1>
        {questionData.map((question, index) => (
          <div key={index} className="mb-4">
            <h2 className="text-xl text-center dark:text-white btn-primary">Question {index + 1}</h2>
            <p className="mb-2">{question.questionText}</p>
            <ul>
              {question.choices.map((choice, choiceIndex) => (
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
        <h2 className="flex mb-4 mx-auto justify-center">
          Score: {calculateScore()} out of {questionData.length} correct - ({((calculateScore() / questionData.length) * 100).toFixed(2)}%)
        </h2>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          onClick={resetGame}
        >
          Restart Game
        </button>
      </div>
    );
  };

  // Define your Select options
  const programOptions = [
    { value: 'Social Work', label: 'Bachelor of Science in Social Work' },
    { value: 'Option', label: 'Option' },
  ];

  const competencyOptions = [
    { value: 'All Competency', label: 'All Competency' },
    { value: 'SWPPS', label: 'Math' },
    { value: 'Casework', label: 'Science' },
    { value: 'HBSE', label: 'English' },
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
      const startTime = examStartTime;
      const durationMilliseconds = endTime - startTime;
      const total_duration_minutes = durationMilliseconds % 60;
  
      const response = await axios.post('http://localhost:3001/exams/end-exam', {
        exam_id: user_exam_id, // Replace with the actual exam ID
        score: calculateScore(), // Replace with your score calculation logic
        total_duration_minutes,
        endTime, // Send the endTime to the backend
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


  return (
    <div className="container min-h-screen h-auto items flex flex-col">
      <div className="flex flex-col lg:flex-row text-center py-4 header-bg shadow-md text-lg font-semibold dark:text-white">
          <div className="flex flex-col lg:flex-row md:col-4 sm:col-2 gap-5 justify-center items-center mx-auto dark:text-white">
            <div className="mb-4 lg:w-72 md:w-36 sm:w-16">
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
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                onClick={startExam}
                disabled={!selectedProgram || !selectedCompetency || !selectedTime}
              >
                Start
              </button>
              
                ) : (
                <button disabled>Counting Down</button>
                )}
            </div>
            )}
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-4 mx-auto justify-center">Pre-board Exam</h1>

        {!showResults && (
          <div>
            {questionData.slice(currentQuestion, currentQuestion + questionsPerPage).map((question, index) => (
              <div key={index} className="border-2 dark:border-0 shadow-lg items-center justify-center my-2 mb-4">
                <h2 className="text-xl text-center dark:text-white btn-primary">Question {currentQuestion + index + 1}</h2>
                <p className="p-3 dark:text-white text-2xl text-center">{question.questionText}</p>
                <ul>
                  {question.choices.map((choice, choiceIndex) => (
                    <li
                      key={choiceIndex}
                      onClick={() => handleChoiceClick(currentQuestion + index, choice)}
                      className={classNames(
                        "container btn-container items-center flex border border-gray-700 mb-2 rounded-3xl cursor-pointer",
                        {
                          "bg-blue-300": selectedChoices[currentQuestion + index] === choice,
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

            <div className="flex justify-between">
              {!isFirstPage && (
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                  onClick={prevPage}
                >
                  Back
                </button>
              )}

              {isLastPage ? (
                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                    onClick={handleFinishExam}
                  >
                    Finish
                  </button>
              ) : (
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                  onClick={nextPage}
                >
                  Next
                </button>
              )}
            </div>
          </div>
        )}

        {showResults && renderResult()}
    </div>
  );
}

export default Exam;
