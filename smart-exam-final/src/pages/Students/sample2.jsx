import { useEffect, useState, useCallback, useRef } from "react";
import Select from 'react-select';
import axios from 'axios';
import EndExam from './EndExam';

function Exam() {
  const [currentExams, setcurrentExams] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [maxQuestions, setMaxQuestions] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProgram, setSelectedProgram] = useState({ value: 'Social Work', label: 'Social Work' });
  const [selectedCompetency, setSelectedCompetency] = useState(null);
  const [userExamId, setUserExamId] = useState(null);
  const [examData, setExamData] = useState({
    questions: [],
    selectedChoices: [],
  });
  const [selectedChoices, setSelectedChoices] = useState(Array(maxQuestions).fill(null));
  const questionsPerPage = 5;
  const [examStartTime, setExamStartTime] = useState(null);
  const [num, setNum] = useState(0);
  const [selectedTime, setSelectedTime] = useState(1);
  const [countdownStarted, setCountdownStarted] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

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
  

  const getExamData = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3001/questions/fetch');
      console.log('Response data:', response.data);
      setcurrentExams(response.data);
      setMaxQuestions(response.data.length);
      setCurrentQuestion(0);
      setSelectedChoices(Array(response.data.length).fill(-1));
      setDataLoaded(true);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []); // Use an empty dependency array because there are no dependencies
  
  useEffect(() => {
    getExamData();
  }, []);
  

  const handleChoiceClick = (choiceIndex, choice) => {
    const updatedSelectedChoices = [...selectedChoices];
    updatedSelectedChoices[choiceIndex] = choice;
    setSelectedChoices(updatedSelectedChoices);
  };
  
  
  const handleStartExam = async () => {
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
        end_time: null,
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
  
  
  const calculateScore = (questions, selectedChoices) => {
    let score = 0;
  
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
  
      // Check if 'question' and 'choices' are defined
      if (question && question.choices) {
        const correctChoiceIndex = question.choices.findIndex(
          (choice) => choice.is_correct
        );
  
        if (selectedChoices[i] === correctChoiceIndex) {
          // Increment the score for a correct answer
          score += 1; // You can adjust the scoring logic as needed
        }
      }
    }
  console.log("score: ", score)
    return score;
  };
  
const handleEndExamButtonClick = async () => {
  try {
    // Calculate the user's score
    const userScore = calculateScore(currentExams, selectedChoices);

    // Calculate total_duration_minutes
    const endTime = new Date();
    const durationMilliseconds = endTime - user_exam_id[0].examStartTime;
    const total_duration_minutes = Math.floor(durationMilliseconds / 60000);

    // Reset the exam timer
    const user_exam_id = userExamId;

    await axios.put(`http://localhost:3001/exams/user-exams/${user_exam_id}`, {
      score: userScore,
      total_duration_minutes,
      endTime,
    });
    // Display the exam summary to the user
  } catch (error) {
    console.error('Error ending exam:', error);
  }
};

const EndExamComponent = () => {
  return (
    <EndExam
      userScore={userScore}
      questions={currentExams}
      onClose={() => setCurrentQuestion(maxQuestions)} // Close the end screen and show the end of exam summary
    />
  );
};
  
  const [filteredQuestions, setFilteredQuestions] = useState([]);

  // Use a separate useEffect to refresh the data
  const refresh = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3001/questions/refresh');
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
  
          setcurrentExams(response.data);
          setMaxQuestions(response.data.length);
          setCurrentQuestion(0);
          setSelectedChoices(Array(response.data.length).fill(-1));
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    fetchData();
  }, [selectedProgram, selectedCompetency]);
  
  const renderQuestions = () => {
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = Math.min(startIndex + questionsPerPage, maxQuestions);
  const { questions, selectedChoices } = examData;

  if (!filteredQuestions || filteredQuestions.length === 0) {
    // Handle the case when filteredQuestions is empty or not yet loaded
    return (
      <div className="text-center">
        Loading questions...
      </div>
    );
  }
  
    return filteredQuestions
      .slice(startIndex, endIndex)
      .map((question, questionIndex) => (
        <div
          key={questionIndex}
          className="border-2 shadow-lg items-center justify-center my-2"
        >
          {/* Render each question component */}
          <div className="text-xl text-center dark:text-white btn-primary">
            Question {startIndex + questionIndex + 1}/{maxQuestions}
          </div>
          <div className="p-3 dark:text-white text-2xl text-center">
            {question.questionText}
          </div>
          <div id="answers-container" className="p-3">
            {question.choices && question.choices.map((choice, choiceIndex) => (
                <div
    key={choiceIndex}
    className={`container btn-container items-center flex border border-gray-700 mb-2 rounded-3xl cursor-pointer ${
      selectedChoices[startIndex + questionIndex] === choiceIndex
        ? "bg-blue-500 text-white" // Apply bg-blue-500 and text-white when selected
        : ""
    }`}
    onClick={(el) => {
      console.log("Choice clicked: questionIndex =", questionIndex, "choiceIndex =", choiceIndex);
      console.log("Current question:", question);
      handleChoiceClick(questionIndex, choiceIndex, startIndex, el);
    }}
  >
                <div className="dark:text-white py-2 px-4 bg-gray-700 text-white font-bold text-lg rounded-3xl m-1 shadow-md btn-primary">
                  {String.fromCharCode(65 + choiceIndex)}
                </div>
                <div className="dark:text-white py-2 px-4 text-gray-700 font-semibold">
                  {choice.choiceText}
                </div>
              </div>
            ))}
          </div>
          
        </div>
      ));
  };
  
  

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

  const totalPages = Math.ceil(maxQuestions / questionsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const previousPage = () => {
    goToPage(currentPage - 1);
  };

  const nextPage = () => {
    goToPage(currentPage + 1);
  };
  return (
    <div className="container min-h-screen h-auto items flex flex-col">
        <div className="flex flex-col lg:flex-row text-center py-4 header-bg shadow-md text-lg font-semibold dark:text-white">
    <div className="flex flex-col lg:flex-row gap-8 justify-center items-center mx-auto dark:text-white">
        <div className="mb-4 lg:w-72">
        <Select
            placeholder="Program"
            id="program"
            name="program"
            value={selectedProgram}
            onChange={(selectedOption) => setSelectedProgram(selectedOption)}
            options={programOptions}
        />
        </div>

        <div className="mb-4 lg:w-72">
        <Select
            placeholder="Competency"
            id="competency"
            name="competency"
            value={selectedCompetency}
            onChange={(selectedOption) => setSelectedCompetency(selectedOption)}
            options={competencyOptions}
        />
        </div>
        <div className="mb-4 lg:w-72">
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
                <button onClick={handleStartExam}>Start</button>
                ) : (
                <button disabled>Counting Down</button>
                )}
            </div>
            )}
        </div>

    </div>

      {currentQuestion !== maxQuestions ? (
        <>
          {renderQuestions()}
          <div className="container text-center header-bg p-2 text-gray-800 mt-auto">
          <div className="flex justify-center mx-auto dark:text-white">
          <button
              onClick={handleEndExamButtonClick}
              className="relative block rounded bg-blue-700 px-3 py-1.5 text-xl font-medium text-gray-700 transition-all duration-300"
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
                {currentPage > 1 && (
                  <button
                    className="relative block rounded bg-primary-100 px-3 py-1.5 text-sm font-medium text-primary-700 transition-all duration-300"
                    onClick={previousPage}
                  >
                    Previous
                  </button>
                )}
              </li>
              {Array.from({ length: totalPages }, (v, i) => (
                <li key={i}>
                  <button
                    className={`relative block rounded bg-transparent px-3 py-1.5 text-sm ${
                      i + 1 === currentPage
                        ? "font-medium text-primary-700 bg-primary-100"
                        : "text-neutral-600"
                    } transition-all duration-300`}
                    onClick={() => goToPage(i + 1)}
                  >
                    {i + 1}
                    {i + 1 === currentPage && (
                      <span className="absolute -m-px h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)]">
                        (current)
                      </span>
                    )}
                  </button>
                </li>
              ))}
              <li>
                {currentPage < totalPages && (
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
        </>
      ) : (
        <EndExamComponent />
      )}
    </div>
  );
}

export default Exam;